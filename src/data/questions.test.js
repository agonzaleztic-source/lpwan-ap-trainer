import { describe, it, expect } from "vitest";
import { QUESTIONS } from "./questions.js";
import { LESSONS } from "./lessons.js";

/* El banco se edita a mano; estos tests pillan lo que un enunciado repetido
   o un id duplicado (fallo de copiar y pegar) dejarían pasar en silencio:
   dos preguntas que parecen distintas pero enseñan lo mismo, o un `id` que
   pisa el fallo/estadística de otra pregunta en store.js. */

const checks = LESSONS.flatMap((l) => l.checks.map((c) => ({ ...c, lesson: l.id })));
const all = [...QUESTIONS.map((q) => ({ ...q, src: "banco de tests" })), ...checks.map((c) => ({ ...c, src: `lección ${c.lesson}` }))];

describe("integridad del banco de preguntas", () => {
  it("ningún enunciado se repite entre el banco de tests y las comprobaciones de lección", () => {
    const vistos = new Map();
    for (const q of all) {
      const enunciado = q.q.trim();
      if (vistos.has(enunciado)) {
        throw new Error(`Enunciado repetido en ${vistos.get(enunciado)} y ${q.src}: "${enunciado}"`);
      }
      vistos.set(enunciado, q.src);
    }
    expect(vistos.size).toBe(all.length);
  });

  it("los ids del banco de tests son únicos", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("toda pregunta tiene cuatro opciones y una respuesta correcta válida", () => {
    for (const q of all) {
      expect(q.opts).toHaveLength(4);
      expect(q.a).toBeGreaterThanOrEqual(0);
      expect(q.a).toBeLessThanOrEqual(3);
    }
  });

  it("el índice de la respuesta correcta no está sesgado hacia una posición", () => {
    const dist = [0, 0, 0, 0];
    for (const q of all) dist[q.a]++;
    // Con reparto uniforme tocarían ~36-37 de 146; se tolera un margen amplio
    // para no volver a caer en el sesgo de origen (112 de 146 en el índice 1).
    for (const n of dist) expect(n).toBeGreaterThan(all.length / 4 - 15);
  });

  // `ref` es opcional a propósito: solo se rellena cuando el contenido está
  // respaldado por una sección verificada de TS001, RP002 o TS002. Este test
  // no valida que la cita sea correcta (eso se comprobó a mano contra los PDF
  // oficiales), solo que nadie cuele un formato o una fuente distinta sin querer.
  it("la referencia a la especificación, cuando existe, cita un documento reconocido", () => {
    const conRef = all.filter((q) => q.ref);
    expect(conRef.length).toBeGreaterThan(0);
    for (const q of conRef) {
      expect(q.ref).toMatch(/^(TS001-1\.1|TS001|RP002|TS002)(\s§.+)?$/);
    }
  });
});
