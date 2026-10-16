/* ESLint en configuración plana: reglas recomendadas de JavaScript y de los
   hooks de React. Se ejecuta con `npm run lint` y en el CI de cada PR. */
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["dist/", "coverage/"] },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
  },
  /* El service worker corre en su propio ámbito y vite.config.js en Node. */
  /* __PRECACHE__ lo sustituye vite.config.js al compilar. */
  { files: ["src/sw.js"], languageOptions: { globals: { ...globals.serviceworker, __PRECACHE__: "readonly" } } },
  { files: ["vite.config.js", "eslint.config.js"], languageOptions: { globals: { ...globals.node } } },
];
