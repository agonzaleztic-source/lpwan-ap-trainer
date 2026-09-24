/* Paquete de contenido en inglés. Solo se importa de forma dinámica desde
   content.js, para que Vite lo saque a un chunk aparte y quien estudia en
   español no descargue ni una línea de inglés. */

export { QUESTIONS_EN } from "../data/en/questions.en.js";
export { CHECKS_EN } from "../data/en/checks.en.js";
export { CARDS_EN } from "../data/en/cards.en.js";
export { TITLES_EN } from "../data/en/titles.en.js";
export * as TABLES_EN from "../data/en/tables.en.js";
export { LESSON_BODIES_EN } from "../data/en/lessons.en.js";
