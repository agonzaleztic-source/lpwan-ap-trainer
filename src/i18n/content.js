/* Localización del contenido de estudio.

   El español de src/data/ es la fuente de verdad: ahí viven los ids, el
   índice de la respuesta correcta y las referencias a la especificación.
   Las traducciones se guardan aparte, indexadas por lo que identifica a
   cada elemento (id de pregunta, lección + posición de la comprobación,
   anverso de la tarjeta), y aquí se fusionan sobre el original sin tocar
   nada que no sea texto. Si a un elemento le falta traducción se muestra
   en español antes que romper la app; el test de traducciones es el que
   garantiza que eso no pase en el banco publicado. */

import { QUESTIONS_EN } from "../data/en/questions.en.js";
import { CHECKS_EN } from "../data/en/checks.en.js";
import { CARDS_EN } from "../data/en/cards.en.js";
import { TITLES_EN } from "../data/en/titles.en.js";
import * as TABLES_ES from "../data/tables.js";
import * as TABLES_EN from "../data/en/tables.en.js";

/* Pregunta del banco de tests: se traducen enunciado, opciones y explicación.
   Las opciones se traducen en el mismo orden, así que `a` sigue valiendo.
   Hay que llamarla ANTES de shuffleOptions(). */
export function localizeQuestion(q, lang) {
  if (lang === "es") return q;
  const t = QUESTIONS_EN[q.id];
  return t ? { ...q, q: t.q, opts: t.opts, exp: t.exp } : q;
}

/* Comprobación al final de una lección: no tiene id propio, se identifica
   por la lección y su posición en el array. */
export function localizeCheck(lessonId, k, c, lang) {
  if (lang === "es") return c;
  const t = CHECKS_EN[lessonId]?.[k];
  return t ? { ...c, q: t.q, opts: t.opts, exp: t.exp } : c;
}

/* Tarjeta: el anverso español es la clave del progreso guardado, así que
   la tarjeta localizada conserva el original en `key` y quien la pinta usa
   `f`/`b` solo para mostrar. */
export function localizeCard(c, lang) {
  const base = { ...c, key: c.f };
  if (lang === "es") return base;
  const t = CARDS_EN[c.f];
  return t ? { ...base, f: t.f, b: t.b } : base;
}

export function lessonTitle(lesson, lang) {
  if (lang === "es") return lesson.title;
  return TITLES_EN[lesson.id] || lesson.title;
}

export function tables(lang) {
  return lang === "es" ? TABLES_ES : TABLES_EN;
}
