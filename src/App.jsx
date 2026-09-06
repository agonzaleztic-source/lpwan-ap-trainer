import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { CSS } from "./styles.js";
import { DOMAINS, DOM_NAME, DOM_COLOR } from "./data/domains.js";
import { QUESTIONS } from "./data/questions.js";
import { CARDS } from "./data/cards.js";
import { LESSONS } from "./data/lessons.js";
import { T_DR_EU, T_MTYPE, T_CID, T_KEYS, T_TIMES, T_DOCS } from "./data/tables.js";
import { timeOnAir, SENS, fmt, shuffle, shuffleOptions, randSeed } from "./lib/radio.js";
import {
  emptyState, loadState, saveState, clearState, exportState, importState,
  scheduleCard, deckStatus, cardState, humanDelay, recordAnswer,
} from "./lib/store.js";

/* ============================================================
   PIEZAS REUTILIZABLES
   ============================================================ */
function Waterfall() {
  const rows = [];
  for (let r = 0; r < 14; r++) {
    const y = r * 32;
    const off = (r * 37) % 120;
    for (let c = 0; c < 9; c++) {
      const x = c * 120 + off;
      rows.push(
        <polyline key={`${r}-${c}`} points={`${x},${y + 22} ${x + 96},${y + 2}`}
          stroke={r % 4 === 1 ? "#9A8CFA" : "#35D6C6"} strokeWidth={r % 3 === 0 ? 1.4 : 0.8}
          opacity={0.1 + ((r * 7 + c * 3) % 9) * 0.035} fill="none" strokeLinecap="round" />
      );
    }
  }
  return (
    <div className="lw-fall" aria-hidden="true">
      <svg viewBox="0 0 1080 384" preserveAspectRatio="xMidYMid slice">
        <g className="chirp-run">{rows}</g>
      </svg>
    </div>
  );
}

function Table({ head, rows, mono = [] }) {
  return (
    <div className="lw-scroll" style={{ marginBottom: 20 }}>
      <table className="lw-tbl">
        <thead><tr>{head.map((h, i) => <th key={i} className={mono.includes(i) ? "m" : ""}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={mono.includes(j) ? "m" : ""}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, children }) {
  return <div className="lw-field"><label>{label}</label>{children}</div>;
}

/* Renderiza un bloque del cuerpo de una lección. */
function Block({ b }) {
  switch (b.t) {
    case "h": return <h4>{b.x}</h4>;
    case "key": return <div className="lw-box key"><b>Idea clave</b>{b.x}</div>;
    case "warn": return <div className="lw-box warn"><b>Ojo en el examen</b>{b.x}</div>;
    case "list": return <ul>{b.x.map((i, k) => <li key={k}>{i}</li>)}</ul>;
    case "num": return <ol>{b.x.map((i, k) => <li key={k}>{i}</li>)}</ol>;
    case "table": return <Table head={b.head} rows={b.rows} />;
    case "formula": return (
      <>
        <pre className="lw-fx">{b.x}</pre>
        {b.note && <p className="lw-fx-n">{b.note}</p>}
      </>
    );
    default: return <p>{b.x}</p>;
  }
}

/* Preguntas de comprobación al final de cada lección.
   Las opciones se barajan una vez por montaje: al reabrir la lección el
   orden cambia, así que no se puede memorizar la posición de la correcta. */
function Check({ c, i, onAnswer }) {
  const [pick, setPick] = useState(null);
  const [seed] = useState(randSeed);
  const q = useMemo(() => shuffleOptions(c, seed), [c, seed]);
  const choose = (k) => {
    if (pick !== null) return;
    setPick(k);
    onAnswer(k === q.a);
  };
  return (
    <div style={{ marginBottom: 26 }}>
      <p style={{ fontSize: 15.5, fontWeight: 500, marginBottom: 12 }}>
        <span className="mono" style={{ color: "var(--muted)", marginRight: 8 }}>{i + 1}.</span>{q.q}
      </p>
      {q.opts.map((o, k) => {
        let cls = "lw-opt";
        if (pick !== null) { if (k === q.a) cls += " good"; else if (k === pick) cls += " bad"; }
        return (
          <button key={k} className={cls} disabled={pick !== null} onClick={() => choose(k)}>
            <span className="k">{"ABCD"[k]}</span><span>{o}</span>
          </button>
        );
      })}
      {pick !== null && <div className="lw-exp" style={{ marginTop: 10 }}>{q.exp}</div>}
    </div>
  );
}

/* ============================================================
   TEORÍA
   ============================================================ */
function Theory({ studied, markStudied, record }) {
  const [openId, setOpenId] = useState(null);
  const lesson = LESSONS.find((l) => l.id === openId);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [openId]);

  if (lesson) {
    const idx = LESSONS.indexOf(lesson);
    const next = LESSONS[idx + 1];
    const done = studied.includes(lesson.id);
    return (
      <div>
        <button className="lw-btn ghost" style={{ marginBottom: 22 }} onClick={() => setOpenId(null)}>
          Volver al temario
        </button>
        <span className="mono" style={{ fontSize: 12, color: DOM_COLOR[lesson.dom] }}>
          {DOM_NAME[lesson.dom]} · {lesson.mins} min
        </span>
        <h2 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 26px", maxWidth: "22ch" }}>{lesson.title}</h2>

        <div className="lw-read">
          {lesson.body.map((b, k) => <Block key={k} b={b} />)}
        </div>

        <div className="lw-check">
          <h3 style={{ fontSize: 17, marginBottom: 18 }}>Compruébalo</h3>
          {lesson.checks.map((c, k) => (
            <Check key={`${lesson.id}-${k}`} c={c} i={k} onAnswer={(ok) => record(lesson.dom, ok)} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {!done && (
            <button className="lw-btn primary" onClick={() => markStudied(lesson.id)}>
              Marcar como estudiada
            </button>
          )}
          {next && (
            <button className="lw-btn" onClick={() => { markStudied(lesson.id); setOpenId(next.id); }}>
              Siguiente: {next.title}
            </button>
          )}
        </div>
      </div>
    );
  }

  const totalMins = LESSONS.reduce((s, l) => s + l.mins, 0);
  return (
    <div>
      <h2 className="lw-h2">Teoría</h2>
      <p className="lw-lead">
        Veinticuatro lecciones que cubren la materia del examen desde cero, con las ideas clave, las trampas
        habituales y tres preguntas de comprobación al final de cada una. Unas {Math.round(totalMins / 60)} horas
        de lectura en total.
      </p>
      <div className="lw-bar" style={{ marginBottom: 8 }}>
        <i style={{ width: `${(studied.length / LESSONS.length) * 100}%` }} />
      </div>
      <p className="lw-note" style={{ marginBottom: 26 }}>
        {studied.length} de {LESSONS.length} lecciones estudiadas
      </p>

      {DOMAINS.map((d) => {
        const ls = LESSONS.filter((l) => l.dom === d.id);
        if (!ls.length) return null;
        return (
          <div key={d.id} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 9 }}>
              <i className="lw-dot" style={{ background: d.c }} />{d.n}
            </h3>
            {ls.map((l) => (
              <button key={l.id} className={`lw-lesson-row${studied.includes(l.id) ? " done" : ""}`}
                onClick={() => setOpenId(l.id)}>
                <span className="lw-lesson-t">{l.title}</span>
                <span className="lw-lesson-m">{l.mins} min</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   PANEL
   ============================================================ */
const PLAN = [
  { s: "Semana 1", t: "Fundamentos de radio y arquitectura",
    x: "Lecciones de capa física y arquitectura. Al terminar, deberías saber calcular un tiempo en aire de memoria y explicar el recorrido completo de un uplink." },
  { s: "Semana 2", t: "Clases, seguridad y trama",
    x: "Las nueve lecciones de clases, activación y formato de trama. Es el bloque más denso y el que más preguntas concentra." },
  { s: "Semana 3", t: "Comandos, ADR y regiones",
    x: "Comandos MAC, funcionamiento real del ADR y planes regionales. Memoriza aquí las tablas de la sección de referencia." },
  { s: "Semana 4", t: "Despliegue y repaso",
    x: "Lecciones de operación, más simulacros completos hasta sostener el 85 % de acierto. Las tarjetas son para los huecos que salgan." },
];

function Dashboard({ stats, studied, cards, failed, runs, persists, onReset, onExport, onImport, go }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importMsg, setImportMsg] = useState(null); // null | "ok" | "error"
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo fichero más tarde
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImportMsg(onImport(String(reader.result)) ? "ok" : "error");
    reader.onerror = () => setImportMsg("error");
    reader.readAsText(file);
  }
  const total = Object.values(stats).reduce((s, v) => s + v.seen, 0);
  const right = Object.values(stats).reduce((s, v) => s + v.right, 0);
  const pct = total ? Math.round((right / total) * 100) : 0;
  const nFails = QUESTIONS.filter((q) => failed[q.id]).length;
  const mastered = CARDS.filter((c) => cardState(cards, c.f).box >= 4).length;
  const dueToday = CARDS.filter((c) => cardState(cards, c.f).due <= Date.now()).length;
  /* "Sostenido" significa varios intentos seguidos por encima del listón,
     no una buena nota suelta. Se miran los tres últimos. */
  const last3 = runs.slice(-3);
  const sustained = last3.length === 3 && last3.every((r) => r.score >= 85);
  const weak = DOMAINS.map((d) => ({ ...d, s: stats[d.id] }))
    .filter((d) => d.s.seen >= 3)
    .sort((a, b) => a.s.right / a.s.seen - b.s.right / b.s.seen)[0];
  const nextLesson = LESSONS.find((l) => !studied.includes(l.id));

  return (
    <div>
      <h2 className="lw-h2">Tu preparación</h2>
      <p className="lw-lead">
        {studied.length === 0 && total === 0
          ? "Empieza por la primera lección de teoría. El temario está pensado para leerse en orden: cada bloque se apoya en el anterior."
          : `Llevas ${studied.length} de ${LESSONS.length} lecciones y ${total} preguntas respondidas con un ${pct} % de acierto. El umbral razonable antes de examinarse está por encima del 85 % sostenido.`}
      </p>

      <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", marginBottom: 18 }}>
        <div className="lw-card">
          <div className="lw-out">{studied.length}/{LESSONS.length}<small>lecciones estudiadas</small></div>
        </div>
        <div className="lw-card">
          <div className="lw-out">{pct} %<small>acierto en {total} preguntas</small></div>
        </div>
        <div className="lw-card">
          <div className="lw-out" style={{ color: "var(--amber)" }}>
            {weak ? weak.n.split(" ")[0] : "—"}
            <small>{weak ? `punto débil: ${weak.n} (${Math.round((weak.s.right / weak.s.seen) * 100)} %)` : "responde unas cuantas preguntas para detectarlo"}</small>
          </div>
        </div>
      </div>

      {nextLesson && (
        <div className="lw-card" style={{ marginBottom: 18 }}>
          <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[nextLesson.dom] }}>
            Continúa por aquí · {DOM_NAME[nextLesson.dom]}
          </span>
          <h3 style={{ fontSize: 19, margin: "8px 0 14px" }}>{nextLesson.title}</h3>
          <button className="lw-btn primary" onClick={() => go("teoria")}>Ir a la lección</button>
        </div>
      )}

      <div className="lw-card" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Dominio por dominio</h3>
        {DOMAINS.map((d) => {
          const s = stats[d.id];
          const p = s.seen ? (s.right / s.seen) * 100 : 0;
          return (
            <div key={d.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <i className="lw-dot" style={{ background: d.c }} />{d.n}
                </span>
                <span className="mono" style={{ color: "var(--muted)", fontSize: 12.5 }}>
                  {s.seen ? `${s.right}/${s.seen}` : "sin datos"}
                </span>
              </div>
              <div className="lw-bar"><i style={{ width: `${p}%`, background: d.c }} /></div>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Preparación para el examen</h3>
      <div className="lw-card" style={{ marginBottom: 18 }}>
        <div className="lw-kv">
          <span>Tests completados</span>
          <b>{runs.length === 0 ? "ninguno todavía" : `${runs.length} · últimos: ${last3.map((r) => `${r.score} %`).join(", ")}`}</b>
        </div>
        <div className="lw-kv">
          <span>85 % sostenido en tres intentos</span>
          <b style={{ color: sustained ? "var(--green)" : "var(--amber)" }}>{sustained ? "conseguido" : "todavía no"}</b>
        </div>
        <div className="lw-kv">
          <span>Preguntas pendientes de acertar</span>
          <b style={{ color: nFails ? "var(--amber)" : "var(--green)" }}>{nFails}</b>
        </div>
        <div className="lw-kv">
          <span>Tarjetas asentadas</span>
          <b>{mastered} de {CARDS.length}{dueToday ? ` · ${dueToday} tocan hoy` : ""}</b>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="lw-btn" onClick={() => go("test")}>Ir al test</button>
          {dueToday > 0 && <button className="lw-btn ghost" onClick={() => go("tarjetas")}>Repasar tarjetas</button>}
        </div>
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Plan de cuatro semanas</h3>
      <div style={{ display: "grid", gap: 11, marginBottom: 22 }}>
        {PLAN.map((p) => (
          <div className="lw-card" key={p.s}>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 12, color: "var(--cyan)" }}>{p.s}</span>
              <h4 style={{ fontSize: 15.5, fontWeight: 600 }}>{p.t}</h4>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: "68ch" }}>{p.x}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Cómo es el examen</h3>
      <div className="lw-card" style={{ marginBottom: 16 }}>
        <div className="lw-kv"><span>Formato</span><b>100 preguntas de opción múltiple</b></div>
        <div className="lw-kv"><span>Banco de preguntas</span><b>más de 300, aleatorizadas</b></div>
        <div className="lw-kv"><span>Duración</span><b>90 min en una sola sesión</b></div>
        <div className="lw-kv"><span>Ritmo objetivo</span><b>~54 s por pregunta</b></div>
        <div className="lw-kv"><span>Perfil recomendado</span><b>2+ años con LoRaWAN</b></div>
        <div className="lw-kv"><span>Fuente definitiva</span><b>TS001, RP002 y la Resource Library</b></div>
      </div>

      <p className="lw-note" style={{ marginBottom: 14 }}>
        Material de apoyo elaborado a partir de documentación pública. No reproduce el banco oficial de preguntas.
        {persists
          ? " Tu progreso se guarda en este dispositivo y sobrevive a cerrar la app."
          : " Este navegador no permite guardar datos, así que el progreso se perderá al cerrar la pestaña."}
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <button className="lw-btn ghost" onClick={onExport}>Exportar mi progreso</button>
        <button className="lw-btn ghost" onClick={() => fileRef.current?.click()}>Importar progreso</button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden />
        {importMsg === "ok" && <span className="lw-note" style={{ color: "var(--green)" }}>Progreso importado.</span>}
        {importMsg === "error" && (
          <span className="lw-note" style={{ color: "var(--amber)" }}>
            El fichero no tiene el formato esperado; no se ha tocado tu progreso.
          </span>
        )}
      </div>

      {confirmReset ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="lw-note">Se borrará todo: lecciones, aciertos, tarjetas y fallos pendientes.</span>
          <button className="lw-btn" onClick={() => { onReset(); setConfirmReset(false); }}>Borrar</button>
          <button className="lw-btn ghost" onClick={() => setConfirmReset(false)}>Cancelar</button>
        </div>
      ) : (
        <button className="lw-btn ghost" onClick={() => setConfirmReset(true)}>Reiniciar mi progreso</button>
      )}
    </div>
  );
}

/* ============================================================
   TARJETAS
   ============================================================ */
function Flashcards({ cards, onGrade }) {
  const [dom, setDom] = useState("all");
  const [flip, setFlip] = useState(false);
  const [queue, setQueue] = useState([]);
  const [extra, setExtra] = useState(false); // repasar aunque no toque todavía

  const deck = useMemo(() => (dom === "all" ? CARDS : CARDS.filter((c) => c.dom === dom)), [dom]);
  const status = deckStatus(cards, deck);

  /* La cola de la sesión se arma al entrar y al cambiar de filtro. No depende
     de `cards`: si se rehiciera en cada respuesta, la tarjeta recién graduada
     desaparecería a media sesión. */
  useEffect(() => {
    setQueue((extra ? deck : deckStatus(cards, deck).due).map((c) => c.f));
    setFlip(false);
  }, [dom, extra]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = deck.find((c) => c.f === queue[0]);

  const grade = (ok) => {
    if (!card) return;
    onGrade(card.f, ok);
    setFlip(false);
    // Fallar la devuelve al final de la cola: se vuelve a ver hoy, no dentro de tres días.
    setTimeout(() => setQueue((q) => (ok ? q.slice(1) : [...q.slice(1), card.f])), 120);
  };

  return (
    <div>
      <h2 className="lw-h2">Tarjetas</h2>
      <p className="lw-lead">
        Repaso espaciado: cada tarjeta que aciertas tarda más en volver y las que fallas reaparecen enseguida.
        Toca la tarjeta para verla del otro lado.
      </p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        <button className="lw-chip" aria-pressed={dom === "all"} onClick={() => setDom("all")}>Todas</button>
        {DOMAINS.map((d) => (
          <button key={d.id} className="lw-chip" aria-pressed={dom === d.id} onClick={() => setDom(d.id)}>{d.n}</button>
        ))}
      </div>

      {card ? (
        <>
          <div className="lw-flip" style={{ marginBottom: 16 }}>
            <div className={`lw-flip-in${flip ? " on" : ""}`} onClick={() => setFlip((f) => !f)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlip((f) => !f); } }}>
              <div className="lw-face">
                <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[card.dom], marginBottom: 12 }}>
                  {DOM_NAME[card.dom]} · caja {cardState(cards, card.f).box} de 5
                </span>
                <h3 style={{ fontSize: 27, lineHeight: 1.2 }}>{card.f}</h3>
                <span className="lw-note" style={{ marginTop: 16 }}>Toca para ver la respuesta</span>
              </div>
              <div className="lw-face back">
                <p style={{ fontSize: 17, lineHeight: 1.5 }}>{card.b}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="lw-btn ghost" onClick={() => grade(false)}>No la sabía</button>
            <button className="lw-btn primary" onClick={() => grade(true)}>La sé</button>
            <span className="lw-note mono" style={{ marginLeft: "auto" }}>
              quedan {queue.length} · dominadas {status.mastered} de {deck.length}
            </span>
          </div>
          <div className="lw-bar" style={{ marginTop: 14 }}>
            <i style={{ width: `${(status.mastered / deck.length) * 100}%` }} />
          </div>
        </>
      ) : (
        <div className="lw-card">
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>Repaso al día</h3>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: "60ch", marginBottom: 16 }}>
            No queda ninguna tarjeta pendiente en esta selección
            {status.nextDue ? `. La siguiente vuelve ${humanDelay(status.nextDue - Date.now())}` : ""}.
            Has asentado {status.mastered} de {deck.length}.
          </p>
          <button className="lw-btn" onClick={() => setExtra((v) => !v)}>
            {extra ? "Volver al repaso programado" : "Repasar el mazo entero de todos modos"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TEST
   ============================================================ */
function Quiz({ record, failed, onAnswer, onRun }) {
  const [phase, setPhase] = useState("setup");
  const [doms, setDoms] = useState(DOMAINS.map((d) => d.id));
  const [len, setLen] = useState(15);
  const [mock, setMock] = useState(false);
  const [set, setSet] = useState([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [log, setLog] = useState([]);
  const [left, setLeft] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (phase !== "run" || !mock) return;
    if (left <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left, mock]);

  /* El intento se archiva una sola vez al terminar: el criterio de "85 %
     sostenido" necesita historial, no la nota del último test. */
  useEffect(() => {
    if (phase !== "done" || saved || !log.length) return;
    const hits = log.filter((l) => l.idx === l.q.a).length;
    setSaved(true);
    onRun({ score: Math.round((hits / log.length) * 100), n: log.length, mock });
  }, [phase, saved, log, mock, onRun]);

  const toggle = (id) =>
    setDoms((d) => (d.includes(id) ? (d.length > 1 ? d.filter((x) => x !== id) : d) : [...d, id]));

  /* Selección de preguntas.
     - "mock": el banco entero, contrarreloj.
     - "fails": solo las que quedaron pendientes de acertar.
     - "custom": la selección del alumno, dando prioridad a sus fallos y
       rellenando con el resto. Reordenado al final para que los fallos no
       salgan todos seguidos al principio. */
  const buildSet = (mode) => {
    if (mode === "mock") return shuffle(QUESTIONS, randSeed());
    if (mode === "fails") return shuffle(QUESTIONS.filter((q) => failed[q.id]), randSeed());
    const sel = QUESTIONS.filter((q) => doms.includes(q.dom));
    const bad = shuffle(sel.filter((q) => failed[q.id]), randSeed());
    const rest = shuffle(sel.filter((q) => !failed[q.id]), randSeed());
    return shuffle([...bad, ...rest].slice(0, Math.min(len, sel.length)), randSeed());
  };

  const start = (mode) => {
    const chosen = buildSet(mode);
    const isMock = mode === "mock";
    // Las opciones se barajan en cada intento: la posición de la correcta
    // no debe ser una pista aprendible.
    setSet(chosen.map((q) => shuffleOptions(q, randSeed())));
    setMock(isMock);
    setLeft(isMock ? Math.round((90 * 60 * chosen.length) / 100) : 0);
    setI(0); setPick(null); setLog([]); setSaved(false); setPhase("run");
  };

  const answer = (idx) => {
    if (pick !== null) return;
    const q = set[i];
    const ok = idx === q.a;
    setPick(idx);
    record(q.dom, ok);
    onAnswer(q.id, ok);
    setLog((l) => [...l, { q, idx }]);
  };
  const advance = () => {
    setPick(null);
    if (i + 1 >= set.length) setPhase("done"); else setI(i + 1);
  };

  if (phase === "setup") {
    const avail = QUESTIONS.filter((q) => doms.includes(q.dom)).length;
    const nFails = QUESTIONS.filter((q) => failed[q.id]).length;
    const failsHere = QUESTIONS.filter((q) => failed[q.id] && doms.includes(q.dom)).length;
    return (
      <div>
        <h2 className="lw-h2">Test</h2>
        <p className="lw-lead">
          Elige dominios y longitud, o lanza un simulacro con todo el banco y reloj proporcional al examen real.
          Las opciones se barajan en cada intento.
        </p>
        <div className="lw-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Dominios</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {DOMAINS.map((d) => (
              <button key={d.id} className="lw-chip" aria-pressed={doms.includes(d.id)} onClick={() => toggle(d.id)}>{d.n}</button>
            ))}
          </div>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Número de preguntas</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {[10, 15, 25, 40].map((n) => (
              <button key={n} className="lw-chip" aria-pressed={len === n} onClick={() => setLen(n)}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="lw-btn primary" onClick={() => start("custom")}>Empezar test</button>
            <span className="lw-note">
              {Math.min(len, avail)} preguntas de {avail} disponibles en tu selección
              {failsHere > 0 ? ` · entran primero tus ${failsHere} pendientes` : ""}
            </span>
          </div>
        </div>

        <div className="lw-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>Repaso de fallos</h3>
          <p className="lw-note" style={{ marginBottom: 14, maxWidth: "62ch" }}>
            {nFails > 0
              ? `Tienes ${nFails} preguntas pendientes de acertar. Una pregunta sale de la lista cuando la aciertas más tarde, no cuando la lees.`
              : "Aquí se acumularán las preguntas que falles. Salen de la lista cuando las aciertas en un intento posterior."}
          </p>
          <button className="lw-btn" disabled={nFails === 0} onClick={() => start("fails")}>
            Repasar mis {nFails} fallos
          </button>
        </div>
        <div className="lw-card">
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>Simulacro cronometrado</h3>
          <p className="lw-note" style={{ marginBottom: 14, maxWidth: "62ch" }}>
            Las {QUESTIONS.length} preguntas del banco al ritmo del examen oficial: 54 segundos por pregunta,
            sin explicaciones hasta el final.
          </p>
          <button className="lw-btn" onClick={() => start("mock")}>Lanzar simulacro</button>
        </div>
      </div>
    );
  }

  if (phase === "run") {
    const q = set[i];
    const done = pick !== null;
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 14 }}>
          <span className="mono" style={{ fontSize: 12.5, color: DOM_COLOR[q.dom] }}>{DOM_NAME[q.dom]}</span>
          <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)" }}>
            {i + 1} / {set.length}{mock ? ` · ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : ""}
          </span>
        </div>
        <div className="lw-bar" style={{ marginBottom: 22 }}><i style={{ width: `${((i + 1) / set.length) * 100}%` }} /></div>
        <h3 style={{ fontSize: 20, lineHeight: 1.35, marginBottom: 20, maxWidth: "62ch" }}>{q.q}</h3>
        {q.opts.map((o, k) => {
          let cls = "lw-opt";
          if (done && !mock) { if (k === q.a) cls += " good"; else if (k === pick) cls += " bad"; }
          else if (done && mock && k === pick) cls += " good";
          return (
            <button key={k} className={cls} disabled={done} onClick={() => answer(k)}>
              <span className="k">{"ABCD"[k]}</span><span>{o}</span>
            </button>
          );
        })}
        {done && !mock && (
          <div className="lw-exp" style={{ marginTop: 14 }}>
            <b style={{ color: pick === q.a ? "var(--green)" : "var(--red)" }}>
              {pick === q.a ? "Correcto. " : "Incorrecto. "}
            </b>
            {q.exp}
          </div>
        )}
        {done && (
          <div style={{ marginTop: 18 }}>
            <button className="lw-btn primary" onClick={advance}>
              {i + 1 >= set.length ? "Ver resultado" : "Siguiente"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const hits = log.filter((l) => l.idx === l.q.a).length;
  const score = log.length ? Math.round((hits / log.length) * 100) : 0;
  const fails = log.filter((l) => l.idx !== l.q.a);
  return (
    <div>
      <h2 className="lw-h2">Resultado</h2>
      <div className="lw-card" style={{ marginBottom: 18 }}>
        <div className="lw-out" style={{ fontSize: 44, color: score >= 85 ? "var(--green)" : score >= 70 ? "var(--amber)" : "var(--red)" }}>
          {score} %<small>{hits} aciertos de {log.length} respondidas</small>
        </div>
        <p style={{ marginTop: 16, fontSize: 14, maxWidth: "62ch", color: "var(--muted)" }}>
          {score >= 85
            ? "Nivel sólido. Mantén este rango en varios simulacros seguidos y trabaja solo los fallos residuales."
            : score >= 70
            ? "Vas por buen camino. Los fallos suelen concentrarse en valores numéricos y en el detalle de los comandos MAC."
            : "Vuelve a la teoría del dominio donde más has fallado antes de repetir el test."}
        </p>
      </div>
      {fails.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Repaso de fallos</h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {fails.map((f, k) => (
              <div className="lw-card" key={k}>
                <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[f.q.dom] }}>{DOM_NAME[f.q.dom]}</span>
                <p style={{ fontSize: 15, margin: "8px 0 12px", fontWeight: 500 }}>{f.q.q}</p>
                <div className="lw-kv"><span style={{ color: "var(--red)" }}>Tu respuesta</span><b>{f.q.opts[f.idx]}</b></div>
                <div className="lw-kv"><span style={{ color: "var(--green)" }}>Correcta</span><b>{f.q.opts[f.q.a]}</b></div>
                <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 12 }}>{f.q.exp}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <button className="lw-btn primary" onClick={() => setPhase("setup")}>Otro test</button>
    </div>
  );
}

/* ============================================================
   CALCULADORAS
   ============================================================ */
function Tools() {
  const [sf, setSf] = useState(7);
  const [bw, setBw] = useState(125000);
  const [cr, setCr] = useState(1);
  const [app, setApp] = useState(12);
  const [dc, setDc] = useState(1);
  const [ptx, setPtx] = useState(14);
  const [gtx, setGtx] = useState(2);
  const [grx, setGrx] = useState(6);
  const [loss, setLoss] = useState(2);
  const [nExp, setNExp] = useState(2.7);

  const phyLen = app + 13;
  const r = timeOnAir({ sf, bw, cr, payload: phyLen });
  const perHour = (3600 * (dc / 100)) / (r.toa / 1000);
  const wait = (r.toa / 1000) * (100 / dc - 1);
  const sens = SENS[sf] + (bw === 250000 ? 3 : bw === 500000 ? 6 : 0);
  const maxPL = ptx + gtx + grx - loss - sens;
  const dKm = Math.pow(10, (maxPL - 91.2) / (10 * nExp));

  const chirps = [];
  for (let c = 0; c < 7; c++) {
    const w = (300 / Math.pow(2, sf - 7)) * 1.4 + 12;
    const x = c * (w + 4);
    if (x > 640) break;
    chirps.push(<polyline key={c} points={`${x},64 ${x + w},8`} stroke="var(--cyan)" strokeWidth="2" fill="none" strokeLinecap="round" />);
  }

  return (
    <div>
      <h2 className="lw-h2">Calculadoras</h2>
      <p className="lw-lead">
        Los cálculos que el examen espera que sepas razonar. Están explicados en las lecciones de capa física y
        de despliegue.
      </p>

      <div className="lw-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Tiempo en aire</h3>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginBottom: 20 }}>
          <Field label="Spreading factor">
            <select value={sf} onChange={(e) => setSf(+e.target.value)}>
              {[7, 8, 9, 10, 11, 12].map((v) => <option key={v} value={v}>SF{v}</option>)}
            </select>
          </Field>
          <Field label="Ancho de banda">
            <select value={bw} onChange={(e) => setBw(+e.target.value)}>
              <option value={125000}>125 kHz</option><option value={250000}>250 kHz</option><option value={500000}>500 kHz</option>
            </select>
          </Field>
          <Field label="Coding rate">
            <select value={cr} onChange={(e) => setCr(+e.target.value)}>
              {[1, 2, 3, 4].map((v) => <option key={v} value={v}>4/{4 + v}</option>)}
            </select>
          </Field>
          <Field label="Carga de aplicación (B)">
            <input type="number" min="0" max="242" value={app} onChange={(e) => setApp(Math.max(0, Math.min(242, +e.target.value || 0)))} />
          </Field>
          <Field label="Ciclo de trabajo (%)">
            <select value={dc} onChange={(e) => setDc(+e.target.value)}>
              <option value={1}>1 % (EU868 por defecto)</option><option value={10}>10 % (869,4–869,65)</option><option value={0.1}>0,1 %</option>
            </select>
          </Field>
        </div>
        <svg viewBox="0 0 640 72" style={{ width: "100%", height: 62, marginBottom: 18 }} aria-hidden="true">
          <line x1="0" y1="70" x2="640" y2="70" stroke="var(--line)" strokeWidth="1" />
          {chirps}
        </svg>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
          <div><div className="lw-out">{fmt(r.toa)} ms<small>tiempo en aire</small></div></div>
          <div><div className="lw-out">{fmt(r.tSym, 2)} ms<small>duración de símbolo</small></div></div>
          <div><div className="lw-out">{perHour < 1 ? fmt(perHour, 2) : Math.floor(perHour)}<small>tramas por hora al {String(dc).replace(".", ",")} %</small></div></div>
          <div><div className="lw-out">{fmt(wait, 1)} s<small>espera mínima entre envíos</small></div></div>
        </div>
        <p className="lw-note" style={{ marginTop: 14 }}>
          PHYPayload = {phyLen} B ({app} de aplicación + 13 de cabeceras y MIC) · {r.symbols} símbolos de payload
          {r.de ? " · LDRO activo" : ""}
        </p>
      </div>

      <div className="lw-card">
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Presupuesto de enlace</h3>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginBottom: 20 }}>
          <Field label="Potencia TX (dBm)"><input type="number" value={ptx} onChange={(e) => setPtx(+e.target.value || 0)} /></Field>
          <Field label="Ganancia antena TX (dBi)"><input type="number" value={gtx} onChange={(e) => setGtx(+e.target.value || 0)} /></Field>
          <Field label="Ganancia antena RX (dBi)"><input type="number" value={grx} onChange={(e) => setGrx(+e.target.value || 0)} /></Field>
          <Field label="Pérdidas de cable (dB)"><input type="number" value={loss} onChange={(e) => setLoss(+e.target.value || 0)} /></Field>
          <Field label="Entorno">
            <select value={nExp} onChange={(e) => setNExp(+e.target.value)}>
              <option value={2.2}>Rural con línea de vista</option>
              <option value={2.7}>Suburbano</option>
              <option value={3.2}>Urbano</option>
              <option value={3.8}>Urbano denso o interior</option>
            </select>
          </Field>
        </div>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
          <div><div className="lw-out">{fmt(sens, 1)} dBm<small>sensibilidad estimada en SF{sf}</small></div></div>
          <div><div className="lw-out">{fmt(maxPL, 1)} dB<small>pérdida de propagación admisible</small></div></div>
          <div><div className="lw-out">{dKm < 1 ? `${fmt(dKm * 1000, 0)} m` : `${fmt(dKm, 1)} km`}<small>alcance orientativo a 868 MHz</small></div></div>
        </div>
        <p className="lw-note" style={{ marginTop: 14 }}>
          Modelo log-distancia sin margen de desvanecimiento. Para diseño real, resta entre 10 y 20 dB y valida
          con medidas de campo.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   REFERENCIA
   ============================================================ */
function Reference() {
  const blocks = [
    { t: "Data rates en EU868", h: ["DR", "SF", "BW", "Tasa", "Payload máx."], r: T_DR_EU, m: [0, 1, 2, 3, 4] },
    { t: "Tipos de mensaje (MType)", h: ["Valor", "Mensaje", "Sentido"], r: T_MTYPE, m: [0] },
    { t: "Comandos MAC", h: ["CID", "Comando", "Lo inicia", "Función"], r: T_CID, m: [0] },
    { t: "Claves", h: ["Clave", "Versión", "Tipo", "Uso"], r: T_KEYS, m: [] },
    { t: "Temporización y constantes", h: ["Parámetro", "Valor", "Significado"], r: T_TIMES, m: [1] },
    { t: "Documentos de la LoRa Alliance", h: ["Ref.", "Documento", "Contenido"], r: T_DOCS, m: [0] },
  ];
  return (
    <div>
      <h2 className="lw-h2">Referencia rápida</h2>
      <p className="lw-lead">
        Las tablas que conviene tener memorizadas. Son la respuesta a la mayoría de preguntas numéricas.
      </p>
      <div style={{ display: "grid", gap: 16 }}>
        {blocks.map((b) => (
          <div className="lw-card" key={b.t}>
            <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>{b.t}</h3>
            <Table head={b.h} rows={b.r} mono={b.m} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
const TABS = [
  { id: "panel", n: "Panel" },
  { id: "teoria", n: "Teoría" },
  { id: "tarjetas", n: "Tarjetas" },
  { id: "test", n: "Test" },
  { id: "calculadoras", n: "Calculadoras" },
  { id: "referencia", n: "Referencia" },
];

const DOM_IDS = DOMAINS.map((d) => d.id);

export default function App() {
  const [tab, setTab] = useState("panel");
  /* El progreso se lee del almacenamiento del dispositivo en el primer render
     y se reescribe en cada cambio. Si el navegador no deja guardar (modo
     privado, cuota agotada), `persists` queda a false y se avisa en el panel
     en lugar de fingir que el progreso se conserva. */
  const [state, setState] = useState(() => loadState(DOM_IDS));
  const [persists, setPersists] = useState(true);

  useEffect(() => { setPersists(saveState(state)); }, [state]);

  const { stats, studied, cards, failed, runs } = state;

  const record = useCallback((dom, ok) => setState((s) => ({
    ...s,
    stats: { ...s.stats, [dom]: { seen: s.stats[dom].seen + 1, right: s.stats[dom].right + (ok ? 1 : 0) } },
  })), []);

  const markStudied = useCallback((id) => setState((s) => (
    s.studied.includes(id) ? s : { ...s, studied: [...s.studied, id] }
  )), []);

  const gradeCard = useCallback((front, ok) => setState((s) => ({
    ...s, cards: scheduleCard(s.cards, front, ok),
  })), []);

  const noteAnswer = useCallback((id, ok) => setState((s) => ({
    ...s, failed: recordAnswer(s.failed, id, ok),
  })), []);

  // Solo se conservan los treinta últimos intentos: basta para ver la tendencia.
  const noteRun = useCallback((run) => setState((s) => ({
    ...s, runs: [...s.runs, { ...run, at: Date.now() }].slice(-30),
  })), []);

  const reset = useCallback(() => {
    clearState();
    setState(emptyState(DOM_IDS));
  }, []);

  const doExport = useCallback(() => {
    const blob = new Blob([exportState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progreso-ap-trainer-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  /* El mismo saneado campo a campo que loadState(): un fichero importado es
     entrada tan poco fiable como lo que ya hubiera en localStorage. */
  const doImport = useCallback((text) => {
    const next = importState(DOM_IDS, text);
    if (!next) return false;
    setState(next);
    return true;
  }, []);

  return (
    <div className="lw">
      <style>{CSS}</style>

      <header className="lw-hero">
        <Waterfall />
        <div className="lw-hero-inner">
          <h1 className="lw-title">LPWAN<br />AP Trainer</h1>
          <p className="lw-sub">
            Curso completo y entrenamiento para el examen de certificación LoRaWAN Accredited Professional: teoría
            explicada, tarjetas, tests por dominio, simulacro cronometrado y calculadoras de radio.
          </p>
          <div className="lw-facts">
            <span className="lw-fact"><b>{LESSONS.length}</b> lecciones</span>
            <span className="lw-fact"><b>{QUESTIONS.length + LESSONS.reduce((s, l) => s + l.checks.length, 0)}</b> preguntas</span>
            <span className="lw-fact"><b>{CARDS.length}</b> tarjetas</span>
            <span className="lw-fact">examen: <b>100</b> preguntas en <b>90</b> min</span>
          </div>
        </div>
      </header>

      <nav className="lw-nav">
        <div className="lw-nav-in" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} className="lw-tab" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
              {t.n}
            </button>
          ))}
        </div>
      </nav>

      <main className="lw-wrap" style={{ paddingTop: 28 }}>
        {tab === "panel" && (
          <Dashboard stats={stats} studied={studied} cards={cards} failed={failed}
            runs={runs} persists={persists} onReset={reset} onExport={doExport} onImport={doImport} go={setTab} />
        )}
        {tab === "teoria" && <Theory studied={studied} markStudied={markStudied} record={record} />}
        {tab === "tarjetas" && <Flashcards cards={cards} onGrade={gradeCard} />}
        {tab === "test" && <Quiz record={record} failed={failed} onAnswer={noteAnswer} onRun={noteRun} />}
        {tab === "calculadoras" && <Tools />}
        {tab === "referencia" && <Reference />}
      </main>

      <footer className="lw-footer">
        Proyecto independiente, no afiliado ni respaldado por la LoRa Alliance. LoRaWAN® es una
        marca registrada de la LoRa Alliance, Inc.
      </footer>
    </div>
  );
}
