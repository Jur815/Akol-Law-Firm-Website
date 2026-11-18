import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getCanonicalPath, getPageMetadata, pageMetadata } from "../src/data/pageMetadata.js";
import viteConfig from "../vite.config.js";

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const redirects = vercel.redirects.map((entry) => ({
  ...entry,
  pattern: new RegExp(`^${entry.source}$`),
}));
const nonPagePaths = ["/api/contact", "/API/Contact", "/assets/Team.js", "/favicon.ico", "/Team/unknown", "/unknown"];

test("canonical path normalization preserves page-specific metadata", () => {
  assert.equal(getCanonicalPath("/"), "/");
  for (const path of Object.keys(pageMetadata).filter((key) => key !== "/")) {
    const mixed = path[0] + path[1].toUpperCase() + path.slice(2);
    assert.equal(getCanonicalPath(`${mixed}/`), path);
    assert.deepEqual(getPageMetadata(mixed), getPageMetadata(path));
  }
  for (const path of nonPagePaths) assert.equal(getCanonicalPath(path), null, path);
});

test("Vercel permanently redirects all case variants without redirecting canonical URLs", () => {
  for (const path of Object.keys(pageMetadata).filter((key) => key !== "/")) {
    // Every letter can independently be uppercase or lowercase.
    const variants = [...path.slice(1)].reduce(
      (paths, letter) => paths.flatMap((prefix) => [prefix + letter, prefix + letter.toUpperCase()]),
      ["/"],
    );
    for (const variant of variants) {
      const matches = redirects.filter(({ pattern }) => pattern.test(variant));
      if (variant === path) {
        assert.equal(matches.length, 0, variant);
      } else {
        assert.equal(matches.length, 1, variant);
        assert.equal(matches[0].destination, path);
        assert.equal(matches[0].permanent, true);
      }
    }
  }
  for (const path of ["/", ...nonPagePaths]) {
    assert.ok(!redirects.some(({ pattern }) => pattern.test(path)), path);
  }
  assert.equal(vercel.trailingSlash, false);
});

test("local preview redirects aliases and preserves the query before serving canonical HTML", () => {
  const plugin = viteConfig.plugins.find(({ name }) => name === "als-static-page-metadata");
  let middleware;
  plugin.configurePreviewServer({ middlewares: { use: (handler) => { middleware = handler; } } });

  function request(url) {
    const req = { url };
    let result;
    const res = {
      writeHead: (status, { Location }) => { result = [status, Location]; },
      end() {},
    };
    middleware(req, res, () => { result = [null, req.url]; });
    return result;
  }

  assert.deepEqual(request("/Team/?q=one?two"), [308, "/team?q=one?two"]);
  assert.deepEqual(request("/CONTACT"), [308, "/contact"]);
  assert.deepEqual(request("/team?q=one?two"), [null, "/team/index.html?q=one?two"]);
  for (const path of ["/", ...nonPagePaths]) {
    assert.deepEqual(request(path), [null, path]);
  }
});
