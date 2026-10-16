import { describe, it, expect } from "vitest";
import { lessonBody, fetchLessonBody, loadLessonBodies } from "./content.js";
import { LESSONS } from "../data/lessons.js";
import { LESSON_BODIES } from "../data/lesson-bodies.js";
import { LESSON_BODIES_EN } from "../data/en/lessons.en.js";

/* Los cuerpos de las lecciones se cargan bajo demanda (chunk aparte). */
describe("cuerpos de las lecciones bajo demanda", () => {
  it("el índice de lecciones no arrastra el cuerpo y cada lección tiene el suyo", () => {
    for (const l of LESSONS) {
      expect(l.body, `${l.id} no debe llevar body`).toBeUndefined();
      expect(LESSON_BODIES[l.id]?.length, `cuerpo de ${l.id}`).toBeGreaterThan(0);
    }
    expect(Object.keys(LESSON_BODIES).sort()).toEqual(LESSONS.map((l) => l.id).sort());
  });

  it("antes de cargar no hay cuerpo; después, el del idioma pedido", async () => {
    const id = LESSONS[0].id;
    expect(lessonBody(id, "es")).toBeNull();
    expect(lessonBody(id, "en")).toBeNull();
    expect(await fetchLessonBody(id, "es")).toBe(LESSON_BODIES[id]);
    expect(lessonBody(id, "es")).toBe(LESSON_BODIES[id]);
    // Con el español cargado, el inglés no se sustituye por el español.
    expect(lessonBody(id, "en")).toBeNull();
    await loadLessonBodies("en");
    expect(lessonBody(id, "en")).toBe(LESSON_BODIES_EN[id]);
    expect(await fetchLessonBody(id, "en")).toBe(LESSON_BODIES_EN[id]);
  });

  it("una lección inexistente devuelve null", async () => {
    expect(await fetchLessonBody("nope", "es")).toBeNull();
  });
});
