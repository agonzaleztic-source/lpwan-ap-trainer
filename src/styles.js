/* Estilos globales de la app.

   Las tipografias se sirven desde el propio dominio (public/fonts, subconjunto
   latino, 97 KB). Antes se pedian a fonts.googleapis.com con un @import, lo que
   revelaba la IP de cada visitante a un tercero en cada carga y dejaba la app
   sin tipografia justo en el escenario que promete cubrir: sin conexion. */

const F = `${import.meta.env.BASE_URL}fonts`;

/* Subconjunto latino: cubre el espanol completo. Lo que quede fuera cae al
   tipo del sistema, igual que hacia antes con los subconjuntos de Google. */
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

export const CSS = `
@font-face {
  font-family:'IBM Plex Sans'; font-style:normal; font-weight:400 600;
  font-display:swap; unicode-range:${LATIN};
  src:url('${F}/ibm-plex-sans-var.woff2') format('woff2');
}
@font-face {
  font-family:'Space Grotesk'; font-style:normal; font-weight:300 700;
  font-display:swap; unicode-range:${LATIN};
  src:url('${F}/space-grotesk-var.woff2') format('woff2');
}
@font-face {
  font-family:'IBM Plex Mono'; font-style:normal; font-weight:400;
  font-display:swap; unicode-range:${LATIN};
  src:url('${F}/ibm-plex-mono-400.woff2') format('woff2');
}
@font-face {
  font-family:'IBM Plex Mono'; font-style:normal; font-weight:500;
  font-display:swap; unicode-range:${LATIN};
  src:url('${F}/ibm-plex-mono-500.woff2') format('woff2');
}

.lw {
  --bg:#0A1420; --panel:#10202F; --panel2:#16293B; --line:#23394F;
  --ink:#E8F1F8; --muted:#8FA6BD;
  --cyan:#35D6C6; --violet:#9A8CFA; --amber:#F2A63C;
  --green:#58D68D; --red:#F0736A;
  background:var(--bg); color:var(--ink); min-height:100vh;
  font-family:'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  font-size:15px; line-height:1.55; -webkit-font-smoothing:antialiased;
}
.lw *, .lw *::before, .lw *::after { box-sizing:border-box; }
.lw h1,.lw h2,.lw h3,.lw h4 { font-family:'Space Grotesk', system-ui, sans-serif; margin:0; letter-spacing:-0.015em; }
.lw p { margin:0; }
.lw code, .lw .mono { font-family:'IBM Plex Mono', ui-monospace, monospace; }

.lw-wrap { max-width:1080px; margin:0 auto; padding:0 20px 72px; }

.lw-footer { border-top:1px solid var(--line); padding:18px 20px 28px; text-align:center;
  color:var(--muted); font-size:12px; max-width:1080px; margin:0 auto; }

/* ---- hero / cabecera con espectrograma ---- */
.lw-hero { position:relative; overflow:hidden; border-bottom:1px solid var(--line); margin-bottom:26px; }
.lw-hero-inner { max-width:1080px; margin:0 auto; padding:38px 20px 30px; position:relative; z-index:2; }
.lw-fall { position:absolute; inset:0; z-index:1; opacity:.5; }
.lw-fall svg { width:100%; height:100%; }
.chirp-run { animation: fall 9s linear infinite; }
@keyframes fall { from { transform:translateY(-96px);} to { transform:translateY(0);} }
@media (prefers-reduced-motion: reduce) { .chirp-run { animation:none; } }

.lw-title { font-size:clamp(30px,5.2vw,46px); font-weight:700; line-height:1.02; }
.lw-sub { color:var(--muted); max-width:56ch; margin-top:12px; font-size:15px; }
.lw-facts { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
.lw-fact { border:1px solid var(--line); background:rgba(16,32,47,.72); border-radius:3px;
  padding:7px 11px; font-size:12.5px; color:var(--muted); backdrop-filter:blur(3px); }
.lw-fact b { color:var(--ink); font-family:'IBM Plex Mono',monospace; font-weight:500; }

/* ---- navegación ---- */
.lw-nav { position:sticky; top:0; z-index:20; background:rgba(10,20,32,.93);
  backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
.lw-nav-in { max-width:1080px; margin:0 auto; padding:0 12px; display:flex; gap:2px; overflow-x:auto; }
.lw-nav-in::-webkit-scrollbar { height:0; }
.lw-tab { appearance:none; background:none; border:0; border-bottom:2px solid transparent;
  color:var(--muted); font:inherit; font-size:14px; padding:13px 14px; cursor:pointer;
  white-space:nowrap; transition:color .12s; }
.lw-tab:hover { color:var(--ink); }
.lw-tab[aria-selected="true"] { color:var(--cyan); border-bottom-color:var(--cyan); }
.lw :focus-visible { outline:2px solid var(--cyan); outline-offset:2px; }

/* ---- bloques ---- */
.lw-card { background:var(--panel); border:1px solid var(--line); border-radius:4px; padding:20px; }
.lw-grid { display:grid; gap:14px; }
.lw-h2 { font-size:22px; font-weight:600; margin-bottom:6px; }
.lw-lead { color:var(--muted); font-size:14px; margin-bottom:18px; max-width:70ch; }
.lw-hr { height:1px; background:var(--line); border:0; margin:22px 0; }

/* ---- botones ---- */
.lw-btn { appearance:none; font:inherit; font-size:14px; cursor:pointer; border-radius:3px;
  padding:9px 16px; border:1px solid var(--line); background:var(--panel2); color:var(--ink);
  transition:border-color .12s, background .12s; }
.lw-btn:hover { border-color:var(--cyan); }
.lw-btn:disabled { opacity:.4; cursor:not-allowed; }
.lw-btn.primary { background:var(--cyan); color:#06131C; border-color:var(--cyan); font-weight:600; }
.lw-btn.primary:hover { background:#5FE3D5; }
.lw-btn.ghost { background:transparent; }
.lw-chip { appearance:none; font:inherit; font-size:13px; cursor:pointer; border-radius:99px;
  padding:6px 13px; border:1px solid var(--line); background:transparent; color:var(--muted); }
.lw-chip[aria-pressed="true"] { border-color:var(--cyan); color:var(--cyan); background:rgba(53,214,198,.09); }

/* ---- barra de progreso ---- */
.lw-bar { height:5px; background:var(--panel2); border-radius:99px; overflow:hidden; }
.lw-bar > i { display:block; height:100%; background:var(--cyan); transition:width .35s ease; }

/* ---- tablas ---- */
.lw-tbl { width:100%; border-collapse:collapse; font-size:13.5px; }
.lw-tbl th { text-align:left; font-weight:600; color:var(--muted); font-size:12px;
  padding:8px 10px; border-bottom:1px solid var(--line); }
.lw-tbl td { padding:8px 10px; border-bottom:1px solid rgba(35,57,79,.5); vertical-align:top; }
.lw-tbl tr:last-child td { border-bottom:0; }
.lw-tbl td.m, .lw-tbl th.m { font-family:'IBM Plex Mono',monospace; }
.lw-scroll { overflow-x:auto; }

/* ---- test ---- */
.lw-opt { display:flex; gap:12px; align-items:flex-start; width:100%; text-align:left;
  font:inherit; font-size:14.5px; cursor:pointer; padding:13px 15px; border-radius:3px;
  border:1px solid var(--line); background:var(--panel2); color:var(--ink); margin-bottom:9px;
  transition:border-color .12s; }
.lw-opt:hover:not(:disabled) { border-color:var(--cyan); }
.lw-opt:disabled { cursor:default; }
.lw-opt .k { font-family:'IBM Plex Mono',monospace; color:var(--muted); flex:none; }
.lw-opt.good { border-color:var(--green); background:rgba(88,214,141,.11); }
.lw-opt.good .k { color:var(--green); }
.lw-opt.bad { border-color:var(--red); background:rgba(240,115,106,.11); }
.lw-opt.bad .k { color:var(--red); }
.lw-exp { border-left:2px solid var(--amber); background:rgba(242,166,60,.07);
  padding:12px 15px; font-size:14px; border-radius:0 3px 3px 0; }
.lw-ref { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--muted);
  margin-top:6px; }

/* ---- tarjeta flip ---- */
.lw-flip { perspective:1400px; }
.lw-flip-in { position:relative; transition:transform .5s cubic-bezier(.4,.15,.2,1);
  transform-style:preserve-3d; min-height:240px; }
.lw-flip-in.on { transform:rotateX(180deg); }
.lw-face { position:absolute; inset:0; backface-visibility:hidden; display:flex; flex-direction:column;
  justify-content:center; padding:28px; border:1px solid var(--line); border-radius:4px; background:var(--panel); }
.lw-face.back { transform:rotateX(180deg); background:var(--panel2); border-color:var(--cyan); }
@media (prefers-reduced-motion: reduce) { .lw-flip-in { transition:none; } }

/* ---- entradas ---- */
.lw-field { display:flex; flex-direction:column; gap:6px; }
.lw-field label { font-size:12.5px; color:var(--muted); }
.lw-field select, .lw-field input { font:inherit; font-size:14px; background:var(--panel2);
  color:var(--ink); border:1px solid var(--line); border-radius:3px; padding:8px 10px; width:100%; }
.lw-out { font-family:'IBM Plex Mono',monospace; font-size:26px; color:var(--cyan); line-height:1.15; }
.lw-out small { display:block; font-family:'IBM Plex Sans',sans-serif; font-size:12.5px; color:var(--muted); margin-top:5px; }

.lw-acc { border:1px solid var(--line); border-radius:4px; background:var(--panel); overflow:hidden; }
.lw-acc + .lw-acc { margin-top:10px; }
.lw-acc-h { display:flex; align-items:center; gap:14px; width:100%; text-align:left; font:inherit;
  background:none; border:0; color:var(--ink); padding:16px 18px; cursor:pointer; }
.lw-acc-h:hover { background:var(--panel2); }
.lw-acc-b { padding:2px 18px 20px; border-top:1px solid var(--line); }
.lw-dot { width:8px; height:8px; border-radius:99px; flex:none; }

.lw-note { color:var(--muted); font-size:12.5px; }
.lw-kv { display:flex; justify-content:space-between; gap:16px; padding:7px 0;
  border-bottom:1px solid rgba(35,57,79,.5); font-size:13.5px; }
.lw-kv:last-child { border-bottom:0; }
.lw-kv b { font-family:'IBM Plex Mono',monospace; font-weight:500; }

/* ---- lecciones ---- */
.lw-lesson-row { display:flex; align-items:center; gap:14px; width:100%; text-align:left; font:inherit;
  background:var(--panel); border:1px solid var(--line); border-radius:4px; color:var(--ink);
  padding:15px 17px; cursor:pointer; transition:border-color .12s; margin-bottom:9px; }
.lw-lesson-row:hover { border-color:var(--cyan); }
.lw-lesson-row.done { border-left:3px solid var(--green); }
.lw-lesson-t { flex:1; font-family:'Space Grotesk',sans-serif; font-size:15.5px; }
.lw-lesson-m { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--muted); flex:none; }

.lw-read { max-width:66ch; }
.lw-read p { font-size:16px; line-height:1.68; margin:0 0 17px; }
.lw-read h4 { font-size:18px; margin:30px 0 12px; color:var(--cyan); font-weight:600; }
.lw-read ul, .lw-read ol { margin:0 0 18px; padding-left:22px; display:grid; gap:9px; }
.lw-read li { font-size:15.5px; line-height:1.6; }
.lw-read ol li::marker { font-family:'IBM Plex Mono',monospace; color:var(--muted); }

.lw-box { border-radius:0 3px 3px 0; padding:14px 17px; margin:0 0 20px; font-size:15px; line-height:1.6; }
.lw-box.key { border-left:3px solid var(--cyan); background:rgba(53,214,198,.08); }
.lw-box.warn { border-left:3px solid var(--amber); background:rgba(242,166,60,.08); }
.lw-box b { display:block; font-family:'Space Grotesk',sans-serif; font-size:12px; margin-bottom:6px;
  font-weight:600; letter-spacing:.02em; }
.lw-box.key b { color:var(--cyan); }
.lw-box.warn b { color:var(--amber); }

.lw-fx { font-family:'IBM Plex Mono',monospace; font-size:14px; line-height:1.85; white-space:pre-wrap;
  background:var(--panel2); border:1px solid var(--line); border-radius:3px; padding:15px 17px; margin:0 0 8px; }
.lw-fx-n { font-size:13px; color:var(--muted); margin:0 0 20px; line-height:1.55; }

.lw-check { border-top:1px solid var(--line); margin-top:34px; padding-top:26px; }
`;
