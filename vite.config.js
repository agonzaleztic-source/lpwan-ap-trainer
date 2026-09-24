import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En GitHub Actions, GITHUB_REPOSITORY vale "usuario/repositorio".
// Así la base se ajusta sola a /repositorio/ al publicar en GitHub Pages
// y se queda en / cuando trabajas en local.
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

/* Política de seguridad de contenido.

   La app no habla con nadie: no hay backend, ni analítica, ni fuentes de
   terceros, ni peticiones de red más allá de sus propios ficheros. La CSP
   deja eso por escrito, de modo que si algún día se cuela un script ajeno
   —por una dependencia comprometida o por un fallo de la propia app— el
   navegador se niega a ejecutarlo en lugar de confiar.

   `style-src` admite 'unsafe-inline' a propósito: la hoja de estilos se
   monta como <style> desde React (src/styles.js) y en desarrollo Vite hace
   lo mismo con el HMR. El riesgo de inyección de CSS aquí es nulo —no hay
   una sola entrada de usuario que llegue al DOM— mientras que el vector que
   sí importa, la ejecución de scripts, queda cerrado con 'self'.

   `frame-ancestors` no se incluye: en una etiqueta <meta> el navegador la
   ignora y hay que enviarla como cabecera HTTP, algo que GitHub Pages no
   permite configurar. Queda anotado en SECURITY.md en vez de fingir que
   está cubierto. */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/* Solo en el build: en `npm run dev` el servidor de Vite necesita websockets
   y estilos inyectados que la política de producción no contempla. */
function csp() {
  return {
    name: "csp-meta",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
          injectTo: "head-prepend",
        },
        {
          tag: "meta",
          attrs: { name: "referrer", content: "no-referrer" },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

/* Emite dist/sw.js a partir de src/sw.js, sellado con la huella del bundle
   de esta compilación. Cada despliegue estrena nombre de caché y el service
   worker borra el anterior al activarse, en lugar de acumular versiones. */
function serviceWorker() {
  return {
    name: "service-worker",
    apply: "build",
    generateBundle(_opts, bundle) {
      const h = createHash("sha256");
      for (const name of Object.keys(bundle).sort()) {
        const out = bundle[name];
        h.update(name);
        h.update(out.type === "chunk" ? out.code : Buffer.from(out.source));
      }
      const build = h.digest("hex").slice(0, 8);
      /* Rutas relativas al service worker, que vive en la raíz de la base. */
      const precache = Object.keys(bundle)
        .filter((n) => /.(js|css)$/.test(n))
        .map((n) => "./" + n);
      const src = readFileSync(new URL("./src/sw.js", import.meta.url), "utf8");
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: src
          .replaceAll("__BUILD__", build)
          .replace("__PRECACHE__", JSON.stringify(precache)),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), csp(), serviceWorker()],
  base: repo ? `/${repo}/` : "/",
});
