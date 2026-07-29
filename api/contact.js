import { validateContactPayload } from "../src/utils/contactValidation.js";

const resendEndpoint = "https://api.resend.com/emails";
const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const rateLimitStore = new Map();
// Keep delivery on the working mailbox until info@als.com is configured for real email.
const defaultRecipientEmail = "info2026akollegalservices@gmail.com";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  record.count += 1;
  return record.count > maxRequestsPerWindow;
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

async function readBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
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
    sendJson(res, 405, { message: "Method not allowed." });
    return;
  }

  if (isRateLimited(getClientIp(req))) {
    sendJson(res, 429, {
      message: "Too many requests. Please wait before trying again.",
    });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    sendJson(res, 400, { message: "Invalid JSON request body." });
    return;
  }

  const validation = validateContactPayload(payload);

  if (validation.values.company) {
    sendJson(res, 202, { message: "Request accepted." });
    return;
  }

  if (!validation.isValid) {
    sendJson(res, 400, {
      message: "Please correct the highlighted fields.",
      errors: validation.errors,
    });
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
  });

  if (!resendResponse.ok) {
    sendJson(res, 502, {
      message: "The email provider did not accept the request.",
    });
    return;
  }

  sendJson(res, 200, { message: "Message sent successfully." });
}

export const internals = {
  defaultRecipientEmail,
  escapeHtml,
  htmlEmail,
  isRateLimited,
  readBody,
  textEmail,
};
