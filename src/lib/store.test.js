import { describe, it, expect, beforeEach } from "vitest";
import {
  emptyState, loadState, saveState, clearState, exportState, importState,
  cardState, isDue, scheduleCard, deckStatus, recordAnswer, BOXES,
} from "./store.js";

const DOMS = ["phy", "sec", "mac"];
const KEY = "lorawan-ap-trainer/v1";

/* Doble de localStorage: la implementacion real no existe en Node y ademas
   interesa poder simular que revienta (modo privado, cuota agotada). */
function stubStorage() {
  const map = new Map();
  const st = {
    fallar: false,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { if (st.fallar) throw new Error("QuotaExceededError"); map.set(k, String(v)); },
    removeItem: (k) => { if (st.fallar) throw new Error("SecurityError"); map.delete(k); },
    _put: (obj) => map.set(KEY, JSON.stringify(obj)),
    _raw: (s) => map.set(KEY, s),
  };
  return st;
}

beforeEach(() => { globalThis.localStorage = stubStorage(); });

describe("lectura del almacen", () => {
  it("parte de cero cuando no hay nada guardado", () => {
    expect(loadState(DOMS)).toEqual(emptyState(DOMS));
  });

  it("no revienta con JSON corrupto", () => {
    localStorage._raw("{esto no es json");
    expect(loadState(DOMS)).toEqual(emptyState(DOMS));
  });

  it("descarta un estado de otra version", () => {
    localStorage._put({ v: 99, studied: ["phy1"] });
    expect(loadState(DOMS).studied).toEqual([]);
  });

  it("no deja pasar claves que la app no conoce", () => {
    localStorage._put({ v: 1, studied: [], colada: "valor ajeno" });
    expect(loadState(DOMS)).not.toHaveProperty("colada");
  });

  it("normaliza contadores negativos, NaN y textos a cero", () => {
    localStorage._put({
      v: 1,
      stats: { phy: { seen: -5, right: "muchos" }, sec: { seen: 3.7, right: 2 } },
    });
    const s = loadState(DOMS);
    expect(s.stats.phy).toEqual({ seen: 0, right: 0 });
    expect(s.stats.sec).toEqual({ seen: 3, right: 2 });
    expect(s.stats.mac).toEqual({ seen: 0, right: 0 });   // dominio nuevo, a cero
  });

  it("olvida dominios que ya no existen en el temario", () => {
    localStorage._put({ v: 1, stats: { phy: { seen: 1, right: 1 }, retirado: { seen: 9, right: 9 } } });
    expect(Object.keys(loadState(DOMS).stats).sort()).toEqual(["mac", "phy", "sec"]);
  });

  it("recorta la caja de una tarjeta al maximo de Leitner", () => {
    localStorage._put({ v: 1, cards: { "Que es ADR": { box: 9999, due: "pronto" } } });
    expect(loadState(DOMS).cards["Que es ADR"]).toEqual({ box: BOXES, due: 0 });
  });

  it("una clave __proto__ no envenena el mapa de tarjetas", () => {
    localStorage._raw(JSON.stringify({ v: 1, cards: { __proto__: { box: 5, due: 0 }, real: { box: 2, due: 10 } } }));
    const { cards } = loadState(DOMS);
    expect(cards.real).toEqual({ box: 2, due: 10 });
    expect(Object.getPrototypeOf(cards)).toBe(Object.prototype);
    // Lo que importa: una tarjeta nunca vista sigue empezando de cero.
    expect(cardState(cards, "tarjeta que no existe")).toEqual({ box: 0, due: 0 });
    expect({}.box).toBeUndefined();
  });

  it("tira los fallos con cuenta no positiva y las entradas que no son objeto", () => {
    localStorage._put({ v: 1, failed: { 7: 2, 8: 0, 9: -1, 10: null }, runs: [{ at: 1, score: 5, n: 10, mock: true }, "basura", 42] });
    const s = loadState(DOMS);
    expect(s.failed).toEqual({ 7: 2 });
    expect(s.runs).toEqual([{ at: 1, score: 5, n: 10, mock: true }]);
  });

  it("conserva solo los 30 ultimos intentos", () => {
    const runs = Array.from({ length: 80 }, (_, i) => ({ at: i, score: 1, n: 1, mock: false }));
    localStorage._put({ v: 1, runs });
    const s = loadState(DOMS);
    expect(s.runs).toHaveLength(30);
    expect(s.runs[29].at).toBe(79);
  });

  it("acepta listas donde toca y las rechaza donde no", () => {
    localStorage._put({ v: 1, studied: ["phy1", 42, null, "sec2"], cards: ["no", "soy", "objeto"] });
    const s = loadState(DOMS);
    expect(s.studied).toEqual(["phy1", "sec2"]);
    expect(s.cards).toEqual({});
  });
});

describe("escritura del almacen", () => {
  it("guarda y relee sin perder nada", () => {
    const s = { ...emptyState(DOMS), studied: ["phy1"], failed: { 3: 1 } };
    expect(saveState(s)).toBe(true);
    expect(loadState(DOMS).studied).toEqual(["phy1"]);
  });

  it("devuelve false en vez de romper la app si el almacen falla", () => {
    localStorage.fallar = true;
    expect(saveState(emptyState(DOMS))).toBe(false);
    expect(clearState()).toBe(false);
  });
});

describe("exportar e importar progreso", () => {
  it("lo que exporta se puede volver a importar sin perder nada", () => {
    const s = { ...emptyState(DOMS), studied: ["phy1"], failed: { 3: 1 }, cards: { f: { box: 2, due: 10 } } };
    expect(importState(DOMS, exportState(s))).toEqual(s);
  });

  it("aplica el mismo saneado que loadState a un fichero con basura", () => {
    const texto = JSON.stringify({ v: 1, studied: ["phy1", 42], cards: { __proto__: { box: 5, due: 0 } } });
    const s = importState(DOMS, texto);
    expect(s.studied).toEqual(["phy1"]);
    expect(Object.getPrototypeOf(s.cards)).toBe(Object.prototype);
  });

  it("no acepta un fichero que no es JSON", () => {
    expect(importState(DOMS, "esto no es json")).toBeNull();
  });

  it("no acepta un fichero de otra version ni de otra app", () => {
    expect(importState(DOMS, JSON.stringify({ v: 2, studied: ["x"] }))).toBeNull();
    expect(importState(DOMS, JSON.stringify({ otraCosa: true }))).toBeNull();
  });
});

describe("repaso espaciado (Leitner)", () => {
  const AHORA = 1_700_000_000_000;

  it("una tarjeta nunca vista toca hoy", () => {
    expect(isDue({}, "nueva", AHORA)).toBe(true);
  });

  it("acertar sube de caja y aleja la siguiente vuelta", () => {
    let cards = {};
    const esperado = [10 * 60e3, 24 * 3600e3, 3 * 24 * 3600e3, 7 * 24 * 3600e3, 21 * 24 * 3600e3];
    for (let i = 0; i < BOXES; i++) {
      cards = scheduleCard(cards, "f", true, AHORA);
      expect(cards.f.box).toBe(i + 1);
      expect(cards.f.due - AHORA).toBe(esperado[i]);
    }
    // No pasa de la ultima caja por mucho que se siga acertando.
    cards = scheduleCard(cards, "f", true, AHORA);
    expect(cards.f.box).toBe(BOXES);
  });

  it("fallar la devuelve a la caja 1 y la trae de vuelta en la misma sesion", () => {
    let cards = scheduleCard({}, "f", true, AHORA);
    cards = scheduleCard(cards, "f", true, AHORA);
    cards = scheduleCard(cards, "f", false, AHORA);
    expect(cards.f.box).toBe(1);
    expect(cards.f.due - AHORA).toBe(10 * 60e3);
    expect(isDue(cards, "f", AHORA + 11 * 60e3)).toBe(true);
  });

  it("no muta el mapa anterior", () => {
    const antes = {};
    scheduleCard(antes, "f", true, AHORA);
    expect(antes).toEqual({});
  });

  it("el reparto del mazo cuenta pendientes, vistas y asentadas", () => {
    const deck = [{ f: "a" }, { f: "b" }, { f: "c" }];
    let cards = {};
    cards = scheduleCard(cards, "a", true, AHORA);                       // caja 1
    for (let i = 0; i < 4; i++) cards = scheduleCard(cards, "b", true, AHORA); // caja 4
    const d = deckStatus(cards, deck, AHORA);
    expect(d.due.map((c) => c.f)).toEqual(["c"]);   // solo la que no se ha visto
    expect(d.seen).toBe(2);
    expect(d.mastered).toBe(1);
    expect(d.nextDue).toBe(AHORA + 10 * 60e3);
  });
});

describe("fallos pendientes", () => {
  it("acumula al fallar y se descuenta al acertar", () => {
    let f = recordAnswer({}, 12, false);
    expect(f[12]).toBe(1);
    f = recordAnswer(f, 12, false);
    expect(f[12]).toBe(2);
    f = recordAnswer(f, 12, true);
    expect(f[12]).toBe(1);
    f = recordAnswer(f, 12, true);
    expect(f).not.toHaveProperty("12");
  });

  it("acertar algo que no se habia fallado no lo mete en la lista", () => {
    expect(recordAnswer({}, 5, true)).toEqual({});
  });
});
