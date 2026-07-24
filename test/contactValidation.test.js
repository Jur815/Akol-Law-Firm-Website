import assert from "node:assert/strict";
import test from "node:test";
import { validateContactPayload } from "../src/utils/contactValidation.js";
import handler, { internals } from "../api/contact.js";

test("validates required contact fields", () => {
  const result = validateContactPayload({});

  assert.equal(result.isValid, false);
  assert.equal(result.errors.name, "This field is required.");
  assert.equal(result.errors.email, "This field is required.");
});

test("accepts a complete contact payload", () => {
  const result = validateContactPayload({
    name: "Jane Client",
    email: "Jane@example.com",
    phone: "+211 923 433 113",
    subject: "Contract review",
    message: "I would like help reviewing a commercial contract this week.",
  });

  assert.equal(result.isValid, true);
  assert.equal(result.values.email, "jane@example.com");
});

test("escapes submitted content for html email", () => {
  const html = internals.htmlEmail({
    name: "<script>",
    email: "client@example.com",
    phone: "+211 923 433 113",
    subject: "Question",
    message: "Hello <strong>team</strong>",
  });

  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;strong&gt;team&lt;\/strong&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test("contact form defaults to the official recipient email", () => {
  assert.equal(
    internals.defaultRecipientEmail,
    "info2026akollegalservices@gmail.com",
  );
});

test("contact API sends submissions to the official recipient by default", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    apiKey: process.env.RESEND_API_KEY,
    recipient: process.env.CONTACT_RECIPIENT_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL,
  };
  let sentPayload;

  globalThis.fetch = async (_url, options) => {
    sentPayload = JSON.parse(options.body);
    return { ok: true };
  };
  process.env.RESEND_API_KEY = "test-key";
  delete process.env.CONTACT_RECIPIENT_EMAIL;
  process.env.CONTACT_FROM_EMAIL = "Akol For Legal Services <website@example.com>";

  const req = {
    method: "POST",
    headers: {},
    socket: { remoteAddress: "contact-api-default-recipient-test" },
    body: {
      name: "Jane Client",
      email: "jane@example.com",
      phone: "+211 923 433 113",
      subject: "Contract review",
      message: "I would like help reviewing a commercial contract this week.",
    },
  };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body;
    },
  };

  try {
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(sentPayload.to, "info2026akollegalservices@gmail.com");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEnv.apiKey === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = originalEnv.apiKey;
    }
    if (originalEnv.recipient === undefined) {
      delete process.env.CONTACT_RECIPIENT_EMAIL;
    } else {
      process.env.CONTACT_RECIPIENT_EMAIL = originalEnv.recipient;
    }
    if (originalEnv.from === undefined) {
      delete process.env.CONTACT_FROM_EMAIL;
    } else {
      process.env.CONTACT_FROM_EMAIL = originalEnv.from;
    }
  }
});
