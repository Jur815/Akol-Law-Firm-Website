import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { getCanonicalPath, getPageMetadata, pageMetadata } from "./src/data/pageMetadata.js";

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderMetadata(html, pathname) {
  const metadata = getPageMetadata(pathname);
  return html.replace(/__PAGE_(TITLE|DESCRIPTION|URL)__/g, (_, field) =>
    escapeHtml(metadata[field.toLowerCase()]),
  );
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

        for (const pathname of Object.keys(pageMetadata)) {
          if (pathname === "/") continue;
          this.emitFile({
            type: "asset",
            fileName: `${pathname.slice(1)}/index.html`,
            source: renderMetadata(template, pathname),
          });
        }
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
