/* Atajos de teclado del test.

   1-4 o A-D eligen opción y Enter pasa a la siguiente pregunta una vez
   respondida. Lógica pura: recibe lo mínimo del evento y del estado y
   devuelve qué hacer, para poder probarla sin navegador. */

const LETTERS = "abcd";

/* ¿El foco está en un sitio donde se escribe? Ahí las teclas son del campo. */
export function isTypingTarget(target) {
  if (!target) return false;
  const tag = String(target.tagName || "").toUpperCase();
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable === true;
}

/* `e`: { key, ctrlKey, metaKey, altKey, target }.
   `state`: { nOpts, answered }.
   Devuelve { type: "pick", idx }, { type: "advance" } o null (no es nuestro). */
export function quizKeyAction(e, { nOpts, answered }) {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  if (isTypingTarget(e.target)) return null;
  const key = String(e.key || "");

  if (key === "Enter") {
    /* Sobre un botón o un enlace, Enter ya lo pulsa el navegador: si además
       se avanzase aquí, se saltaría una pregunta. */
    const tag = String(e.target?.tagName || "").toUpperCase();
    if (tag === "BUTTON" || tag === "A") return null;
    return answered ? { type: "advance" } : null;
  }

  if (answered || key.length !== 1) return null;
  let idx = -1;
  if (key >= "1" && key <= "9") idx = Number(key) - 1;
  else idx = LETTERS.indexOf(key.toLowerCase());
  return idx >= 0 && idx < nOpts && idx < LETTERS.length ? { type: "pick", idx } : null;
}
