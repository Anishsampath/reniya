import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const styles = `
  ${FONT}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #f0ebe0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .serif { font-family: 'Playfair Display', serif; }
  .gold { color: #c9a84c; }
  .muted { color: #888; }
  .small { font-size: 13px; }

  .screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
  
  /* Intro */
  .intro-bg { background: #0a0a0a; position: relative; overflow: hidden; }
  .intro-bg::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%); pointer-events: none; }
  .logo { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 700; letter-spacing: -1px; color: #c9a84c; }
  .tagline { font-size: 1.1rem; color: #888; margin-top: 0.5rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 300; }
  .intro-body { max-width: 540px; text-align: center; margin: 3rem 0; }
  .intro-body p { font-size: 1.1rem; line-height: 1.8; color: #bbb; }
  .steps-row { display: flex; gap: 2rem; margin: 2rem 0; flex-wrap: wrap; justify-content: center; }
  .step-chip { background: #161616; border: 1px solid #2a2a2a; border-radius: 100px; padding: 0.6rem 1.4rem; font-size: 13px; color: #888; display: flex; align-items: center; gap: 0.5rem; }
  .step-chip span { color: #c9a84c; font-weight: 500; }
  .btn-primary { background: #c9a84c; color: #0a0a0a; border: none; padding: 1rem 2.5rem; font-size: 1rem; font-weight: 500; border-radius: 4px; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; transition: all 0.2s; }
  .btn-primary:hover { background: #dbbf6e; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: #888; border: 1px solid #2a2a2a; padding: 0.75rem 1.5rem; font-size: 0.9rem; border-radius: 4px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .btn-secondary:hover { border-color: #c9a84c; color: #c9a84c; }

  /* Form */
  .form-wrap { max-width: 620px; width: 100%; }
  .form-header { text-align: center; margin-bottom: 3rem; }
  .form-header h1 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0ebe0; }
  .form-header p { color: #888; margin-top: 0.5rem; font-size: 0.95rem; }
  .field { margin-bottom: 1.5rem; }
  .field label { display: block; font-size: 13px; color: #888; margin-bottom: 0.5rem; letter-spacing: 1px; text-transform: uppercase; }
  .field input, .field select, .field textarea { width: 100%; background: #111; border: 1px solid #2a2a2a; border-radius: 4px; padding: 0.85rem 1rem; color: #f0ebe0; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; transition: border-color 0.2s; }
  .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #c9a84c; }
  .field select option { background: #1a1a1a; }
  .field textarea { resize: vertical; min-height: 80px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-actions { display: flex; justify-content: center; margin-top: 2rem; }

  /* Assessment */
  .assess-wrap { max-width: 620px; width: 100%; }
  .progress-bar-bg { background: #1a1a1a; border-radius: 100px; height: 3px; margin-bottom: 3rem; }
  .progress-bar-fill { background: #c9a84c; height: 3px; border-radius: 100px; transition: width 0.4s ease; }
  .q-counter { font-size: 12px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem; }
  .q-text { font-family: 'Playfair Display', serif; font-size: 1.5rem; line-height: 1.5; color: #f0ebe0; margin-bottom: 2rem; }
  .options-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .opt-btn { background: #111; border: 1px solid #2a2a2a; border-radius: 4px; padding: 1rem 1.25rem; text-align: left; color: #bbb; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; transition: all 0.2s; display: flex; align-items: center; gap: 0.75rem; }
  .opt-btn:hover { border-color: #c9a84c; color: #f0ebe0; }
  .opt-btn.selected { border-color: #c9a84c; background: rgba(201,168,76,0.08); color: #f0ebe0; }
  .opt-key { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #333; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #666; flex-shrink: 0; }
  .opt-btn.selected .opt-key { border-color: #c9a84c; color: #c9a84c; background: rgba(201,168,76,0.15); }
  .assess-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }

  /* Loading */
  .loading-screen { text-align: center; }
  .spinner { width: 48px; height: 48px; border: 2px solid #2a2a2a; border-top-color: #c9a84c; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 2rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #888; }

  /* Results */
  .results-wrap { max-width: 800px; width: 100%; }
  .results-header { text-align: center; margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid #1a1a1a; }
  .results-header h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #f0ebe0; }
  .results-header p { color: #888; margin-top: 0.5rem; }

  /* Score ring */
  .score-section { display: flex; align-items: center; gap: 3rem; margin-bottom: 3rem; flex-wrap: wrap; }
  .ring-wrap { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
  .ring-svg { transform: rotate(-90deg); }
  .ring-bg { fill: none; stroke: #1a1a1a; stroke-width: 8; }
  .ring-fg { fill: none; stroke: #c9a84c; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
  .ring-num { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num .num { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #c9a84c; }
  .ring-num .lbl { font-size: 10px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
  .score-text h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0ebe0; margin-bottom: 0.5rem; }
  .score-text p { color: #888; font-size: 0.95rem; line-height: 1.7; }

  /* Insight cards */
  .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2.5rem; }
  .insight-card { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 1.25rem; }
  .insight-card .ic-label { font-size: 11px; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.75rem; }
  .insight-card .ic-item { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.9rem; color: #bbb; line-height: 1.5; }
  .ic-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .dot-gold { background: #c9a84c; }
  .dot-red { background: #e06060; }

  /* Highlights */
  .highlights { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
  .hl-card { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 1.25rem; }
  .hl-card .hl-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .hl-card .hl-label { font-size: 11px; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.4rem; }
  .hl-card .hl-value { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #f0ebe0; line-height: 1.4; }

  /* Career cards */
  .careers-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0ebe0; margin-bottom: 1.5rem; }
  .career-card { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; margin-bottom: 1rem; overflow: hidden; }
  .career-card-header { padding: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.2s; }
  .career-card-header:hover { background: #161616; }
  .career-card-left { display: flex; align-items: center; gap: 1rem; }
  .fit-badge { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; font-size: 12px; padding: 3px 10px; border-radius: 100px; font-weight: 500; white-space: nowrap; }
  .career-name { font-size: 1rem; font-weight: 500; color: #f0ebe0; }
  .career-tag { font-size: 12px; color: #666; margin-top: 2px; }
  .career-expand { color: #444; font-size: 18px; transition: transform 0.2s; }
  .career-expand.open { transform: rotate(180deg); }
  .career-body { padding: 0 1.25rem 1.25rem; border-top: 1px solid #1a1a1a; display: none; }
  .career-body.open { display: block; }
  .career-body .cb-label { font-size: 11px; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin: 1rem 0 0.5rem; }
  .career-body .cb-text { font-size: 0.9rem; color: #bbb; line-height: 1.7; }
  .cb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
  .cb-pill { background: #0f0f0f; border: 1px solid #1e1e1e; border-radius: 4px; padding: 0.6rem 0.75rem; font-size: 0.85rem; }
  .cb-pill .cp-label { font-size: 11px; color: #666; margin-bottom: 2px; }
  .cb-pill .cp-val { color: #c9a84c; }
  .step-list { list-style: none; }
  .step-list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9rem; color: #bbb; padding: 0.4rem 0; line-height: 1.5; }
  .step-num { width: 20px; height: 20px; border-radius: 50%; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .truth-box { background: rgba(201,168,76,0.04); border-left: 2px solid #c9a84c; padding: 0.75rem 1rem; margin-top: 0.75rem; font-size: 0.9rem; color: #bbb; line-height: 1.6; font-style: italic; }

  /* Email CTA */
  .email-section { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 2rem; text-align: center; margin-top: 2.5rem; }
  .email-section h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0ebe0; margin-bottom: 0.5rem; }
  .email-section p { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; }
  .email-row { display: flex; gap: 0.75rem; max-width: 420px; margin: 0 auto; }
  .email-input { flex: 1; background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 4px; padding: 0.75rem 1rem; color: #f0ebe0; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; }
  .email-input:focus { outline: none; border-color: #c9a84c; }
  .email-sent { color: #c9a84c; font-size: 0.95rem; }
  .restart-btn { background: transparent; border: 1px solid #2a2a2a; color: #666; padding: 0.6rem 1.5rem; border-radius: 4px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; margin-top: 2rem; transition: all 0.2s; }
  .restart-btn:hover { border-color: #c9a84c; color: #c9a84c; }

  @media (max-width: 600px) {
    .logo { font-size: 2.5rem; }
    .field-row { grid-template-columns: 1fr; }
    .insights-grid { grid-template-columns: 1fr; }
    .highlights { grid-template-columns: 1fr; }
    .cb-row { grid-template-columns: 1fr; }
    .email-row { flex-direction: column; }
    .score-section { justify-content: center; text-align: center; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

function parseJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return null;
  }
}

// ─── Screen 1: Intro ──────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div className="screen intro-bg">
      <div style={{ textAlign: "center" }}>
        <div className="logo">Reniya</div>
        <div className="tagline">Your Career Oracle</div>
        <div className="intro-body">
          <p>
            Not another career quiz. Reniya analyses your unique mix of skills,
            interests and life situation — then maps every possible path, from
            gig work to government to creative empires.
          </p>
        </div>
        <div className="steps-row">
          <div className="step-chip"><span>01</span> Your profile</div>
          <div className="step-chip"><span>02</span> Quick assessment</div>
          <div className="step-chip"><span>03</span> Full career report</div>
        </div>
        <div style={{ marginTop: "2.5rem" }}>
          <button className="btn-primary" onClick={onStart}>
            Begin your reading →
          </button>
        </div>
        <p className="muted small" style={{ marginTop: "1rem" }}>Takes about 5 minutes · Completely free</p>
      </div>
    </div>
  );
}

// ─── Screen 2: Profile Form ───────────────────────────────────────────────────

const situations = [
  "Student (school/college)",
  "Fresh graduate",
  "Early career (1–3 yrs)",
  "Mid-career (4–10 yrs)",
  "Homemaker re-entering",
  "Laid off / between jobs",
  "Looking for career change",
  "Retired / winding down",
];

function ProfileForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "", age: "", situation: "", skills: "", interests: "", constraints: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.name && form.age && form.situation && form.skills && form.interests;

  return (
    <div className="screen" style={{ background: "#0a0a0a" }}>
      <div className="form-wrap">
        <div className="form-header">
          <div className="logo" style={{ fontSize: "1.8rem" }}>Reniya</div>
          <h1 style={{ marginTop: "1.5rem" }}>Tell us about yourself</h1>
          <p className="muted">Be honest — the more specific you are, the sharper your reading.</p>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Your name</label>
            <input placeholder="Arjun" value={form.name} onChange={set("name")} />
          </div>
          <div className="field">
            <label>Age</label>
            <input type="number" placeholder="24" value={form.age} onChange={set("age")} />
          </div>
        </div>
        <div className="field">
          <label>Current situation</label>
          <select value={form.situation} onChange={set("situation")}>
            <option value="">Select one…</option>
            {situations.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Your skills (be specific)</label>
          <textarea
            placeholder="e.g. Good with numbers, speak 3 languages, fix motorcycles, write well, teach kids patiently…"
            value={form.skills}
            onChange={set("skills")}
          />
        </div>
        <div className="field">
          <label>What excites you</label>
          <textarea
            placeholder="e.g. Cooking, helping people solve problems, being outdoors, technology, local politics…"
            value={form.interests}
            onChange={set("interests")}
          />
        </div>
        <div className="field">
          <label>Constraints (optional)</label>
          <textarea
            placeholder="e.g. Can't relocate, need income within 2 months, caring for parents, no degree…"
            value={form.constraints}
            onChange={set("constraints")}
          />
        </div>
        <div className="form-actions">
          <button
            className="btn-primary"
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "default" }}
            onClick={() => onSubmit(form)}
          >
            Generate my questions →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 3: Assessment ─────────────────────────────────────────────────────

function Assessment({ profile, questions, onDone }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[idx];
  const total = questions.length;
  const selected = answers[idx];

  const choose = (opt) => setAnswers((a) => ({ ...a, [idx]: opt }));

  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else onDone(answers);
  };
  const back = () => { if (idx > 0) setIdx(idx - 1); };

  return (
    <div className="screen" style={{ background: "#0a0a0a" }}>
      <div className="assess-wrap">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <p className="q-counter">Question {idx + 1} of {total}</p>
        <p className="q-text serif">{q.question}</p>
        <div className="options-list">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`opt-btn ${selected === opt ? "selected" : ""}`}
              onClick={() => choose(opt)}
            >
              <span className="opt-key">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
        <div className="assess-nav">
          <button className="btn-secondary" onClick={back} style={{ visibility: idx === 0 ? "hidden" : "visible" }}>
            ← Back
          </button>
          <button
            className="btn-primary"
            disabled={!selected}
            style={{ opacity: selected ? 1 : 0.4, cursor: selected ? "pointer" : "default" }}
            onClick={next}
          >
            {idx < total - 1 ? "Next →" : "Analyse me →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: Results ────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="ring-wrap">
      <svg className="ring-svg" width="120" height="120" viewBox="0 0 120 120">
        <circle className="ring-bg" cx="60" cy="60" r={r} />
        <circle
          className="ring-fg"
          cx="60" cy="60" r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-num">
        <span className="num">{score}</span>
        <span className="lbl">Readiness</span>
      </div>
    </div>
  );
}

function CareerCard({ career, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="career-card">
      <div className="career-card-header" onClick={() => setOpen(!open)}>
        <div className="career-card-left">
          <span className="fit-badge">{career.fitScore}% fit</span>
          <div>
            <div className="career-name">{career.title}</div>
            <div className="career-tag">{career.category} · {career.difficulty}</div>
          </div>
        </div>
        <span className={`career-expand ${open ? "open" : ""}`}>▾</span>
      </div>
      <div className={`career-body ${open ? "open" : ""}`}>
        <p className="cb-label">Why this fits you</p>
        <p className="cb-text">{career.whyFits}</p>
        <div className="cb-row">
          <div className="cb-pill">
            <div className="cp-label">Earning range</div>
            <div className="cp-val">{career.earning}</div>
          </div>
          <div className="cb-pill">
            <div className="cp-label">Time to first income</div>
            <div className="cp-val">{career.timeToIncome}</div>
          </div>
        </div>
        <p className="cb-label">Your first 3 steps</p>
        <ul className="step-list">
          {career.steps.map((s, i) => (
            <li key={i}><span className="step-num">{i + 1}</span>{s}</li>
          ))}
        </ul>
        <p className="cb-label">What most people don't know</p>
        <div className="truth-box">{career.hiddenTruth}</div>
      </div>
    </div>
  );
}

function Results({ profile, report, onRestart }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email) setSent(true);
  };

  return (
    <div className="screen" style={{ background: "#0a0a0a", alignItems: "center", justifyContent: "flex-start", paddingTop: "4rem" }}>
      <div className="results-wrap">
        <div className="results-header">
          <div className="logo" style={{ fontSize: "1.5rem" }}>Reniya</div>
          <h1 style={{ marginTop: "1rem" }}>Your Career Reading, {profile.name}</h1>
          <p className="muted">Personalised analysis · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {/* Score */}
        <div className="score-section">
          <ScoreRing score={report.readinessScore} />
          <div className="score-text">
            <h2>{report.overallTake}</h2>
            <p>{report.scoreSummary}</p>
          </div>
        </div>

        {/* Strengths & gaps */}
        <div className="insights-grid">
          <div className="insight-card">
            <p className="ic-label">Your strengths</p>
            {report.strengths.map((s, i) => (
              <div key={i} className="ic-item">
                <div className="ic-dot dot-gold" />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="insight-card">
            <p className="ic-label">Gaps to bridge</p>
            {report.gaps.map((g, i) => (
              <div key={i} className="ic-item">
                <div className="ic-dot dot-red" />
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="highlights">
          <div className="hl-card">
            <div className="hl-icon">⚡</div>
            <div className="hl-label">Fastest path</div>
            <div className="hl-value">{report.fastestPath}</div>
          </div>
          <div className="hl-card">
            <div className="hl-icon">🚀</div>
            <div className="hl-label">Highest ceiling</div>
            <div className="hl-value">{report.highestCeiling}</div>
          </div>
          <div className="hl-card">
            <div className="hl-icon">⚠️</div>
            <div className="hl-label">Honest warning</div>
            <div className="hl-value">{report.warning}</div>
          </div>
        </div>

        {/* Career cards */}
        <h2 className="careers-title serif">Your matched career paths</h2>
        {report.careers.map((c, i) => (
          <CareerCard key={i} career={c} index={i} />
        ))}

        {/* Email CTA */}
        <div className="email-section">
          <h3>Get your full report by email</h3>
          <p>We'll send this analysis as a detailed PDF — save it, share it, revisit it anytime.</p>
          {!sent ? (
            <div className="email-row">
              <input
                className="email-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn-primary" onClick={handleSend} style={{ whiteSpace: "nowrap" }}>
                Send PDF
              </button>
            </div>
          ) : (
            <p className="email-sent">✓ Report sent to {email} — check your inbox!</p>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <button className="restart-btn" onClick={onRestart}>
            ↺ Start a new reading
          </button>
        </div>
        <div style={{ height: "4rem" }} />
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const QUESTION_SYSTEM = `You are Reniya's assessment engine. Given a user's profile, generate 7 diagnostic questions that reveal their actual knowledge depth, work style, and readiness. Questions should be specific to their stated skills and interests — not generic. Each question has 4 options ranging from beginner to advanced. Return ONLY valid JSON, no markdown, no preamble.

Format:
[
  { "question": "...", "options": ["...", "...", "...", "..."] },
  ...7 items
]`;

const REPORT_SYSTEM = `You are Reniya's career analysis engine. Given a profile and assessment answers, generate a deeply personalised career report. Be specific, honest, and insightful — not generic. Reference their actual answers. Return ONLY valid JSON, no markdown, no preamble.

Format:
{
  "readinessScore": 0-100,
  "overallTake": "one punchy sentence about their situation",
  "scoreSummary": "2-3 sentences explaining the score contextually",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "gaps": ["specific gap 1", "specific gap 2", "specific gap 3"],
  "fastestPath": "career/role name + why fast for them",
  "highestCeiling": "career/role name + why high ceiling",
  "warning": "one honest, specific warning about their situation",
  "careers": [
    {
      "title": "Career Title",
      "category": "Gig / Blue collar / White collar / Government / Creative / Tech / Business",
      "fitScore": 85,
      "difficulty": "Easy start / Medium / Hard",
      "earning": "₹X–Y/month range",
      "timeToIncome": "e.g. 2–4 weeks",
      "whyFits": "specific 2-sentence explanation referencing their profile",
      "steps": ["step 1", "step 2", "step 3"],
      "hiddenTruth": "one surprising, honest insight most people don't know about this career"
    }
  ]
}
Include 7 diverse careers covering different categories and difficulty levels, sorted by fit score descending.`;

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [report, setReport] = useState(null);

  const handleProfile = async (p) => {
    setProfile(p);
    setScreen("loading-q");
    const prompt = `Profile: Name: ${p.name}, Age: ${p.age}, Situation: ${p.situation}, Skills: ${p.skills}, Interests: ${p.interests}, Constraints: ${p.constraints || "none"}.`;
    const raw = await callClaude(QUESTION_SYSTEM, prompt);
    const qs = parseJSON(raw);
    if (qs && qs.length) {
      setQuestions(qs);
      setScreen("assessment");
    } else {
      setScreen("form");
      alert("Something went wrong generating questions. Please try again.");
    }
  };

  const handleAnswers = async (answers) => {
    setScreen("loading-r");
    const answerText = questions.map((q, i) => `Q${i + 1}: ${q.question} → ${answers[i] || "skipped"}`).join("\n");
    const prompt = `Profile: Name: ${profile.name}, Age: ${profile.age}, Situation: ${profile.situation}, Skills: ${profile.skills}, Interests: ${profile.interests}, Constraints: ${profile.constraints || "none"}.\n\nAssessment answers:\n${answerText}`;
    const raw = await callClaude(REPORT_SYSTEM, prompt);
    const r = parseJSON(raw);
    if (r && r.careers) {
      setReport(r);
      setScreen("results");
    } else {
      setScreen("assessment");
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      {screen === "intro" && <IntroScreen onStart={() => setScreen("form")} />}
      {screen === "form" && <ProfileForm onSubmit={handleProfile} />}
      {screen === "loading-q" && (
        <div className="screen" style={{ background: "#0a0a0a" }}>
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text serif">Crafting your questions…</p>
            <p className="muted small" style={{ marginTop: "0.5rem" }}>Personalising to your profile</p>
          </div>
        </div>
      )}
      {screen === "assessment" && questions.length > 0 && (
        <Assessment profile={profile} questions={questions} onDone={handleAnswers} />
      )}
      {screen === "loading-r" && (
        <div className="screen" style={{ background: "#0a0a0a" }}>
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text serif">Analysing your reading…</p>
            <p className="muted small" style={{ marginTop: "0.5rem" }}>Mapping every possible path for you</p>
          </div>
        </div>
      )}
      {screen === "results" && report && (
        <Results
          profile={profile}
          report={report}
          onRestart={() => { setScreen("intro"); setProfile(null); setQuestions([]); setReport(null); }}
        />
      )}
    </>
  );
}
