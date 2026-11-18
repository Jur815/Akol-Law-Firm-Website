import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { getCanonicalPath, getPageMetadata, pageMetadata, siteOrigin } from "./src/data/pageMetadata.js";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderMetadata(html, pathname) {
  const metadata = getPageMetadata(pathname);
  return html.replace(/__PAGE_(TITLE|DESCRIPTION|URL|IMAGE)__/g, (_, field) =>
    escapeHtml(metadata[field.toLowerCase()]),
  );
}

function renderSitemap(pathnames) {
  const urls = pathnames.map((pathname) =>
    `  <url><loc>${escapeHtml(getPageMetadata(pathname).url)}</loc></url>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

function canonicalPageMiddleware(preview = false) {
  return (req, res, next) => {
    const [pathname] = req.url.split("?", 1);
    const canonical = getCanonicalPath(pathname);
    const query = req.url.slice(pathname.length);

    if (canonical && canonical !== pathname) {
      res.writeHead(308, { Location: canonical + query });
      res.end();
      return;
    }

    if (preview && canonical && canonical !== "/") {
      req.url = `${canonical}/index.html${query}`;
    }
    next();
  };
}

function staticPageMetadata() {
  return {
    name: "als-static-page-metadata",
    configureServer(server) {
      server.middlewares.use(canonicalPageMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(canonicalPageMiddleware(true));
    },
    transformIndexHtml(html, { server, originalUrl }) {
      return server ? renderMetadata(html, originalUrl?.split("?")[0] || "/") : html;
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        const template = index.source;
        index.source = renderMetadata(template, "/");
        const pathnames = Object.keys(pageMetadata);

        for (const pathname of pathnames) {
          if (pathname === "/") continue;
          this.emitFile({
            type: "asset",
            fileName: `${pathname.slice(1)}/index.html`,
            source: renderMetadata(template, pathname),
          });
        }

        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: renderSitemap(pathnames),
        });
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    staticPageMetadata(),
  ],
});
