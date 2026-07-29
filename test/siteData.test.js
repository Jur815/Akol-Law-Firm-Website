import assert from "node:assert/strict";
import test from "node:test";
import handler, { internals } from "../api/contact.js";
import { firmContact, practiceAreas, team } from "../src/data/siteData.js";
import { validateContactPayload } from "../src/utils/contactValidation.js";

test("uses the official contact details", () => {
  assert.equal(firmContact.email, "info@als.com");
  assert.equal(firmContact.whatsappDisplay, "+211 912 374 000");
  assert.equal(firmContact.whatsapp, "211912374000");
});

test("uses the updated lead counsel name", () => {
  assert.equal(team[0].name, "Marco Akol Deng");
  assert.equal(team[0].role, "Founder & Chief Executive Officer");
});

test("includes Marco Akol Deng's verified professional profile details", () => {
  const marco = team.find((member) => member.slug === "marco-akol-deng");

  assert.ok(marco);
  assert.equal(marco.credentials, "Advocate & Commissioner for Oaths");
  assert.ok(marco.qualifications.includes("Commissioner for Oaths"));
  assert.ok(
    marco.leadership.includes(
      "General Secretary, South Sudan Athletics Federation",
    ),
  );
  assert.ok(marco.expertise.includes("Sports Law"));
});

test("includes the Sports Law and Governance service", () => {
  const sportsLaw = practiceAreas.find(
    (service) => service.slug === "sports-law-governance",
  );

  assert.ok(sportsLaw);
  assert.equal(sportsLaw.title, "Sports Law and Governance");
  assert.ok(sportsLaw.services.includes("Sports dispute resolution"));
});

test("validates required contact fields", () => {
  const result = validateContactPayload({});

  assert.equal(result.isValid, false);
  assert.equal(result.errors.name, "This field is required.");
  assert.equal(result.errors.email, "This field is required.");
  assert.equal(result.errors.phone, "This field is required.");
  assert.equal(result.errors.subject, "This field is required.");
  assert.equal(result.errors.message, "This field is required.");
});

test("rejects invalid email addresses", () => {
  const result = validateContactPayload({
    name: "Jane Client",
    email: "not-an-email",
    phone: "+211 912 374 000",
    subject: "Legal Consultation Request - Corporate Law",
    message: "I would like help reviewing a commercial contract this week.",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, "Enter a valid email address.");
});

test("contact form defaults to the official temporary recipient email", () => {
  assert.equal(internals.defaultRecipientEmail, "info2026akollegalservices@gmail.com");
});

test("contact API sends successful submissions", async () => {
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
    socket: { remoteAddress: "contact-api-success-test" },
    body: {
      name: "Jane Client",
      email: "jane@example.com",
      phone: "+211 912 374 000",
      subject: "Legal Consultation Request - Corporate Law",
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
    assert.equal(JSON.parse(res.body).message, "Message sent successfully.");
    assert.equal(sentPayload.to, "info2026akollegalservices@gmail.com");
    assert.equal(sentPayload.reply_to, "jane@example.com");
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv(originalEnv);
  }
});

test("contact API reports missing email service configuration", async () => {
  const originalEnv = {
    apiKey: process.env.RESEND_API_KEY,
    recipient: process.env.CONTACT_RECIPIENT_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL,
  };

  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_RECIPIENT_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;

  const req = {
    method: "POST",
    headers: {},
    socket: { remoteAddress: "contact-api-config-test" },
    body: {
      name: "Jane Client",
      email: "jane@example.com",
      phone: "+211 912 374 000",
      subject: "Legal Consultation Request - Corporate Law",
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

    assert.equal(res.statusCode, 500);
    assert.equal(
      JSON.parse(res.body).message,
      "Contact email is not configured. Please try again later.",
    );
  } finally {
    restoreEnv(originalEnv);
  }
});

function restoreEnv(originalEnv) {
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
