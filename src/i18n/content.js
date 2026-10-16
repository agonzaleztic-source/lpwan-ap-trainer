/* Localización del contenido de estudio.

   El español de src/data/ es la fuente de verdad: ahí viven los ids, el
   índice de la respuesta correcta y las referencias a la especificación.
   Las traducciones se guardan aparte, indexadas por lo que identifica a
   cada elemento (id de pregunta, lección + posición de la comprobación,
   anverso de la tarjeta), y aquí se fusionan sobre el original sin tocar
   nada que no sea texto. Si a un elemento le falta traducción se muestra
   en español antes que romper la app; el test de traducciones es el que
   garantiza que eso no pase en el banco publicado. */

import * as TABLES_ES from "../data/tables.js";

/* El inglés no se importa de forma estática: pesa casi lo mismo que el
   español y la mayoría de quien entra no lo usa. loadEnglish() lo trae en un
   chunk aparte; hasta que llega, las funciones de abajo devuelven el
   español, y LangProvider no muestra la app en inglés antes de tenerlo. */
let EN = null;
let pending = null;

export function loadEnglish() {
  if (EN) return Promise.resolve(EN);
  pending ||= import("./en-pack.js")
    .then((m) => (EN = m))
    .catch((e) => { pending = null; throw e; });
  return pending;
}

export const englishLoaded = () => EN !== null;

const es = (lang) => lang === "es" || !EN;

/* Pregunta del banco de tests: se traducen enunciado, opciones y explicación.
   Las opciones se traducen en el mismo orden, así que `a` sigue valiendo.
   Hay que llamarla ANTES de shuffleOptions(). */
export function localizeQuestion(q, lang) {
  if (es(lang)) return q;
  const t = EN.QUESTIONS_EN[q.id];
  return t ? { ...q, q: t.q, opts: t.opts, exp: t.exp } : q;
}

/* Comprobación al final de una lección: no tiene id propio, se identifica
   por la lección y su posición en el array. */
export function localizeCheck(lessonId, k, c, lang) {
  if (es(lang)) return c;
  const t = EN.CHECKS_EN[lessonId]?.[k];
  return t ? { ...c, q: t.q, opts: t.opts, exp: t.exp } : c;
}

/* Tarjeta: el anverso español es la clave del progreso guardado, así que
   la tarjeta localizada conserva el original en `key` y quien la pinta usa
   `f`/`b` solo para mostrar. */
export function localizeCard(c, lang) {
  const base = { ...c, key: c.f };
  if (es(lang)) return base;
  const t = EN.CARDS_EN[c.f];
  return t ? { ...base, f: t.f, b: t.b } : base;
}

export function lessonTitle(lesson, lang) {
  if (es(lang)) return lesson.title;
  return EN.TITLES_EN[lesson.id] || lesson.title;
}

/* Cuerpo de las lecciones: bloques de texto, misma estructura en ambos
   idiomas. Es lo que más pesa del temario y solo hace falta al abrir una
   lección, así que cada idioma viaja en su propio chunk y se pide la primera
   vez que se abre una. El service worker precachea todos los chunks, de modo
   que sin conexión también se cargan. */
const BODY_LOADERS = {
  es: () => import("../data/lesson-bodies.js").then((m) => m.LESSON_BODIES),
  en: () => import("../data/en/lessons.en.js").then((m) => m.LESSON_BODIES_EN),
};
const BODIES = {};
const bodiesPending = {};

export function loadLessonBodies(lang) {
  const l = lang === "en" ? "en" : "es";
  if (BODIES[l]) return Promise.resolve(BODIES[l]);
  bodiesPending[l] ||= BODY_LOADERS[l]()
    .then((m) => (BODIES[l] = m))
    .catch((e) => { bodiesPending[l] = null; throw e; });
  return bodiesPending[l];
}

/* Cuerpo ya cargado de una lección, o null si su chunk aún no ha llegado.
   En inglés cae al español si falta la traducción (el test de traducciones
   impide que eso ocurra en lo publicado). */
export function lessonBody(id, lang) {
  if (lang === "en") {
    if (!BODIES.en) return null;
    if (BODIES.en[id]) return BODIES.en[id];
  }
  return BODIES.es?.[id] || null;
}

/* Carga el cuerpo de una lección: primero el del idioma pedido y, si no
   está o su chunk no llega, el español. */
export async function fetchLessonBody(id, lang) {
  if (lang === "en") {
    try {
      const en = await loadLessonBodies("en");
      if (en[id]) return en[id];
    } catch { /* sin red: se intenta el español */ }
  }
  const es = await loadLessonBodies("es");
  return es[id] || null;
}

export function tables(lang) {
  return es(lang) ? TABLES_ES : EN.TABLES_EN;
}
