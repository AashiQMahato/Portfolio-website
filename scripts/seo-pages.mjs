/**
 * Post-build SEO pass. The app is a client-rendered SPA, so crawlers and
 * link-preview bots that don't run JS would otherwise see the homepage head
 * on every URL. For each known route this writes dist/<route>.html with
 * that route's title, description, canonical, Open Graph and JSON-LD, then
 * generates sitemap.xml. Metadata comes from src/seo/meta.js — the same
 * module the app uses at runtime — loaded through Vite so asset imports in
 * the data files resolve.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const headFor = (m) =>
  [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    `<link rel="canonical" href="${esc(m.canonical)}" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.canonical)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    ...(m.published ? [`<meta property="article:published_time" content="${esc(m.published)}" />`] : []),
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(m.image)}" />`,
  ].join("\n    ");

const jsonLdFor = (m) =>
  m.jsonLd
    ? `<script type="application/ld+json" id="ld-json">${JSON.stringify(m.jsonLd).replace(/</g, "\\u003c")}</script>`
    : "";

const render = (template, m) =>
  template
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, headFor(m))
    .replace("<!-- seo:jsonld -->", jsonLdFor(m));

const server = await createServer({
  root,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

try {
  const { SITE, getRouteMeta, allPaths, indexablePaths, lastModified } =
    await server.ssrLoadModule("/src/seo/meta.js");

  const template = await readFile(join(dist, "index.html"), "utf8");
  if (!template.includes("<!-- seo:start")) {
    throw new Error("dist/index.html is missing the <!-- seo:start --> marker");
  }

  for (const path of allPaths()) {
    // Flat files (/blog → blog.html) so hosts with clean URLs resolve every
    // route without a trailing slash; see "cleanUrls" in vercel.json.
    const out = path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, render(template, getRouteMeta(path)));
  }

  // Served for unknown URLs on static hosts that honour 404.html.
  await writeFile(join(dist, "404.html"), render(template, getRouteMeta("/__not-found__")));

  const today = new Date().toISOString().slice(0, 10);
  const urls = indexablePaths()
    .map((p) => {
      const loc = p === "/" ? `${SITE.url}/` : `${SITE.url}${p}`;
      return `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastModified(p) || today}</lastmod>\n  </url>`;
    })
    .join("\n");
  await writeFile(
    join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );

  console.log(`seo-pages: ${allPaths().length} route heads + 404.html + sitemap.xml (${indexablePaths().length} URLs)`);
} finally {
  await server.close();
}
