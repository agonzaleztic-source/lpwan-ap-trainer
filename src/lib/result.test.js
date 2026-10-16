import { describe, it, expect } from "vitest";
import { summarize, scoreBand, PASS_MARK } from "./result.js";

const q = (dom, a = 0) => ({ dom, a });
const right = (dom) => ({ q: q(dom), idx: 0 });
const wrong = (dom) => ({ q: q(dom), idx: 1 });
const many = (k, f, dom) => Array.from({ length: k }, () => f(dom));

describe("bandas de nota", () => {
  it("el aprobado del examen real es el 80 %", () => {
    expect(PASS_MARK).toBe(80);
  });
  it("≥ 80 verde, ≥ 70 ámbar y el resto rojo", () => {
    expect(scoreBand(100)).toBe("pass");
    expect(scoreBand(82)).toBe("pass");
    expect(scoreBand(80)).toBe("pass");
    expect(scoreBand(79)).toBe("near");
    expect(scoreBand(70)).toBe("near");
    expect(scoreBand(69)).toBe("low");
    expect(scoreBand(0)).toBe("low");
  });
});

describe("resumen del resultado", () => {
  it("cuenta aciertos, nota y veredicto", () => {
    const log = [...many(41, right, "phy"), ...many(9, wrong, "phy")];
    const r = summarize(log);
    expect(r).toMatchObject({ hits: 41, answered: 50, unanswered: 0, n: 50, score: 82, passed: true, band: "pass" });
  });

  it("justo en el 80 % aprueba y una décima por debajo suspende", () => {
    expect(summarize([...many(8, right, "phy"), ...many(2, wrong, "phy")]).passed).toBe(true);
    expect(summarize([...many(79, right, "phy"), ...many(21, wrong, "phy")]).passed).toBe(false);
  });

  it("las preguntas sin responder cuentan como fallo, en la nota y en su dominio", () => {
    const log = many(45, right, "sec");
    const r = summarize(log, [...many(50, (d) => q(d), "sec"), ...many(5, (d) => q(d), "reg")]);
    expect(r.n).toBe(100);
    expect(r.unanswered).toBe(55);
    expect(r.score).toBe(45);
    expect(r.passed).toBe(false);
    expect(r.byDomain).toEqual([
      { dom: "reg", hits: 0, n: 5, pct: 0 },
      { dom: "sec", hits: 45, n: 95, pct: 47 },
    ]);
  });

  it("ordena los dominios de peor a mejor; a igual %, primero el de más preguntas", () => {
    const log = [
      ...many(3, right, "phy"), wrong("phy"),            // 75 %
      right("mac"), wrong("mac"),                        // 50 %
      ...many(2, right, "reg"), ...many(2, wrong, "reg"), // 50 %, más preguntas
      ...many(5, right, "ops"),                          // 100 %
    ];
    const r = summarize(log);
    expect(r.byDomain.map((d) => d.dom)).toEqual(["reg", "mac", "phy", "ops"]);
    expect(r.byDomain[0]).toEqual({ dom: "reg", hits: 2, n: 4, pct: 50 });
  });

  it("sin respuestas no hay nota ni aprobado", () => {
    expect(summarize([])).toMatchObject({ n: 0, score: 0, passed: false, byDomain: [] });
  });
});
