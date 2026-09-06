/* Persistencia del progreso y programacion de repaso espaciado.

   Todo vive en localStorage, en este dispositivo. Las lecturas y escrituras
   van envueltas en try/catch: en modo privado, con cuota agotada o con el
   almacenamiento bloqueado, la app debe seguir funcionando sin progreso
   guardado en lugar de romperse. */

const KEY = "lorawan-ap-trainer/v1";

/* Cajas del sistema Leitner y tope del historial de tests que se conserva. */
export const BOXES = 5;
const RUNS_KEPT = 30;

/* Estado inicial. `doms` son los ids de dominio, que se pasan desde fuera
   para no acoplar esta capa a los datos del temario. */
export function emptyState(doms) {
  return {
    v: 1,
    stats: Object.fromEntries(doms.map((d) => [d, { seen: 0, right: 0 }])),
    studied: [],
    cards: {},   // anverso -> { box, due }
    failed: {},  // id de pregunta -> fallos acumulados pendientes
    runs: [],    // historial de tests: { at, score, n, mock }
  };
}

/* ---------- Saneado de lo que vuelve del almacen ----------

   localStorage no es una fuente de confianza: lo edita cualquiera desde la
   consola del navegador, y en GitHub Pages el origen es compartido por todos
   los proyectos publicados bajo el mismo usuario, asi que otra pagina del
   mismo dominio escribe en la misma caja. Nada de esto permite ejecutar
   codigo —React escapa todo lo que pinta y aqui no se interpola HTML— pero
   un objeto con la forma equivocada si rompe la app o falsea el progreso.

   Por eso el estado se reconstruye campo a campo con el tipo esperado en vez
   de volcar el JSON con un spread, que copiaba tal cual cualquier clave que
   hubiera en el almacen. */

const isPlain = (x) => x !== null && typeof x === "object" && !Array.isArray(x);

/* Una clave "__proto__" que venga del almacen no crea una propiedad normal:
   sustituye el prototipo del objeto destino. No contamina Object.prototype
   —JSON.parse la deja como propiedad propia—, pero si envenena este mapa:
   a partir de ahi cualquier tarjeta no vista heredaria esos valores en vez
   del {box:0, due:0} por defecto, y el mazo entero saldria mal contado. */
const SEGURA = (k) => k !== "__proto__" && k !== "constructor" && k !== "prototype";

const count = (x) =>
  typeof x === "number" && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0;

function cleanStats(base, saved) {
  const out = { ...base };
  if (!isPlain(saved)) return out;
  // Solo dominios que existen hoy: los que se hayan retirado del temario caen.
  for (const d of Object.keys(base)) {
    const s = saved[d];
    if (isPlain(s)) out[d] = { seen: count(s.seen), right: count(s.right) };
  }
  return out;
}

function cleanCards(saved) {
  const out = {};
  if (!isPlain(saved)) return out;
  for (const [front, c] of Object.entries(saved)) {
    if (!SEGURA(front) || !isPlain(c)) continue;
    const box = Math.min(count(c.box), BOXES);
    const due = typeof c.due === "number" && Number.isFinite(c.due) ? c.due : 0;
    out[front] = { box, due };
  }
  return out;
}

function cleanFailed(saved) {
  const out = {};
  if (!isPlain(saved)) return out;
  for (const [id, n] of Object.entries(saved)) {
    if (!SEGURA(id)) continue;
    const v = count(n);
    if (v > 0) out[id] = v;
  }
  return out;
}

function cleanRuns(saved) {
  if (!Array.isArray(saved)) return [];
  return saved
    .filter(isPlain)
    .slice(-RUNS_KEPT)
    .map((r) => ({
      at: count(r.at),
      score: count(r.score),
      n: count(r.n),
      mock: r.mock === true,
    }));
}

/* Reconstruye un estado válido campo a campo a partir de cualquier objeto,
   tanto si viene de localStorage como de un fichero importado a mano: ambos
   son entrada no confiable con la misma forma esperada. Devuelve null si
   `saved` no tiene pinta de ser un estado de esta app. */
function sanitizeState(doms, saved) {
  if (!isPlain(saved) || saved.v !== 1) return null;
  const base = emptyState(doms);
  return {
    v: 1,
    // Si el temario gana dominios nuevos, los que falten arrancan a cero.
    stats: cleanStats(base.stats, saved.stats),
    studied: Array.isArray(saved.studied)
      ? saved.studied.filter((x) => typeof x === "string")
      : [],
    cards: cleanCards(saved.cards),
    failed: cleanFailed(saved.failed),
    runs: cleanRuns(saved.runs),
  };
}

export function loadState(doms) {
  const base = emptyState(doms);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    return sanitizeState(doms, JSON.parse(raw)) ?? base;
  } catch {
    return base;
  }
}

/* Progreso listo para volcar a un fichero .json descargable. */
export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

/* Progreso que vuelve de un fichero elegido por quien estudia: mismo
   saneado que localStorage, porque el fichero se pudo editar a mano o venir
   de otra versión de la app. Devuelve null si el texto no es un estado
   válido, para que quien llama pueda avisar en vez de machacar el progreso
   actual con algo roto. */
export function importState(doms, text) {
  try {
    return sanitizeState(doms, JSON.parse(text));
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

/* ---------- Repaso espaciado (Leitner de cinco cajas) ----------
   Una tarjeta acertada sube de caja y tarda mas en volver. Una fallada
   cae a la caja 1 y reaparece en la misma sesion. Es lo que convierte
   el mazo en un sistema de memoria en lugar de un carrusel. */

const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;
const INTERVAL = { 1: 10 * MIN, 2: DAY, 3: 3 * DAY, 4: 7 * DAY, 5: 21 * DAY };

/* Una tarjeta nunca vista esta pendiente desde el principio. */
export function cardState(cards, front) {
  return cards[front] || { box: 0, due: 0 };
}

export function isDue(cards, front, now = Date.now()) {
  return cardState(cards, front).due <= now;
}

export function scheduleCard(cards, front, ok, now = Date.now()) {
  const cur = cardState(cards, front);
  const box = ok ? Math.min(cur.box + 1, BOXES) : 1;
  return { ...cards, [front]: { box, due: now + INTERVAL[box] } };
}

/* Reparto del mazo para la interfaz: lo que toca hoy y lo que ya esta asentado. */
export function deckStatus(cards, deck, now = Date.now()) {
  const due = deck.filter((c) => isDue(cards, c.f, now));
  const mastered = deck.filter((c) => cardState(cards, c.f).box >= 4);
  const seen = deck.filter((c) => cardState(cards, c.f).box > 0);
  const nextDue = deck
    .map((c) => cardState(cards, c.f).due)
    .filter((d) => d > now)
    .sort((a, b) => a - b)[0];
  return { due, mastered: mastered.length, seen: seen.length, nextDue };
}

export function humanDelay(ms) {
  if (!ms || ms <= 0) return "ahora";
  const m = Math.round(ms / MIN);
  if (m < 60) return `en ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `en ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "mañana" : `en ${d} días`;
}

/* ---------- Fallos pendientes ----------
   Un fallo entra en la lista y solo sale cuando se acierta la misma
   pregunta mas tarde. Es lo que alimenta el modo de repaso dirigido. */

export function recordAnswer(failed, id, ok) {
  const next = { ...failed };
  if (ok) {
    if (next[id] > 1) next[id] -= 1;
    else delete next[id];
  } else {
    next[id] = (next[id] || 0) + 1;
  }
  return next;
}
