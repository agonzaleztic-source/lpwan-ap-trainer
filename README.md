# LPWAN AP Trainer

Curso y entrenador para el examen de certificación LoRaWAN Accredited Professional. Incluye 24
lecciones de teoría explicada, 146 preguntas con corrección razonada (74 en el banco de tests y
72 de comprobación al final de las lecciones), 61 tarjetas de repaso espaciado, simulacro
cronometrado y calculadoras de radio (tiempo en aire, ciclo de trabajo y presupuesto de enlace).

El temario cubre los ocho dominios del examen en unas tres horas y media de estudio, pensado
para leerse en orden: cada bloque se apoya en el anterior.

Funciona en el navegador, se instala como app en el móvil y sigue funcionando sin conexión.
No tiene servidor ni cuentas, no recoge ningún dato y no hace una sola petición a terceros:
el progreso se queda en el navegador de quien estudia.

**Proyecto independiente, no afiliado ni respaldado por la LoRa Alliance.** LoRaWAN® es una
marca registrada de la LoRa Alliance, Inc.; se menciona aquí solo como referencia factual al
examen de certificación que cubre el temario.

**App publicada:** https://agonzaleztic-source.github.io/lpwan-ap-trainer/

## Cómo entrena

- **Las opciones se barajan en cada intento.** La posición de la respuesta correcta nunca es
  una pista: se aprende la materia, no la letra.
- **El progreso se guarda en el dispositivo.** Lecciones estudiadas, acierto por dominio,
  historial de tests y estado de las tarjetas sobreviven a cerrar la app.
- **Las tarjetas usan repaso espaciado** (Leitner de cinco cajas): lo que aciertas tarda más
  en volver, lo que fallas reaparece en la misma sesión.
- **Los fallos se reinyectan.** Una pregunta fallada entra primero en los siguientes tests y
  solo sale de la lista cuando la aciertas más tarde.
- **El progreso se puede exportar e importar.** Desde el panel, un botón descarga un JSON con
  todo el estado y otro lo restaura en cualquier dispositivo, validado con el mismo saneado
  que protege lo que vuelve de `localStorage`.

## Instalarla en el móvil

Abre https://agonzaleztic-source.github.io/lpwan-ap-trainer/ en el móvil:

- **Android (Chrome)**: menú ⋮ → *Añadir a pantalla de inicio*.
- **iOS (Safari)**: botón compartir → *Añadir a pantalla de inicio*.

Se abre a pantalla completa y, tras la primera visita, el service worker guarda todo en
caché para estudiar en el metro o en zonas sin cobertura.

## Arrancar en local

Requiere Node.js 20.19 o superior ([nodejs.org](https://nodejs.org)).

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Los cambios en `src/App.jsx` se recargan solos.

Para ver la versión de producción tal cual quedará publicada:

```bash
npm run build
npm run preview
```

## Comprobaciones

```bash
npm test     # 32 pruebas sobre los cálculos de radio y el motor de repaso
npm run audit
```

Las pruebas cubren lo que no se puede verificar a ojo: los tiempos en aire
contra los valores de referencia de Semtech (SF7/125 kHz/13 B = 46,3 ms;
SF12 = 1,155 s), el reparto uniforme de la respuesta correcta entre las cuatro
posiciones, la progresión de cajas de Leitner y el saneado de lo que vuelve de
`localStorage`. Se ejecutan, junto con la auditoría de dependencias, en cada
push a `main` antes de publicar.

Sobre el modelo de amenaza, las medidas y sus límites: [SECURITY.md](SECURITY.md).

## Estructura

```
├── index.html                  punto de entrada y metadatos
├── vite.config.js              base automática para GitHub Pages
├── src
│   ├── main.jsx                arranque de React y registro del service worker
│   ├── App.jsx                 componentes de la interfaz
│   ├── styles.js               hoja de estilos completa
│   ├── sw.js                   caché para uso sin conexión
│   ├── lib/radio.js            tiempo en aire, sensibilidad y barajado de opciones
│   ├── lib/store.js            progreso guardado y repaso espaciado
│   ├── lib/*.test.js           pruebas de ambos módulos
│   └── data
│       ├── domains.js          los ocho dominios temáticos
│       ├── lessons.js          las 24 lecciones de teoría
│       ├── questions.js        banco de preguntas de los tests
│       ├── cards.js            tarjetas de repaso
│       └── tables.js           tablas de referencia rápida
├── public
│   ├── manifest.webmanifest    permite instalarla como app
│   ├── fonts/                  tipografías autoalojadas, subconjunto latino
│   └── icon-*.png / icon.svg   iconos
├── SECURITY.md                 modelo de amenaza y medidas
└── .github
    ├── workflows/deploy.yml    pruebas, auditoría y publicación
    └── dependabot.yml          actualización de dependencias y acciones
```

El contenido de estudio está separado de la interfaz: todo vive en `src/data/`, así que puedes
ampliar el temario sin tocar una sola línea de React.

## Añadir una lección

En `src/data/lessons.js`. El cuerpo se compone de bloques con estos tipos:

```js
{ id: "phy4", dom: "phy", mins: 7, title: "Título de la lección",
  body: [
    { t: "p",       x: "Un párrafo normal." },
    { t: "h",       x: "Un subtítulo" },
    { t: "key",     x: "La idea que hay que retener." },
    { t: "warn",    x: "Una trampa habitual del examen." },
    { t: "list",    x: ["punto", "otro punto"] },
    { t: "num",     x: ["primer paso", "segundo paso"] },
    { t: "formula", x: "Tsym = 2^SF / BW", note: "Aclaración opcional." },
    { t: "table",   head: ["Col A", "Col B"], rows: [["a", "b"]] },
  ],
  checks: [
    { q: "¿Pregunta de comprobación?", opts: ["A", "B", "C", "D"], a: 1,
      exp: "Por qué la respuesta correcta lo es." },
  ] },
```

Las lecciones aparecen agrupadas por dominio y en el orden del array.

## Añadir preguntas al banco de tests

En `src/data/questions.js`. El campo `a` es el índice de la opción correcta empezando en cero:

```js
{ id: 75, dom: "cmd", q: "¿Qué comando ajusta el retardo de RX1?",
  opts: ["RXParamSetupReq", "RXTimingSetupReq", "DlChannelReq", "NewChannelReq"], a: 1,
  exp: "RXTimingSetupReq (0x08) modifica RECEIVE_DELAY1; RECEIVE_DELAY2 se deriva sumando 1 s." },
```

Los `dom` válidos son: `phy`, `arq`, `cls`, `sec`, `mac`, `cmd`, `reg`, `ops`.
Guarda, comprueba en local con `npm run dev` y publica con un push a `main`.

## Aviso sobre el contenido

El material se ha elaborado a partir de la documentación pública de la especificación
LoRaWAN. No procede del banco de preguntas oficial ni lo reproduce. La fuente definitiva
para el examen son los documentos de la LoRa Alliance: TS001 (Link Layer), RP002 (Regional
Parameters) y el resto de la Resource Library.

## Desplegar tu propia copia

El despliegue está automatizado: `.github/workflows/deploy.yml` compila y publica en GitHub
Pages con cada push a `main`, y `vite.config.js` calcula la ruta base a partir del nombre del
repositorio, así que no hay nada que configurar a mano.

Haz un fork del repositorio, entra en **Settings → Pages** y elige **GitHub Actions** como
*Source*. El workflow se ejecuta con el primer push y deja la app publicada en
`https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Licencia

MIT — ver [LICENSE](LICENSE).
