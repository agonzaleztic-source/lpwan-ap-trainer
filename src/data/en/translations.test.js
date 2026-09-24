import { describe, it, expect } from "vitest";
import { QUESTIONS } from "../questions.js";
import { LESSONS } from "../lessons.js";
import { CARDS } from "../cards.js";
import * as TABLES_ES from "../tables.js";
import { QUESTIONS_EN } from "./questions.en.js";
import { CHECKS_EN } from "./checks.en.js";
import { CARDS_EN } from "./cards.en.js";
import { TITLES_EN } from "./titles.en.js";
import * as TABLES_EN from "./tables.en.js";
import { LESSON_BODIES_EN } from "./lessons.en.js";

/* El inglés se guarda aparte del español y se fusiona en tiempo de ejecución
   (src/i18n/content.js). Si a un elemento le falta traducción la app lo
   muestra en español sin romperse, así que nada avisaría de un hueco: estos
   tests son el aviso. También pillan lo que la fusión no puede detectar:
   una opción de menos, que cambiaría el índice de la correcta, o dos
   preguntas distintas en español que quedaron iguales al traducirlas. */

const text = (s) => typeof s === "string" && s.trim().length > 0;

describe("traducción al inglés del banco de tests", () => {
  it("cada pregunta del banco tiene traducción con enunciado, cuatro opciones y explicación", () => {
    for (const q of QUESTIONS) {
      const t = QUESTIONS_EN[q.id];
      expect(t, `falta la traducción de la pregunta ${q.id}`).toBeDefined();
      expect(text(t.q), `enunciado vacío en ${q.id}`).toBe(true);
      expect(t.opts, `opciones de ${q.id}`).toHaveLength(4);
      expect(t.opts.every(text), `opción vacía en ${q.id}`).toBe(true);
      expect(text(t.exp), `explicación vacía en ${q.id}`).toBe(true);
    }
  });

  it("no hay traducciones huérfanas de preguntas que ya no existen", () => {
    const ids = new Set(QUESTIONS.map((q) => String(q.id)));
    for (const id of Object.keys(QUESTIONS_EN)) expect(ids.has(id), `id ${id} sobra`).toBe(true);
  });

  it("las cuatro opciones traducidas son distintas entre sí", () => {
    // Dos opciones iguales harían indistinguible la correcta de una incorrecta.
    for (const [id, t] of Object.entries(QUESTIONS_EN)) {
      expect(new Set(t.opts.map((o) => o.trim())).size, `opciones repetidas en ${id}`).toBe(4);
    }
  });
});

describe("traducción al inglés de las comprobaciones de lección", () => {
  it("cada lección tiene tantas comprobaciones traducidas como en español, todas completas", () => {
    for (const l of LESSONS) {
      const t = CHECKS_EN[l.id];
      expect(t, `falta la lección ${l.id}`).toBeDefined();
      expect(t, `número de comprobaciones de ${l.id}`).toHaveLength(l.checks.length);
      t.forEach((c, k) => {
        expect(text(c.q), `enunciado vacío en ${l.id}[${k}]`).toBe(true);
        expect(c.opts, `opciones de ${l.id}[${k}]`).toHaveLength(4);
        expect(c.opts.every(text), `opción vacía en ${l.id}[${k}]`).toBe(true);
        expect(new Set(c.opts.map((o) => o.trim())).size, `opciones repetidas en ${l.id}[${k}]`).toBe(4);
        expect(text(c.exp), `explicación vacía en ${l.id}[${k}]`).toBe(true);
      });
    }
  });

  it("cada lección tiene título en inglés", () => {
    for (const l of LESSONS) expect(text(TITLES_EN[l.id]), `título de ${l.id}`).toBe(true);
  });
});

describe("traducción al inglés del cuerpo de las lecciones", () => {
  it("cada lección tiene cuerpo en inglés con la misma estructura de bloques que el español", () => {
    for (const l of LESSONS) {
      const en = LESSON_BODIES_EN[l.id];
      expect(en, `falta el cuerpo de ${l.id}`).toBeDefined();
      expect(en, `número de bloques de ${l.id}`).toHaveLength(l.body.length);
      l.body.forEach((b, k) => {
        const e = en[k];
        const at = `${l.id}[${k}]`;
        expect(e.t, `tipo de bloque en ${at}`).toBe(b.t);
        expect(Object.keys(e).sort(), `claves en ${at}`).toEqual(Object.keys(b).sort());
        if (Array.isArray(b.x)) {
          expect(e.x, `elementos en ${at}`).toHaveLength(b.x.length);
          expect(e.x.every(text), `elemento vacío en ${at}`).toBe(true);
        } else if (b.t === "table") {
          expect(e.head, `cabecera en ${at}`).toHaveLength(b.head.length);
          expect(e.rows, `filas en ${at}`).toHaveLength(b.rows.length);
          e.rows.forEach((r, i) => expect(r, `columnas en ${at} fila ${i}`).toHaveLength(b.rows[i].length));
        } else {
          expect(text(e.x), `texto vacío en ${at}`).toBe(true);
        }
        if (b.note !== undefined) expect(text(e.note), `nota vacía en ${at}`).toBe(true);
      });
    }
  });

  it("no hay cuerpos huérfanos de lecciones que ya no existen", () => {
    const ids = new Set(LESSONS.map((l) => l.id));
    for (const id of Object.keys(LESSON_BODIES_EN)) expect(ids.has(id), `id ${id} sobra`).toBe(true);
  });

  it("los cuerpos no conservan texto en español (signos de apertura y acentos)", () => {
    // Heurística barata para pillar un párrafo que quedó sin traducir.
    const flat = (v) => (typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(flat) : v && typeof v === "object" ? Object.values(v).flatMap(flat) : []);
    for (const [id, body] of Object.entries(LESSON_BODIES_EN)) {
      for (const str of flat(body)) expect(/[¿¡ñ]|(el|los|las|del|que|una)/.test(str), `español en ${id}: ${str.slice(0, 60)}`).toBe(false);
    }
  });
});

describe("enunciados en inglés", () => {
  it("ningún enunciado se repite entre el banco de tests y las comprobaciones", () => {
    // Misma regla que en español: dos enunciados iguales enseñan lo mismo dos veces.
    const all = [
      ...Object.entries(QUESTIONS_EN).map(([id, t]) => ({ q: t.q, src: `pregunta ${id}` })),
      ...Object.entries(CHECKS_EN).flatMap(([lid, cs]) => cs.map((c, k) => ({ q: c.q, src: `lección ${lid}[${k}]` }))),
    ];
    const vistos = new Map();
    for (const { q, src } of all) {
      const key = q.trim().toLowerCase();
      if (vistos.has(key)) throw new Error(`Enunciado repetido en ${vistos.get(key)} y ${src}: "${q}"`);
      vistos.set(key, src);
    }
    expect(vistos.size).toBe(all.length);
  });
});

describe("traducción al inglés de tarjetas y tablas", () => {
  it("cada tarjeta tiene traducción indexada por su anverso español, y ninguna sobra", () => {
    // El anverso español es la clave del progreso guardado; la traducción
    // se indexa por él para no tocar lo que ya hay en localStorage.
    for (const c of CARDS) {
      const t = CARDS_EN[c.f];
      expect(t, `falta la tarjeta "${c.f}"`).toBeDefined();
      expect(text(t.f) && text(t.b), `tarjeta incompleta "${c.f}"`).toBe(true);
    }
    const fronts = new Set(CARDS.map((c) => c.f));
    for (const k of Object.keys(CARDS_EN)) expect(fronts.has(k), `tarjeta huérfana "${k}"`).toBe(true);
  });

  it("las tablas de referencia tienen la misma forma en los dos idiomas", () => {
    for (const name of Object.keys(TABLES_ES)) {
      const es = TABLES_ES[name];
      const en = TABLES_EN[name];
      expect(en, `falta la tabla ${name}`).toBeDefined();
      expect(en, `filas de ${name}`).toHaveLength(es.length);
      es.forEach((row, i) => expect(en[i], `columnas de ${name}[${i}]`).toHaveLength(row.length));
    }
  });
});
