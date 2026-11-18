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
const metadataPlugin = viteConfig.plugins.find(({ name }) => name === "als-static-page-metadata");
const publicRoutes = ["/", "/about", "/services", "/team", "/contact"];
const nonPagePaths = [
  "/api/contact", "/API/Contact", "/assets/Team.js", "/favicon.ico",
  "/robots.txt", "/sitemap.xml", "/Team/unknown", "/unknown",
];

test("canonical path normalization preserves page-specific metadata", () => {
  assert.equal(getCanonicalPath("/"), "/");
  for (const path of Object.keys(pageMetadata).filter((key) => key !== "/")) {
    const mixed = path[0] + path[1].toUpperCase() + path.slice(2);
    assert.equal(getCanonicalPath(`${mixed}/`), path);
    assert.deepEqual(getPageMetadata(mixed), getPageMetadata(path));
  }
  for (const path of nonPagePaths) assert.equal(getCanonicalPath(path), null, path);
});

test("every public page emits canonical and social metadata on the production domain", () => {
  assert.deepEqual(Object.keys(pageMetadata), publicRoutes);

  const template = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const assets = new Map();
  const index = { source: template };
  metadataPlugin.generateBundle.handler.call(
    { emitFile: ({ fileName, source }) => assets.set(fileName, source) },
    {},
    { "index.html": index },
  );

  const productionOrigin = "https://www.als-ss.com";
  const expectedUrls = publicRoutes.map((path) => productionOrigin + path);
  for (const [i, path] of publicRoutes.entries()) {
    const expectedUrl = expectedUrls[i];
    const html = path === "/" ? index.source : assets.get(`${path.slice(1)}/index.html`);

    assert.equal(getPageMetadata(path).url, expectedUrl);
    assert.ok(html.includes(`<link rel="canonical" href="${expectedUrl}"`), path);
    assert.ok(html.includes(`<meta property="og:url" content="${expectedUrl}"`), path);
    for (const meta of ['property="og:image"', 'name="twitter:image"']) {
      assert.ok(html.includes(`<meta ${meta} content="${productionOrigin}/akol-logo.jpeg"`), path);
    }
    assert.ok(!html.includes("__PAGE_"), path);
  }

  const sitemapUrls = [...assets.get("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]);
  assert.deepEqual(sitemapUrls, expectedUrls);
  assert.match(assets.get("robots.txt"), /^Sitemap: https:\/\/www\.als-ss\.com\/sitemap\.xml$/m);
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
  let middleware;
  metadataPlugin.configurePreviewServer({ middlewares: { use: (handler) => { middleware = handler; } } });

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
