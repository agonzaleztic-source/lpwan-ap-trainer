/* Resultado de un test o simulacro: nota, veredicto y desglose por dominio.

   Lógica pura, sin React, para poder probarla aparte. Los umbrales viven
   aquí y no repartidos por la vista: el color de la nota, el texto de
   valoración y el veredicto salen de la misma cuenta. */

import { DOMAINS } from "../data/domains.js";

/* Nota mínima para aprobar el examen real. */
export const PASS_MARK = 80;
/* Por debajo de esto la nota se pinta en rojo; entre esto y PASS_MARK, en ámbar. */
export const NEAR_MARK = 70;

/* Banda de una nota en %: "pass" (≥ 80, verde), "near" (≥ 70, ámbar) o "low". */
export function scoreBand(score) {
  if (score >= PASS_MARK) return "pass";
  if (score >= NEAR_MARK) return "near";
  return "low";
}

export const BAND_COLOR = { pass: "var(--green)", near: "var(--amber)", low: "var(--red)" };

const DOM_ORDER = Object.fromEntries(DOMAINS.map((d, i) => [d.id, i]));
const pct = (hits, n) => (n ? Math.round((hits / n) * 100) : 0);

/* `log`: respuestas dadas, [{ q, idx }] con q.a la correcta y q.dom el dominio.
   `unanswered`: preguntas que se quedaron sin responder (el simulacro que se
   queda sin tiempo). Cuentan como fallo, igual que en el examen real, tanto
   en la nota como en su dominio.

   Devuelve la nota sobre el total, si aprueba con PASS_MARK y el desglose
   por dominio ordenado de peor a mejor (a igual %, primero el dominio con
   más preguntas, que es el que más pesa en la nota). */
export function summarize(log, unanswered = []) {
  const doms = new Map();
  const add = (dom, ok) => {
    const d = doms.get(dom) || { dom, hits: 0, n: 0 };
    d.n += 1;
    if (ok) d.hits += 1;
    doms.set(dom, d);
  };
  let hits = 0;
  for (const { q, idx } of log) {
    const ok = idx === q.a;
    if (ok) hits += 1;
    add(q.dom, ok);
  }
  for (const q of unanswered) add(q.dom, false);

  const n = log.length + unanswered.length;
  const score = pct(hits, n);
  const byDomain = [...doms.values()]
    .map((d) => ({ ...d, pct: pct(d.hits, d.n) }))
    .sort((a, b) => a.pct - b.pct || b.n - a.n || (DOM_ORDER[a.dom] ?? 99) - (DOM_ORDER[b.dom] ?? 99));

  return {
    hits,
    answered: log.length,
    unanswered: unanswered.length,
    n,
    score,
    passed: n > 0 && score >= PASS_MARK,
    band: scoreBand(score),
    byDomain,
  };
}
