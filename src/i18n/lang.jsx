/* Idioma de la interfaz: detección, persistencia y contexto de React.

   El idioma elegido se guarda aparte del progreso, en su propia clave de
   localStorage, para que exportar o reiniciar el progreso no lo toque. Si
   no hay elección guardada se parte del idioma del navegador: español para
   los navegadores en español y inglés para todos los demás, porque el
   examen es en inglés y ese es el público al que llega la app fuera de
   España. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS, LANGS } from "./strings.js";
import { loadEnglish, englishLoaded } from "./content.js";

const KEY = "lorawan-ap-trainer/lang";
export const DEFAULT_LANG = "es";

export function detectLang(saved, navLang) {
  if (LANGS.includes(saved)) return saved;
  const nav = String(navLang || "").toLowerCase();
  return nav.startsWith("es") ? "es" : "en";
}

function readLang() {
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch { /* sin almacenamiento */ }
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return detectLang(saved, nav);
}

function writeLang(lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* sin almacenamiento */ }
}

const LangContext = createContext({ lang: DEFAULT_LANG, t: STRINGS[DEFAULT_LANG], setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readLang);
  /* El contenido en inglés viaja en un chunk aparte (ver content.js). La app
     no se pinta en inglés hasta tenerlo, para no enseñar un instante de
     español a quien entra con el navegador en otro idioma. */
  const [ready, setReady] = useState(() => lang === "es" || englishLoaded());

  useEffect(() => {
    if (ready) return;
    let live = true;
    loadEnglish().then(
      () => live && setReady(true),
      /* Sin red y sin el chunk cacheado: se queda en español. */
      () => { if (live) { setLangState("es"); setReady(true); } },
    );
    return () => { live = false; };
  }, [ready]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    writeLang(next);
    if (next === "es" || englishLoaded()) { setLangState(next); return; }
    /* Sigue viéndose el idioma actual hasta que llegue el chunk. */
    loadEnglish().then(() => setLangState(next), () => {});
  }, []);

  /* El atributo lang del documento importa para lectores de pantalla,
     separación silábica y corrector del navegador. */
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const value = useMemo(() => ({ lang, t: STRINGS[lang], setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{ready ? children : null}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
