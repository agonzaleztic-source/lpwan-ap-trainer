/* Calculos de radio LoRa: tiempo en aire, sensibilidad y utilidades. */
export function timeOnAir({ sf, bw, cr, payload, preamble = 8, crc = 1, header = 0 }) {
  const de = bw === 125000 && sf >= 11 ? 1 : 0;
  const tSym = Math.pow(2, sf) / bw;
  const tPre = (preamble + 4.25) * tSym;
  const num = 8 * payload - 4 * sf + 28 + 16 * crc - 20 * header;
  const den = 4 * (sf - 2 * de);
  const nPayload = 8 + Math.max(Math.ceil(num / den) * (cr + 4), 0);
  const tPay = nPayload * tSym;
  return { tSym: tSym * 1000, toa: (tPre + tPay) * 1000, symbols: nPayload, de };
}
export const SENS = { 7: -123, 8: -126, 9: -129, 10: -132, 11: -134.5, 12: -137 };
/* Formato numérico según el idioma de la interfaz: coma decimal en español,
   punto en inglés. Por defecto español, que es como se escribió el banco. */
export const fmt = (n, d = 1, locale = "es-ES") =>
  n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });

/* Generador pseudoaleatorio con semilla (mulberry32).

   El anterior era un congruencial lineal, `s * 1103515245 + 12345`, y ese
   producto llega a 2,4e18: por encima de Number.MAX_SAFE_INTEGER, asi que el
   resultado se redondeaba y el generador perdia bits bajos y caia en ciclos
   cortos (15.820 valores distintos en 100.000 pasos). Medido sobre el uso
   real no llegaba a sesgar el reparto —cada barajado estrena semilla y solo
   da 73 pasos—, pero un generador cuya aritmetica no cabe en el tipo no
   garantiza nada. Mulberry32 hace lo mismo con Math.imul y desplazamientos
   sin signo, siempre dentro de 32 bits exactos.

   No es criptografico ni pretende serlo: aqui solo decide en que orden se
   ven cuatro opciones. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, seed) {
  const a = [...arr];
  const rnd = rng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const randSeed = () => Math.floor(Math.random() * 2147483646) + 1;

/* Baraja las opciones de una pregunta y recalcula el indice de la correcta.
   Se aplica en cada intento: si la correcta cae siempre en la misma posicion,
   el alumno aprende la posicion en lugar de la materia. */
export function shuffleOptions(q, seed) {
  const order = shuffle(q.opts.map((_, i) => i), seed);
  return { ...q, opts: order.map((i) => q.opts[i]), a: order.indexOf(q.a) };
}
