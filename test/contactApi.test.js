import assert from "node:assert/strict";
import { PassThrough, Readable } from "node:stream";
import test from "node:test";
import handler, { internals } from "../api/contact.js";
import { contactFieldLimits } from "../src/utils/contactValidation.js";

const maxBodyBytes = 32 * 1024;
const jsonHeaders = { "content-type": "application/json" };
const validPayload = {
  name: "Nöel Ŋarɛk 李",
  email: " Visitor@Example.com ",
  phone: "+211 (912) 374-000",
  subject: "Legal consultation",
  message: "I would like advice about a commercial contract.",
};

async function invoke(req) {
  const res = {
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.body = JSON.parse(body);
    },
  };
  req.method = "POST";
  req.headers ??= jsonHeaders;
  await handler(req, res);
  assert.equal(res.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(typeof res.body.message, "string");
  return res;
}

function mockDelivery(t) {
  const config = {
    RESEND_API_KEY: "mock-key",
    CONTACT_FROM_EMAIL: "ALS <website@example.com>",
    CONTACT_RECIPIENT_EMAIL: "inbox@example.com",
  };
  const priorConfig = Object.fromEntries(Object.keys(config).map((key) => [key, process.env[key]]));
  Object.assign(process.env, config);
  t.after(() => {
    for (const [key, value] of Object.entries(priorConfig)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  return t.mock.method(globalThis, "fetch", async () => ({ ok: true }));
}

test("rejects missing and unsupported content types and encodings", async (t) => {
  const delivery = mockDelivery(t);
  for (const headers of [
    {},
    { "content-type": "text/plain" },
    { "content-type": "application/x-www-form-urlencoded" },
    { "content-type": "application/json; charset=utf-16" },
    { ...jsonHeaders, "content-encoding": "gzip" },
  ]) {
    assert.equal((await invoke({ headers, body: validPayload })).statusCode, 415);
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test("rejects malformed JSON and payloads without the expected string fields", async (t) => {
  const delivery = mockDelivery(t);
  for (const body of [
    "{",
    "",
    [],
    null,
    true,
    JSON.stringify(JSON.stringify(validPayload)),
    { ...validPayload, name: null },
    { ...validPayload, phone: 211912374000 },
    { ...validPayload, subject: ["Legal consultation"] },
    { ...validPayload, message: { text: "Hello" } },
    { ...validPayload, company: false },
    { ...validPayload, extra: "Unexpected" },
  ]) {
    assert.equal((await invoke({ body })).statusCode, 400);
  }
  assert.equal((await invoke({ get body() { return JSON.stringify(validPayload); } })).statusCode, 400);
  assert.equal((await invoke({ get body() { throw new SyntaxError("Invalid JSON"); } })).statusCode, 400);
  assert.equal((await invoke({ body: Buffer.from([0xff]) })).statusCode, 400);
  assert.equal(delivery.mock.callCount(), 0);
});

test("enforces required fields and contact field boundaries", async (t) => {
  const delivery = mockDelivery(t);
  const missing = await invoke({ body: {} });
  assert.equal(missing.statusCode, 400);
  assert.deepEqual(Object.keys(missing.body.errors), Object.keys(contactFieldLimits));

  for (const [field, limit] of Object.entries(contactFieldLimits)) {
    const res = await invoke({ body: { ...validPayload, [field]: "x".repeat(limit + 1) } });
    assert.equal(res.statusCode, 400);
    assert.ok(res.body.errors[field]);
  }
  for (const [field, value] of [["phone", "(---) --"], ["email", "invalid"], ["message", "a".repeat(19)]]) {
    const res = await invoke({ body: { ...validPayload, [field]: value } });
    assert.equal(res.statusCode, 400);
    assert.ok(res.body.errors[field]);
  }
  assert.equal(delivery.mock.callCount(), 0);

  const allowed = await invoke({
    body: { ...validPayload, name: "é".repeat(80), message: "漢".repeat(2500) },
  });
  assert.equal(allowed.statusCode, 200);
  assert.equal((await invoke({ body: { ...validPayload, message: "a".repeat(20) } })).statusCode, 200);
  assert.equal(delivery.mock.callCount(), 2);
});

test("accepts Unicode and international numbers and preserves the delivery contract", async (t) => {
  const delivery = mockDelivery(t);
  const res = await invoke({
    headers: { "content-type": 'Application/JSON; Charset="UTF-8"' },
    body: Buffer.from(JSON.stringify(validPayload)),
  });
  assert.equal(res.statusCode, 200);
  assert.equal(delivery.mock.callCount(), 1);
  const [url, options] = delivery.mock.calls[0].arguments;
  const email = JSON.parse(options.body);
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(options.method, "POST");
  assert.equal(options.headers.Authorization, "Bearer mock-key");
  assert.equal(email.from, "ALS <website@example.com>");
  assert.equal(email.to, "inbox@example.com");
  assert.equal(email.reply_to, "visitor@example.com");
  assert.ok(email.text.includes(validPayload.name));
  assert.ok(email.text.includes(validPayload.phone));
});

test("counts wire bytes in streamed and Vercel replayed requests", async (t) => {
  const delivery = mockDelivery(t);
  const json = Buffer.from(JSON.stringify(validPayload));
  const atLimit = Buffer.concat([json, Buffer.alloc(maxBodyBytes - json.length, " ")]);
  const overLimit = Buffer.concat([atLimit, Buffer.from(" ")]);

  for (const [body, expected] of [[atLimit, 200], [overLimit, 413]]) {
    const stream = Readable.from([body.subarray(0, 12), body.subarray(12)]);
    assert.equal((await invoke(stream)).statusCode, expected);

    const replay = new PassThrough();
    replay.end(body);
    const req = {
      readableEnded: true,
      read: replay.read.bind(replay),
      get body() { throw new Error("The replay provides the original bytes"); },
    };
    assert.equal((await invoke(req)).statusCode, expected);
  }
  assert.equal(delivery.mock.callCount(), 2);
});

test("rejects oversized declared or pre-parsed requests", async (t) => {
  const delivery = mockDelivery(t);
  let parsed = false;
  const oversized = await invoke({
    headers: { ...jsonHeaders, "content-length": String(maxBodyBytes + 1) },
    get body() { parsed = true; return validPayload; },
  });
  assert.equal(oversized.statusCode, 413);
  assert.equal(parsed, false);
  assert.equal((await invoke({
    body: { ...validPayload, message: "漢".repeat(11_000) },
  })).statusCode, 413);
  assert.equal((await invoke({
    body: JSON.stringify(validPayload) + " ".repeat(maxBodyBytes),
  })).statusCode, 413);
  assert.equal((await invoke({
    headers: { ...jsonHeaders, "content-length": "invalid" },
    body: validPayload,
  })).statusCode, 400);
  assert.equal(delivery.mock.callCount(), 0);
});

test("suppresses filled honeypots while allowing blank or omitted values", async (t) => {
  const delivery = mockDelivery(t);
  assert.equal((await invoke({ body: { ...validPayload, company: "Autofilled value" } })).statusCode, 202);
  assert.equal(delivery.mock.callCount(), 0);
  for (const payload of [validPayload, { ...validPayload, company: "" }, { ...validPayload, company: " " }]) {
    assert.equal((await invoke({ body: payload })).statusCode, 200);
  }
  assert.equal(delivery.mock.callCount(), 3);
});

test("returns 429 with Retry-After using the Vercel client address", async (t) => {
  const delivery = mockDelivery(t);
  const previousVercelValue = process.env.VERCEL;
  process.env.VERCEL = "1";
  t.after(() => {
    if (previousVercelValue === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercelValue;
  });

  for (const ip of ["198.51.100.10", "2001:db8::1"]) {
    const req = {
      headers: { ...jsonHeaders, "x-vercel-forwarded-for": ip },
      socket: { remoteAddress: "127.0.0.1" },
      body: validPayload,
    };
    for (let count = 0; count < 5; count += 1) {
      assert.equal((await invoke(req)).statusCode, 200);
    }
    const limited = await invoke(req);
    assert.equal(limited.statusCode, 429);
    const retryAfter = Number(limited.headers["retry-after"]);
    assert.ok(Number.isInteger(retryAfter) && retryAfter >= 1 && retryAfter <= 900);
  }
  assert.equal(delivery.mock.callCount(), 10);
});

test("the local rate limiter expires entries and keeps a bounded number of clients", () => {
  const check = internals.createRateLimiter({ windowMs: 3000, maxRequests: 1, maxEntries: 2 });
  assert.equal(check("client-a", 0), null);
  assert.equal(check("client-a", 1), 3);
  assert.equal(check("client-a", 2001), 1);
  assert.equal(check("client-b", 2002), null);
  assert.equal(check("client-c", 2003), null);
  assert.equal(check("client-b", 2999), 3);
  assert.equal(check("client-a", 3000), null); // Evicts active client B.
  assert.equal(check("client-c", 5003), null); // A window resets at its exact boundary.

  const sweep = internals.createRateLimiter({ windowMs: 3000, maxRequests: 1, maxEntries: 2 });
  assert.equal(sweep("client-a", 0), null);
  assert.equal(sweep("client-b", 2999), null);
  assert.equal(sweep("client-c", 3000), null);
  assert.equal(sweep("client-b", 3001), 3); // Expired client A used no capacity.
});
