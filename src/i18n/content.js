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

/* Cuerpo de la lección: bloques de texto. Misma estructura en ambos idiomas. */
export function lessonBody(lesson, lang) {
  if (es(lang)) return lesson.body;
  return EN.LESSON_BODIES_EN[lesson.id] || lesson.body;
}

export function tables(lang) {
  return es(lang) ? TABLES_ES : EN.TABLES_EN;
}
