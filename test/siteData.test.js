import assert from "node:assert/strict";
import test from "node:test";
import { firmContact, team } from "../src/data/siteData.js";

test("uses the official contact details", () => {
  assert.equal(firmContact.email, "info2026akollegalservices@gmail.com");
  assert.equal(firmContact.whatsappDisplay, "+211 912 374 000");
  assert.equal(firmContact.whatsapp, "211912374000");
});

test("uses the updated lead counsel name", () => {
  assert.equal(team[0].name, "Marco Akol Deng");
});
