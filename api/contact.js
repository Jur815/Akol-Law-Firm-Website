import { isIP } from "node:net";
import { validateContactPayload } from "../src/utils/contactValidation.js";

const resendEndpoint = "https://api.resend.com/emails";
const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const maxBodyBytes = 32 * 1024;
const jsonContentType = /^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?$/i;
const rateLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: maxRequestsPerWindow,
  maxEntries: 2048,
});
// Keep delivery on the working mailbox until info@als-ss.com is configured for real email.
const defaultRecipientEmail = "info2026akollegalservices@gmail.com";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  if (process.env.VERCEL === "1") {
    // Use Vercel's platform-supplied client address, never the proxy socket.
    const forwardedFor = req.headers["x-vercel-forwarded-for"];
    const clientIp = typeof forwardedFor === "string" ? forwardedFor.trim() : "";
    return isIP(clientIp) ? clientIp : null;
  }

  const clientIp = req.socket?.remoteAddress ?? "";
  return isIP(clientIp) ? clientIp : null;
}

function createRateLimiter({ windowMs, maxRequests, maxEntries }) {
  const clients = new Map();
  let nextCleanup = 0;

  return function checkRateLimit(clientIp, now = Date.now()) {
    if (now >= nextCleanup) {
      for (const [ip, record] of clients) {
        if (record.resetAt <= now) clients.delete(ip);
      }
      nextCleanup = now + windowMs;
    }

    const record = clients.get(clientIp);
    if (record && now < record.resetAt) {
      if (record.count >= maxRequests) {
        return Math.ceil((record.resetAt - now) / 1000);
      }

      record.count += 1;
      return null;
    }

    clients.delete(clientIp);
    if (clients.size >= maxEntries) clients.delete(clients.keys().next().value);
    clients.set(clientIp, { count: 1, resetAt: now + windowMs });
    return null;
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textEmail(values) {
  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone}`,
    `Subject: ${values.subject}`,
    "",
    "Message:",
    values.message,
  ].join("\n");
}

function htmlEmail(values) {
  const rows = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Subject", values.subject],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
      <h1 style="font-size:20px;margin:0 0 16px">New website contact request</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" style="border:1px solid #e5e7eb;background:#f9fafb;width:120px">${escapeHtml(label)}</th>
                <td style="border:1px solid #e5e7eb">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2 style="font-size:16px;margin:20px 0 8px">Message</h2>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(values.message)}</p>
    </div>
  `;
}

class BodyTooLargeError extends Error {}

function checkBodySize(bytes) {
  if (bytes > maxBodyBytes) throw new BodyTooLargeError();
}

function parseBodyBytes(bytes) {
  checkBodySize(bytes.length);
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

async function readBody(req) {
  const contentLength = req.headers["content-length"];
  if (contentLength !== undefined) {
    if (typeof contentLength !== "string" || !/^\d+$/.test(contentLength)) {
      throw new Error("Invalid Content-Length");
    }
    checkBodySize(Number(contentLength));
  }

  // Vercel may pre-buffer the request and replay the original bytes via read().
  if (req.readableEnded && typeof req.read === "function") {
    const replay = req.read(maxBodyBytes + 1);
    if (replay !== null) return parseBodyBytes(Buffer.from(replay));
  }

  const hasBodyGetter = Boolean(Object.getOwnPropertyDescriptor(req, "body")?.get);
  const body = req.body;
  if (body !== undefined) {
    if (Buffer.isBuffer(body)) return parseBodyBytes(body);
    if (typeof body === "string" && !hasBodyGetter) {
      checkBodySize(Buffer.byteLength(body));
      return JSON.parse(body);
    }

    // When a runtime supplies only a parsed value, the wire bytes are unavailable.
    checkBodySize(Buffer.byteLength(JSON.stringify(body)));
    return body;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    const bytes = Buffer.from(chunk);
    size += bytes.length;
    if (size > maxBodyBytes) {
      req.resume();
      throw new BodyTooLargeError();
    }
    chunks.push(bytes);
  }
  return parseBodyBytes(Buffer.concat(chunks, size));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    sendJson(res, 405, { message: "Method not allowed." });
    return;
  }

  const clientIp = getClientIp(req);
  const retryAfter = clientIp ? rateLimiter(clientIp) : null;
  if (retryAfter !== null) {
    res.setHeader("Retry-After", String(retryAfter));
    sendJson(res, 429, {
      message: "Too many requests. Please wait before trying again.",
    });
    return;
  }

  const contentType = req.headers["content-type"];
  const contentEncoding = req.headers["content-encoding"] ?? "identity";
  if (
    typeof contentType !== "string" ||
    !jsonContentType.test(contentType.trim()) ||
    typeof contentEncoding !== "string" ||
    contentEncoding.trim().toLowerCase() !== "identity"
  ) {
    sendJson(res, 415, { message: "Send the request as uncompressed UTF-8 application/json." });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      sendJson(res, 413, { message: "Request body exceeds 32 KiB." });
    } else {
      sendJson(res, 400, { message: "Invalid JSON request body." });
    }
    return;
  }

  const validation = validateContactPayload(payload);

  if (!validation.values) {
    sendJson(res, 400, { message: "Expected a JSON object with contact fields as strings." });
    return;
  }

  if (!validation.isValid) {
    sendJson(res, 400, {
      message: "Please correct the highlighted fields.",
      errors: validation.errors,
    });
    return;
  }

  if (validation.values.company) {
    sendJson(res, 202, { message: "Request accepted." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_RECIPIENT_EMAIL || defaultRecipientEmail;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    sendJson(res, 500, {
      message: "Contact email is not configured. Please try again later.",
    });
    return;
  }

  const { values } = validation;
  const resendResponse = await fetch(resendEndpoint, {
    method: "POST",
    signal: AbortSignal.timeout(8_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: values.email,
      subject: `Website contact: ${values.subject}`,
      text: textEmail(values),
      html: htmlEmail(values),
    }),
  }).catch(() => null);

  if (!resendResponse?.ok) {
    sendJson(res, 502, {
      message: "Email delivery could not be confirmed. Please contact the firm directly.",
    });
    return;
  }

  sendJson(res, 200, { message: "Message sent successfully." });
}

export const internals = {
  createRateLimiter,
  defaultRecipientEmail,
  escapeHtml,
  htmlEmail,
  readBody,
  textEmail,
};
