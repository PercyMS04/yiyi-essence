/* Genera sitemap.xml y robots.txt a partir de js/config.js y js/products.js.
   Uso (opcional, requiere Node.js):
     node tools/generate-sitemap.js https://tuusuario.github.io/yiyi-essence
   Si no pasas la URL, usa store.siteUrl de js/config.js. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
["js/config.js", "js/products.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox));

const cfg = sandbox.window.YIYI_CONFIG;
const products = sandbox.window.YIYI_PRODUCTS || [];
const cats = sandbox.window.YIYI_CATEGORIES || [];

let site = (process.argv[2] || cfg.store.siteUrl || "").replace(/\/$/, "");
if (!site) {
  site = "https://TU-USUARIO.github.io/yiyi-essence";
  console.warn("⚠ Sin URL: se usó un marcador. Ejecuta: node tools/generate-sitemap.js https://tu-sitio");
}

const today = new Date().toISOString().slice(0, 10);
const pages = [
  ["", 1.0], ["productos.html", 0.9], ["nosotros.html", 0.5], ["contacto.html", 0.6],
  ["pages/faq.html", 0.5], ["pages/envios.html", 0.5], ["pages/pagos.html", 0.4], ["pages/cambios.html", 0.4],
  ["pages/privacidad.html", 0.3], ["pages/terminos.html", 0.3], ["pages/cookies.html", 0.2], ["pages/informacion-legal.html", 0.2],
];
cats.forEach((c) => pages.push(["productos.html?cat=" + c.id, 0.7]));
products.forEach((p) => pages.push(["producto.html?id=" + encodeURIComponent(p.id), 0.8]));

const esc = (s) => s.replace(/&/g, "&amp;");
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(([p, pr]) => `  <url><loc>${esc(site + "/" + p)}</loc><lastmod>${today}</lastmod><priority>${pr.toFixed(1)}</priority></url>`).join("\n") +
  "\n</urlset>\n";

fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap.xml (${pages.length} URLs) y robots.txt generados para ${site}`);
