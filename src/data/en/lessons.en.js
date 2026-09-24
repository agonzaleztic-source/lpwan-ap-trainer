/* Cuerpos de las lecciones en inglés, por id de lección. Se reparten en tres
   ficheros solo para poder traducirlos por bloques de dominios; aquí se unen. */
import { LESSON_BODIES_EN_1 } from "./lessons-1.en.js";
import { LESSON_BODIES_EN_2 } from "./lessons-2.en.js";
import { LESSON_BODIES_EN_3 } from "./lessons-3.en.js";

export const LESSON_BODIES_EN = {
  ...LESSON_BODIES_EN_1,
  ...LESSON_BODIES_EN_2,
  ...LESSON_BODIES_EN_3,
};
