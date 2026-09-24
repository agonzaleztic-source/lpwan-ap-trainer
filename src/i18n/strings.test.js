import { describe, it, expect, beforeAll } from "vitest";
import { STRINGS, LANGS } from "./strings.js";
import { detectLang } from "./lang.jsx";
import { localizeQuestion, localizeCheck, localizeCard, lessonTitle, loadEnglish } from "./content.js";
import { QUESTIONS } from "../data/questions.js";
import { LESSONS } from "../data/lessons.js";
import { CARDS } from "../data/cards.js";
import { shuffleOptions } from "../lib/radio.js";

/* Devuelve las rutas de todas las hojas de un árbol de cadenas, con el tipo
   de cada una, para comparar los dos idiomas clave a clave. */
function shape(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) out.push(...shape(v, path));
    else if (Array.isArray(v)) out.push(`${path}[${v.length}]`);
    else out.push(`${path}:${v === null ? "null" : typeof v}`);
  }
  return out.sort();
}

describe("cadenas de interfaz", () => {
  it("todos los idiomas tienen las mismas claves con el mismo tipo", () => {
    // `theory.spanishOnly` es null en español y texto en inglés a propósito.
    const norm = (s) => s.replace(/^theory\.spanishOnly:.*$/, "theory.spanishOnly");
    const base = shape(STRINGS.es).map(norm);
    for (const l of LANGS) expect(shape(STRINGS[l]).map(norm), `idioma ${l}`).toEqual(base);
  });

  it("ninguna cadena está vacía", () => {
    const walk = (v, path) => {
      if (typeof v === "string") expect(v.trim().length, path).toBeGreaterThan(0);
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
    };
    for (const l of LANGS) walk(STRINGS[l], l);
  });

  it("las funciones de interpolación devuelven texto en ambos idiomas", () => {
    for (const l of LANGS) {
      const t = STRINGS[l];
      expect(t.dash.lead(3, 24, 40, 75)).toContain("24");
      expect(t.quiz.hits(8, 10)).toContain("8");
      expect(t.cards.status(2, 5, 9)).toContain("9");
      expect(t.tools.phyNote(25, 12, 33)).toContain("25");
      expect(t.pct(85)).toMatch(/^85 ?%$/);
    }
  });
});

describe("detección del idioma", () => {
  it("respeta la elección guardada", () => {
    expect(detectLang("en", "es-ES")).toBe("en");
    expect(detectLang("es", "en-US")).toBe("es");
  });
  it("sin elección guardada, español para navegadores en español e inglés para el resto", () => {
    expect(detectLang(null, "es-MX")).toBe("es");
    expect(detectLang(null, "en-GB")).toBe("en");
    expect(detectLang(null, "de")).toBe("en");
    expect(detectLang(null, "")).toBe("en");
  });
  it("ignora valores guardados que no sean un idioma conocido", () => {
    expect(detectLang("fr", "es")).toBe("es");
    expect(detectLang("__proto__", "en")).toBe("en");
  });
});

describe("localización del contenido", () => {
  beforeAll(() => loadEnglish());

  it("en español devuelve el original intacto", () => {
    const q = QUESTIONS[0];
    expect(localizeQuestion(q, "es")).toBe(q);
    expect(localizeCheck(LESSONS[0].id, 0, LESSONS[0].checks[0], "es")).toBe(LESSONS[0].checks[0]);
    expect(lessonTitle(LESSONS[0], "es")).toBe(LESSONS[0].title);
  });

  it("en inglés cambia el texto pero conserva id, dominio, índice de la correcta y referencia", () => {
    for (const q of QUESTIONS) {
      const e = localizeQuestion(q, "en");
      expect(e.id).toBe(q.id);
      expect(e.dom).toBe(q.dom);
      expect(e.a).toBe(q.a);
      expect(e.ref).toBe(q.ref);
      expect(e.q).not.toBe(q.q);
      expect(e.opts).toHaveLength(4);
    }
  });

  it("la traducción se aplica antes de barajar y la correcta sigue siendo la misma opción", () => {
    // La opción correcta en inglés debe ser la traducción de la correcta en
    // español: misma posición antes de barajar, y tras barajar `a` la sigue.
    for (const q of QUESTIONS.slice(0, 40)) {
      const en = localizeQuestion(q, "en");
      const s = shuffleOptions(en, 12345);
      expect(s.opts[s.a]).toBe(en.opts[q.a]);
    }
  });

  it("la tarjeta localizada conserva el anverso español como clave del progreso", () => {
    for (const c of CARDS) {
      const e = localizeCard(c, "en");
      expect(e.key).toBe(c.f);
      expect(e.dom).toBe(c.dom);
      expect(typeof e.f).toBe("string");
      expect(typeof e.b).toBe("string");
      expect(localizeCard(c, "es").key).toBe(c.f);
    }
  });
});
