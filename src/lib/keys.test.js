import { describe, it, expect } from "vitest";
import { quizKeyAction, isTypingTarget } from "./keys.js";

const body = { tagName: "BODY" };
const ev = (key, extra = {}) => ({ key, target: body, ...extra });
const fresh = { nOpts: 4, answered: false };
const done = { nOpts: 4, answered: true };

describe("atajos de teclado del test", () => {
  it("1-4 eligen opción", () => {
    expect(quizKeyAction(ev("1"), fresh)).toEqual({ type: "pick", idx: 0 });
    expect(quizKeyAction(ev("4"), fresh)).toEqual({ type: "pick", idx: 3 });
  });

  it("A-D eligen opción, en mayúscula o minúscula", () => {
    expect(quizKeyAction(ev("a"), fresh)).toEqual({ type: "pick", idx: 0 });
    expect(quizKeyAction(ev("C"), fresh)).toEqual({ type: "pick", idx: 2 });
    expect(quizKeyAction(ev("d"), fresh)).toEqual({ type: "pick", idx: 3 });
  });

  it("no elige opciones que no existen", () => {
    expect(quizKeyAction(ev("5"), fresh)).toBeNull();
    expect(quizKeyAction(ev("0"), fresh)).toBeNull();
    expect(quizKeyAction(ev("e"), fresh)).toBeNull();
    expect(quizKeyAction(ev("3"), { nOpts: 2, answered: false })).toBeNull();
    expect(quizKeyAction(ev("ArrowDown"), fresh)).toBeNull();
  });

  it("una vez respondida no se cambia la respuesta", () => {
    expect(quizKeyAction(ev("2"), done)).toBeNull();
    expect(quizKeyAction(ev("b"), done)).toBeNull();
  });

  it("Enter pasa a la siguiente solo si ya se ha respondido", () => {
    expect(quizKeyAction(ev("Enter"), done)).toEqual({ type: "advance" });
    expect(quizKeyAction(ev("Enter"), fresh)).toBeNull();
  });

  it("Enter sobre un botón o enlace se deja al navegador (no avanza dos veces)", () => {
    expect(quizKeyAction(ev("Enter", { target: { tagName: "BUTTON" } }), done)).toBeNull();
    expect(quizKeyAction(ev("Enter", { target: { tagName: "A" } }), done)).toBeNull();
  });

  it("no interfiere al escribir en un campo", () => {
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT"]) {
      expect(quizKeyAction(ev("1", { target: { tagName } }), fresh)).toBeNull();
      expect(quizKeyAction(ev("Enter", { target: { tagName } }), done)).toBeNull();
    }
    expect(quizKeyAction(ev("a", { target: { tagName: "DIV", isContentEditable: true } }), fresh)).toBeNull();
  });

  it("no roba atajos del navegador con Ctrl, Cmd o Alt", () => {
    expect(quizKeyAction(ev("1", { ctrlKey: true }), fresh)).toBeNull();
    expect(quizKeyAction(ev("a", { metaKey: true }), fresh)).toBeNull();
    expect(quizKeyAction(ev("Enter", { altKey: true }), done)).toBeNull();
  });

  it("isTypingTarget reconoce campos de texto", () => {
    expect(isTypingTarget({ tagName: "input" })).toBe(true);
    expect(isTypingTarget(body)).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
