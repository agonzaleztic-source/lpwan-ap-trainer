import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { CSS } from "./styles.js";
import { DOMAINS, DOM_COLOR } from "./data/domains.js";
import { QUESTIONS } from "./data/questions.js";
import { CARDS } from "./data/cards.js";
import { LESSONS } from "./data/lessons.js";
import { timeOnAir, SENS, fmt, shuffle, shuffleOptions, randSeed } from "./lib/radio.js";
import {
  emptyState, loadState, saveState, clearState, exportState, importState,
  scheduleCard, deckStatus, cardState, humanDelay, recordAnswer, BOXES,
} from "./lib/store.js";
import { LangProvider, useLang } from "./i18n/lang.jsx";
import { LANGS } from "./i18n/strings.js";
import { localizeQuestion, localizeCheck, localizeCard, lessonTitle, tables } from "./i18n/content.js";

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
  const { t } = useLang();
  switch (b.t) {
    case "h": return <h4>{b.x}</h4>;
    case "key": return <div className="lw-box key"><b>{t.block.key}</b>{b.x}</div>;
    case "warn": return <div className="lw-box warn"><b>{t.block.warn}</b>{b.x}</div>;
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
   orden cambia, así que no se puede memorizar la posición de la correcta.
   `c` llega ya en el idioma de la interfaz. */
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
      {pick !== null && (
        <div style={{ marginTop: 10 }}>
          <div className="lw-exp">{q.exp}</div>
          {q.ref && <div className="lw-ref">{q.ref}</div>}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TEORÍA
   ============================================================ */
function Theory({ studied, markStudied, record }) {
  const { lang, t } = useLang();
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
          {t.theory.back}
        </button>
        <span className="mono" style={{ fontSize: 12, color: DOM_COLOR[lesson.dom] }}>
          {t.dom[lesson.dom]} · {t.theory.mins(lesson.mins)}
        </span>
        <h2 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 26px", maxWidth: "22ch" }}>{lessonTitle(lesson, lang)}</h2>

        {t.theory.spanishOnly && (
          <p className="lw-note" style={{ marginBottom: 22, maxWidth: "70ch" }}>{t.theory.spanishOnly}</p>
        )}

        {/* El cuerpo de las lecciones existe solo en español por ahora. */}
        <div className="lw-read" lang="es">
          {lesson.body.map((b, k) => <Block key={k} b={b} />)}
        </div>

        <div className="lw-check">
          <h3 style={{ fontSize: 17, marginBottom: 18 }}>{t.theory.check}</h3>
          {lesson.checks.map((c, k) => (
            <Check key={`${lesson.id}-${k}-${lang}`} c={localizeCheck(lesson.id, k, c, lang)} i={k}
              onAnswer={(ok) => record(lesson.dom, ok)} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {!done && (
            <button className="lw-btn primary" onClick={() => markStudied(lesson.id)}>
              {t.theory.markStudied}
            </button>
          )}
          {next && (
            <button className="lw-btn" onClick={() => { markStudied(lesson.id); setOpenId(next.id); }}>
              {t.theory.next(lessonTitle(next, lang))}
            </button>
          )}
        </div>
      </div>
    );
  }

  const totalMins = LESSONS.reduce((s, l) => s + l.mins, 0);
  return (
    <div>
      <h2 className="lw-h2">{t.theory.h2}</h2>
      <p className="lw-lead">{t.theory.lead(Math.round(totalMins / 60))}</p>
      {t.theory.spanishOnly && <p className="lw-note" style={{ marginBottom: 18, maxWidth: "70ch" }}>{t.theory.spanishOnly}</p>}
      <div className="lw-bar" style={{ marginBottom: 8 }}>
        <i style={{ width: `${(studied.length / LESSONS.length) * 100}%` }} />
      </div>
      <p className="lw-note" style={{ marginBottom: 26 }}>
        {t.theory.progress(studied.length, LESSONS.length)}
      </p>

      {DOMAINS.map((d) => {
        const ls = LESSONS.filter((l) => l.dom === d.id);
        if (!ls.length) return null;
        return (
          <div key={d.id} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 9 }}>
              <i className="lw-dot" style={{ background: d.c }} />{t.dom[d.id]}
            </h3>
            {ls.map((l) => (
              <button key={l.id} className={`lw-lesson-row${studied.includes(l.id) ? " done" : ""}`}
                onClick={() => setOpenId(l.id)}>
                <span className="lw-lesson-t">{lessonTitle(l, lang)}</span>
                <span className="lw-lesson-m">{t.theory.mins(l.mins)}</span>
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
function Dashboard({ stats, studied, cards, failed, runs, persists, onReset, onExport, onImport, go }) {
  const { lang, t } = useLang();
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
  const weak = DOMAINS.map((d) => ({ ...d, n: t.dom[d.id], s: stats[d.id] }))
    .filter((d) => d.s.seen >= 3)
    .sort((a, b) => a.s.right / a.s.seen - b.s.right / b.s.seen)[0];
  const nextLesson = LESSONS.find((l) => !studied.includes(l.id));

  return (
    <div>
      <h2 className="lw-h2">{t.dash.h2}</h2>
      <p className="lw-lead">
        {studied.length === 0 && total === 0
          ? t.dash.leadEmpty
          : t.dash.lead(studied.length, LESSONS.length, total, pct)}
      </p>

      <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", marginBottom: 18 }}>
        <div className="lw-card">
          <div className="lw-out">{studied.length}/{LESSONS.length}<small>{t.dash.lessonsStudied}</small></div>
        </div>
        <div className="lw-card">
          <div className="lw-out">{t.pct(pct)}<small>{t.dash.accuracyIn(total)}</small></div>
        </div>
        <div className="lw-card">
          <div className="lw-out" style={{ color: "var(--amber)" }}>
            {weak ? weak.n.split(" ")[0] : "—"}
            <small>{weak ? t.dash.weak(weak.n, Math.round((weak.s.right / weak.s.seen) * 100)) : t.dash.weakNone}</small>
          </div>
        </div>
      </div>

      {nextLesson && (
        <div className="lw-card" style={{ marginBottom: 18 }}>
          <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[nextLesson.dom] }}>
            {t.dash.continueHere} · {t.dom[nextLesson.dom]}
          </span>
          <h3 style={{ fontSize: 19, margin: "8px 0 14px" }}>{lessonTitle(nextLesson, lang)}</h3>
          <button className="lw-btn primary" onClick={() => go("teoria")}>{t.dash.goLesson}</button>
        </div>
      )}

      <div className="lw-card" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>{t.dash.byDomain}</h3>
        {DOMAINS.map((d) => {
          const s = stats[d.id];
          const p = s.seen ? (s.right / s.seen) * 100 : 0;
          return (
            <div key={d.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <i className="lw-dot" style={{ background: d.c }} />{t.dom[d.id]}
                </span>
                <span className="mono" style={{ color: "var(--muted)", fontSize: 12.5 }}>
                  {s.seen ? `${s.right}/${s.seen}` : t.dash.noData}
                </span>
              </div>
              <div className="lw-bar"><i style={{ width: `${p}%`, background: d.c }} /></div>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.dash.examReadiness}</h3>
      <div className="lw-card" style={{ marginBottom: 18 }}>
        <div className="lw-kv">
          <span>{t.dash.testsDone}</span>
          <b>{runs.length === 0 ? t.dash.noneYet : t.dash.testsSummary(runs.length, last3.map((r) => t.pct(r.score)))}</b>
        </div>
        <div className="lw-kv">
          <span>{t.dash.sustained}</span>
          <b style={{ color: sustained ? "var(--green)" : "var(--amber)" }}>{sustained ? t.dash.achieved : t.dash.notYet}</b>
        </div>
        <div className="lw-kv">
          <span>{t.dash.pendingFails}</span>
          <b style={{ color: nFails ? "var(--amber)" : "var(--green)" }}>{nFails}</b>
        </div>
        <div className="lw-kv">
          <span>{t.dash.cardsMastered}</span>
          <b>{t.dash.cardsSummary(mastered, CARDS.length, dueToday)}</b>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="lw-btn" onClick={() => go("test")}>{t.dash.goTest}</button>
          {dueToday > 0 && <button className="lw-btn ghost" onClick={() => go("tarjetas")}>{t.dash.reviewCards}</button>}
        </div>
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.dash.planTitle}</h3>
      <div style={{ display: "grid", gap: 11, marginBottom: 22 }}>
        {t.plan.map((p) => (
          <div className="lw-card" key={p.s}>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 12, color: "var(--cyan)" }}>{p.s}</span>
              <h4 style={{ fontSize: 15.5, fontWeight: 600 }}>{p.t}</h4>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: "68ch" }}>{p.x}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.dash.examTitle}</h3>
      <div className="lw-card" style={{ marginBottom: 16 }}>
        {t.dash.exam.map(([k, v]) => (
          <div className="lw-kv" key={k}><span>{k}</span><b>{v}</b></div>
        ))}
      </div>

      <p className="lw-note" style={{ marginBottom: 14 }}>
        {t.dash.disclaimer}
        {persists ? t.dash.persists : t.dash.noPersist}
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <button className="lw-btn ghost" onClick={onExport}>{t.dash.export}</button>
        <button className="lw-btn ghost" onClick={() => fileRef.current?.click()}>{t.dash.import}</button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden />
        {importMsg === "ok" && <span className="lw-note" style={{ color: "var(--green)" }}>{t.dash.imported}</span>}
        {importMsg === "error" && (
          <span className="lw-note" style={{ color: "var(--amber)" }}>{t.dash.importError}</span>
        )}
      </div>

      {confirmReset ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="lw-note">{t.dash.resetWarn}</span>
          <button className="lw-btn" onClick={() => { onReset(); setConfirmReset(false); }}>{t.dash.delete}</button>
          <button className="lw-btn ghost" onClick={() => setConfirmReset(false)}>{t.dash.cancel}</button>
        </div>
      ) : (
        <button className="lw-btn ghost" onClick={() => setConfirmReset(true)}>{t.dash.reset}</button>
      )}
    </div>
  );
}

/* ============================================================
   TARJETAS
   ============================================================ */
function Flashcards({ cards, onGrade }) {
  const { lang, t } = useLang();
  const [dom, setDom] = useState("all");
  const [flip, setFlip] = useState(false);
  const [queue, setQueue] = useState([]);
  const [extra, setExtra] = useState(false); // repasar aunque no toque todavía

  /* El mazo y la cola trabajan siempre con las tarjetas en español, cuyo
     anverso es la clave del progreso guardado. La traducción se aplica solo
     al pintar la tarjeta en pantalla. */
  const deck = useMemo(() => (dom === "all" ? CARDS : CARDS.filter((c) => c.dom === dom)), [dom]);
  const status = deckStatus(cards, deck);

  /* La cola de la sesión se arma al entrar y al cambiar de filtro. No depende
     de `cards`: si se rehiciera en cada respuesta, la tarjeta recién graduada
     desaparecería a media sesión. */
  useEffect(() => {
    setQueue((extra ? deck : deckStatus(cards, deck).due).map((c) => c.f));
    setFlip(false);
  }, [dom, extra]); // eslint-disable-line react-hooks/exhaustive-deps

  const raw = deck.find((c) => c.f === queue[0]);
  const card = raw ? localizeCard(raw, lang) : null;

  const grade = (ok) => {
    if (!card) return;
    onGrade(card.key, ok);
    setFlip(false);
    // Fallar la devuelve al final de la cola: se vuelve a ver hoy, no dentro de tres días.
    setTimeout(() => setQueue((q) => (ok ? q.slice(1) : [...q.slice(1), card.key])), 120);
  };

  return (
    <div>
      <h2 className="lw-h2">{t.cards.h2}</h2>
      <p className="lw-lead">{t.cards.lead}</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        <button className="lw-chip" aria-pressed={dom === "all"} onClick={() => setDom("all")}>{t.cards.all}</button>
        {DOMAINS.map((d) => (
          <button key={d.id} className="lw-chip" aria-pressed={dom === d.id} onClick={() => setDom(d.id)}>{t.dom[d.id]}</button>
        ))}
      </div>

      {card ? (
        <>
          <div className="lw-flip" style={{ marginBottom: 16 }}>
            <div className={`lw-flip-in${flip ? " on" : ""}`} onClick={() => setFlip((f) => !f)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlip((f) => !f); } }}>
              <div className="lw-face">
                <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[card.dom], marginBottom: 12 }}>
                  {t.dom[card.dom]} · {t.cards.box(cardState(cards, card.key).box, BOXES)}
                </span>
                <h3 style={{ fontSize: 27, lineHeight: 1.2 }}>{card.f}</h3>
                <span className="lw-note" style={{ marginTop: 16 }}>{t.cards.tapToFlip}</span>
              </div>
              <div className="lw-face back">
                <p style={{ fontSize: 17, lineHeight: 1.5 }}>{card.b}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="lw-btn ghost" onClick={() => grade(false)}>{t.cards.unknown}</button>
            <button className="lw-btn primary" onClick={() => grade(true)}>{t.cards.known}</button>
            <span className="lw-note mono" style={{ marginLeft: "auto" }}>
              {t.cards.status(queue.length, status.mastered, deck.length)}
            </span>
          </div>
          <div className="lw-bar" style={{ marginTop: 14 }}>
            <i style={{ width: `${(status.mastered / deck.length) * 100}%` }} />
          </div>
        </>
      ) : (
        <div className="lw-card">
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>{t.cards.upToDate}</h3>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: "60ch", marginBottom: 16 }}>
            {t.cards.nonePending}
            {status.nextDue ? t.cards.nextBack(humanDelay(status.nextDue - Date.now(), lang)) : ""}.
            {t.cards.mastered(status.mastered, deck.length)}
          </p>
          <button className="lw-btn" onClick={() => setExtra((v) => !v)}>
            {extra ? t.cards.backToScheduled : t.cards.reviewAll}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TEST
   ============================================================ */
const MOCK_LEN = 100; // el examen real: 100 preguntas en 90 minutos

function Quiz({ record, failed, onAnswer, onRun }) {
  const { lang, t } = useLang();
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
     - "mock": simulacro del examen real (100 preguntas, 90 min), tomadas al
       azar del banco entero. Si el banco tiene menos de 100, se usa entero.
     - "fails": solo las que quedaron pendientes de acertar.
     - "custom": la selección del alumno, dando prioridad a sus fallos y
       rellenando con el resto. Reordenado al final para que los fallos no
       salgan todos seguidos al principio. */
  const buildSet = (mode) => {
    if (mode === "mock") return shuffle(QUESTIONS, randSeed()).slice(0, MOCK_LEN);
    if (mode === "fails") return shuffle(QUESTIONS.filter((q) => failed[q.id]), randSeed());
    const sel = QUESTIONS.filter((q) => doms.includes(q.dom));
    const bad = shuffle(sel.filter((q) => failed[q.id]), randSeed());
    const rest = shuffle(sel.filter((q) => !failed[q.id]), randSeed());
    return shuffle([...bad, ...rest].slice(0, Math.min(len, sel.length)), randSeed());
  };

  const start = (mode) => {
    const chosen = buildSet(mode);
    const isMock = mode === "mock";
    // Primero se traduce (las opciones mantienen el orden, así que `a` sigue
    // valiendo) y después se barajan las opciones en cada intento: la
    // posición de la correcta no debe ser una pista aprendible.
    setSet(chosen.map((q) => shuffleOptions(localizeQuestion(q, lang), randSeed())));
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
        <h2 className="lw-h2">{t.quiz.h2}</h2>
        <p className="lw-lead">{t.quiz.lead}</p>
        <div className="lw-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>{t.quiz.domains}</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {DOMAINS.map((d) => (
              <button key={d.id} className="lw-chip" aria-pressed={doms.includes(d.id)} onClick={() => toggle(d.id)}>{t.dom[d.id]}</button>
            ))}
          </div>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>{t.quiz.count}</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {[10, 15, 25, 40].map((n) => (
              <button key={n} className="lw-chip" aria-pressed={len === n} onClick={() => setLen(n)}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="lw-btn primary" onClick={() => start("custom")}>{t.quiz.start}</button>
            <span className="lw-note">
              {t.quiz.available(Math.min(len, avail), avail)}
              {failsHere > 0 ? t.quiz.failsFirst(failsHere) : ""}
            </span>
          </div>
        </div>

        <div className="lw-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>{t.quiz.failsTitle}</h3>
          <p className="lw-note" style={{ marginBottom: 14, maxWidth: "62ch" }}>
            {nFails > 0 ? t.quiz.failsPending(nFails) : t.quiz.failsEmpty}
          </p>
          <button className="lw-btn" disabled={nFails === 0} onClick={() => start("fails")}>
            {t.quiz.reviewFails(nFails)}
          </button>
        </div>
        <div className="lw-card">
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>{t.quiz.mockTitle}</h3>
          <p className="lw-note" style={{ marginBottom: 14, maxWidth: "62ch" }}>
            {t.quiz.mockText(Math.min(MOCK_LEN, QUESTIONS.length), QUESTIONS.length)}
          </p>
          <button className="lw-btn" onClick={() => start("mock")}>{t.quiz.mockStart}</button>
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
          <span className="mono" style={{ fontSize: 12.5, color: DOM_COLOR[q.dom] }}>{t.dom[q.dom]}</span>
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
          <div style={{ marginTop: 14 }}>
            <div className="lw-exp">
              <b style={{ color: pick === q.a ? "var(--green)" : "var(--red)" }}>
                {pick === q.a ? t.quiz.correct : t.quiz.incorrect}
              </b>
              {q.exp}
            </div>
            {q.ref && <div className="lw-ref">{q.ref}</div>}
          </div>
        )}
        {done && (
          <div style={{ marginTop: 18 }}>
            <button className="lw-btn primary" onClick={advance}>
              {i + 1 >= set.length ? t.quiz.seeResult : t.quiz.next}
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
      <h2 className="lw-h2">{t.quiz.result}</h2>
      <div className="lw-card" style={{ marginBottom: 18 }}>
        <div className="lw-out" style={{ fontSize: 44, color: score >= 85 ? "var(--green)" : score >= 70 ? "var(--amber)" : "var(--red)" }}>
          {t.pct(score)}<small>{t.quiz.hits(hits, log.length)}</small>
        </div>
        <p style={{ marginTop: 16, fontSize: 14, maxWidth: "62ch", color: "var(--muted)" }}>
          {score >= 85 ? t.quiz.feedbackHigh : score >= 70 ? t.quiz.feedbackMid : t.quiz.feedbackLow}
        </p>
      </div>
      {fails.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>{t.quiz.failsTitle}</h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {fails.map((f, k) => (
              <div className="lw-card" key={k}>
                <span className="mono" style={{ fontSize: 11.5, color: DOM_COLOR[f.q.dom] }}>{t.dom[f.q.dom]}</span>
                <p style={{ fontSize: 15, margin: "8px 0 12px", fontWeight: 500 }}>{f.q.q}</p>
                <div className="lw-kv"><span style={{ color: "var(--red)" }}>{t.quiz.yourAnswer}</span><b>{f.q.opts[f.idx]}</b></div>
                <div className="lw-kv"><span style={{ color: "var(--green)" }}>{t.quiz.correctAnswer}</span><b>{f.q.opts[f.q.a]}</b></div>
                <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 12 }}>{f.q.exp}</p>
                {f.q.ref && <div className="lw-ref">{f.q.ref}</div>}
              </div>
            ))}
          </div>
        </>
      )}
      <button className="lw-btn primary" onClick={() => setPhase("setup")}>{t.quiz.again}</button>
    </div>
  );
}

/* ============================================================
   CALCULADORAS
   ============================================================ */
function Tools() {
  const { t } = useLang();
  const f = (n, d) => fmt(n, d, t.locale);
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
      <h2 className="lw-h2">{t.tools.h2}</h2>
      <p className="lw-lead">{t.tools.lead}</p>

      <div className="lw-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>{t.tools.toa}</h3>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginBottom: 20 }}>
          <Field label={t.tools.sf}>
            <select value={sf} onChange={(e) => setSf(+e.target.value)}>
              {[7, 8, 9, 10, 11, 12].map((v) => <option key={v} value={v}>SF{v}</option>)}
            </select>
          </Field>
          <Field label={t.tools.bw}>
            <select value={bw} onChange={(e) => setBw(+e.target.value)}>
              <option value={125000}>125 kHz</option><option value={250000}>250 kHz</option><option value={500000}>500 kHz</option>
            </select>
          </Field>
          <Field label={t.tools.cr}>
            <select value={cr} onChange={(e) => setCr(+e.target.value)}>
              {[1, 2, 3, 4].map((v) => <option key={v} value={v}>4/{4 + v}</option>)}
            </select>
          </Field>
          <Field label={t.tools.payload}>
            <input type="number" min="0" max="242" value={app} onChange={(e) => setApp(Math.max(0, Math.min(242, +e.target.value || 0)))} />
          </Field>
          <Field label={t.tools.dc}>
            <select value={dc} onChange={(e) => setDc(+e.target.value)}>
              <option value={1}>{t.tools.dcDefault}</option><option value={10}>{t.tools.dcHigh}</option><option value={0.1}>{t.tools.dcLow}</option>
            </select>
          </Field>
        </div>
        <svg viewBox="0 0 640 72" style={{ width: "100%", height: 62, marginBottom: 18 }} aria-hidden="true">
          <line x1="0" y1="70" x2="640" y2="70" stroke="var(--line)" strokeWidth="1" />
          {chirps}
        </svg>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
          <div><div className="lw-out">{f(r.toa)} ms<small>{t.tools.toaOut}</small></div></div>
          <div><div className="lw-out">{f(r.tSym, 2)} ms<small>{t.tools.tsymOut}</small></div></div>
          <div><div className="lw-out">{perHour < 1 ? f(perHour, 2) : Math.floor(perHour)}<small>{t.tools.perHour(f(dc, dc % 1 ? 1 : 0))}</small></div></div>
          <div><div className="lw-out">{f(wait, 1)} s<small>{t.tools.minWait}</small></div></div>
        </div>
        <p className="lw-note" style={{ marginTop: 14 }}>
          {t.tools.phyNote(phyLen, app, r.symbols)}
          {r.de ? t.tools.ldro : ""}
        </p>
      </div>

      <div className="lw-card">
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>{t.tools.linkBudget}</h3>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", marginBottom: 20 }}>
          <Field label={t.tools.ptx}><input type="number" value={ptx} onChange={(e) => setPtx(+e.target.value || 0)} /></Field>
          <Field label={t.tools.gtx}><input type="number" value={gtx} onChange={(e) => setGtx(+e.target.value || 0)} /></Field>
          <Field label={t.tools.grx}><input type="number" value={grx} onChange={(e) => setGrx(+e.target.value || 0)} /></Field>
          <Field label={t.tools.loss}><input type="number" value={loss} onChange={(e) => setLoss(+e.target.value || 0)} /></Field>
          <Field label={t.tools.env}>
            <select value={nExp} onChange={(e) => setNExp(+e.target.value)}>
              <option value={2.2}>{t.tools.envRural}</option>
              <option value={2.7}>{t.tools.envSuburban}</option>
              <option value={3.2}>{t.tools.envUrban}</option>
              <option value={3.8}>{t.tools.envDense}</option>
            </select>
          </Field>
        </div>
        <div className="lw-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
          <div><div className="lw-out">{f(sens, 1)} dBm<small>{t.tools.sens(sf)}</small></div></div>
          <div><div className="lw-out">{f(maxPL, 1)} dB<small>{t.tools.maxPL}</small></div></div>
          <div><div className="lw-out">{dKm < 1 ? `${f(dKm * 1000, 0)} m` : `${f(dKm, 1)} km`}<small>{t.tools.range}</small></div></div>
        </div>
        <p className="lw-note" style={{ marginTop: 14 }}>{t.tools.modelNote}</p>
      </div>
    </div>
  );
}

/* ============================================================
   REFERENCIA
   ============================================================ */
function Reference() {
  const { lang, t } = useLang();
  const T = tables(lang);
  const blocks = [
    { ...t.ref.dr, r: T.T_DR_EU, m: [0, 1, 2, 3, 4] },
    { ...t.ref.mtype, r: T.T_MTYPE, m: [0] },
    { ...t.ref.cid, r: T.T_CID, m: [0] },
    { ...t.ref.keys, r: T.T_KEYS, m: [] },
    { ...t.ref.times, r: T.T_TIMES, m: [1] },
    { ...t.ref.docs, r: T.T_DOCS, m: [0] },
  ];
  return (
    <div>
      <h2 className="lw-h2">{t.ref.h2}</h2>
      <p className="lw-lead">{t.ref.lead}</p>
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
const TAB_IDS = ["panel", "teoria", "tarjetas", "test", "calculadoras", "referencia"];

const DOM_IDS = DOMAINS.map((d) => d.id);

function LangSwitch() {
  const { lang, t, setLang } = useLang();
  return (
    <div className="lw-lang" role="group" aria-label={t.lang.label}>
      {LANGS.map((l) => (
        <button key={l} className="lw-lang-btn" aria-pressed={lang === l} lang={l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Shell() {
  const { lang, t } = useLang();
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
    a.download = `${t.dash.exportFile}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state, t]);

  /* El mismo saneado campo a campo que loadState(): un fichero importado es
     entrada tan poco fiable como lo que ya hubiera en localStorage. */
  const doImport = useCallback((text) => {
    const next = importState(DOM_IDS, text);
    if (!next) return false;
    setState(next);
    return true;
  }, []);

  const nQuestions = QUESTIONS.length + LESSONS.reduce((s, l) => s + l.checks.length, 0);

  return (
    <div className="lw">
      <style>{CSS}</style>

      <header className="lw-hero">
        <Waterfall />
        <div className="lw-hero-inner">
          <h1 className="lw-title">LPWAN<br />AP Trainer</h1>
          <p className="lw-sub">{t.hero.sub}</p>
          <div className="lw-facts">
            <span className="lw-fact"><b>{LESSONS.length}</b> {t.hero.lessons}</span>
            <span className="lw-fact"><b>{nQuestions}</b> {t.hero.questions}</span>
            <span className="lw-fact"><b>{CARDS.length}</b> {t.hero.cards}</span>
            <span className="lw-fact">{t.hero.examPrefix} <b>100</b> {t.hero.examMid} <b>90</b> {t.hero.examSuffix}</span>
          </div>
        </div>
      </header>

      <nav className="lw-nav">
        <div className="lw-nav-in">
          <div role="tablist" style={{ display: "flex", gap: 2 }}>
            {TAB_IDS.map((id) => (
              <button key={id} className="lw-tab" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                {t.tabs[id]}
              </button>
            ))}
          </div>
          <LangSwitch />
        </div>
      </nav>

      {/* La clave por idioma remonta la pestaña al cambiar de idioma, para que
          un test o una lección abiertos no se queden a medias en dos idiomas. */}
      <main className="lw-wrap" style={{ paddingTop: 28 }} key={lang}>
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

      <footer className="lw-footer">{t.footer}</footer>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}
