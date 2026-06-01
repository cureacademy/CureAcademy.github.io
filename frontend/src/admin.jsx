import { useState, useCallback } from "react";
import "./admin.css";

const REPO = "cureacademy/CureAcademy.github.io";
const FILE_PATH = "frontend/src/App.jsx";
const BRANCH = "main";


const FIELD_GROUPS = [
  {
    tab: "Home",
    fields: [
      {
        id: "home_headline",
        label: "Main headline",
        textarea: true,
        regex:
          /(Empowering the next generation of cancer scientists and physicians)/,
      },
      {
        id: "home_cta",
        label: "CTA button text",
        regex: /(Join the Program)/,
      },
      {
        id: "home_b1",
        label: "Benefit card 1",
        regex: /(Learn about cancer from experts in the field)/,
      },
      {
        id: "home_b2",
        label: "Benefit card 2",
        regex: /(Gain hands-on paid lab experience)/,
      },
      {
        id: "home_b3",
        label: "Benefit card 3",
        regex: /(Receive mentorship and support)/,
      },
    ],
  },

  {
    tab: "About",
    fields: [
      {
        id: "about_mission",
        label: "Mission subtitle",
        textarea: true,
        regex:
          /(Our Mission: Empowering the next generation of cancer scientists and physicians)/,
      },
      {
        id: "about_c1",
        label: "Card 1 — Mission",
        textarea: true,
        rows: 4,
        regex:
          /(Cure Academy is a cancer education and mentorship program designed to introduce high school students to the field of cancer\. Through lectures led by researchers, physicians, and healthcare professionals, students gain a foundational understanding of cancer\.)/,
      },
      {
        id: "about_c2",
        label: "Card 2 — Research",
        textarea: true,
        rows: 4,
        regex:
          /(In collaboration with NY Bioforce, selected students will be matched with hands-on, paid biomedical research opportunities\. These experiences allow students to apply what they have learned, develop laboratory skills, and work alongside researchers on real-world scientific projects\.)/,
      },
      {
        id: "about_c3",
        label: "Card 3 — Mentorship",
        textarea: true,
        rows: 4,
        regex:
          /(Beyond education and research, Cure Academy provides mentorship and guidance to help students navigate opportunities in science, medicine, and higher education\. We share cancer-related opportunities, research programs, internships, events, and educational resources through our website, listserv, and Instagram community\.)/,
      },
      {
        id: "about_c4",
        label: "Card 4 — Stay Connected",
        textarea: true,
        regex:
          /(Join our community to stay informed about cancer research opportunities, events, and resources\.)/,
      },
    ],
  },

  {
    tab: "Program",
    fields: [
      {
        id: "prog_desc",
        label: "Program description",
        textarea: true,
        rows: 3,
        regex:
          /(Cure Academy is an educational program designed for students interested in learning about cancer through lecture series by physicians, scientists, and professors\.)/,
      },
      {
        id: "prog_p1sub",
        label: "Phase 1 subtitle",
        regex:
          /(Open to high school students in any grade interested in medicine and cancer research\.)/,
      },
      {
        id: "prog_p2desc",
        label: "Phase 2 description",
        textarea: true,
        rows: 3,
        regex:
          /(This paid, hands-on summer internship is available to up to five selected students graduating in 2027 or 2028 who will be at least 16 years old by July 1, 2027\.)/,
      },
      {
        id: "prog_sel",
        label: "Selection criteria",
        textarea: true,
        regex:
          /(Based on Phase 1 engagement, research motivation, and NY Bioforce eligibility\.)/,
      },
    ],
  },

  {
    tab: "Apply",
    fields: [
      {
        id: "apply_deadline",
        label: "Deadline text",
        regex: /(Deadline: [A-Za-z]+ \d+, \d{4})/,
      },
      { id: "apply_sub", label: "Tagline", regex: /(Register for the lecture series)/ },
      { id: "apply_btn", label: "Button text", regex: /(OPEN REGISTRATION FORM)/ },
    ],
  },

  {
    tab: "Support",
    fields: [
      {
        id: "support_body",
        label: "Body text",
        textarea: true,
        rows: 3,
        regex:
          /(If you are interested in volunteering as a guest instructor or student mentor at Cure Academy, please complete the form below\.)/,
      },
      { id: "support_btn", label: "Button text", regex: /(Support Cure Academy)/ },
    ],
  },

  {
    tab: "Nav / Footer",
    fields: [
      { id: "nav_brand", label: "Brand name", regex: /(CURE ACADEMY)/ },
      { id: "nav_tag", label: "Nav tagline", regex: /(Inspiring students in cancer research)/ },
      { id: "footer_email", label: "Email", regex: /(cureacademyinfo@gmail\.com)/ },
      { id: "footer_copy", label: "Copyright", regex: /(© \d{4} Cure Academy[^"<]+)/ },
    ],
  },
];


const EMPTY_OPP = { title: "", org: "", description: "", link: "", tag: "" };

function extractOpportunities(source) {
  const match = source.match(/const opportunities = \[([\s\S]*?)\];/);
  if (!match) return [];
  const block = match[1];
  const entries = [];
  const objRegex = /\{([\s\S]*?)\}/g;
  let m;
  while ((m = objRegex.exec(block))) {
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"([^"]*)"`);
      const found = m[1].match(r);
      return found ? found[1] : "";
    };
    const title = get("title");
    if (title !== "" || get("org") !== "" || get("link") !== "") {
      entries.push({
        title: get("title"),
        org: get("org"),
        description: get("description"),
        link: get("link"),
        tag: get("tag"),
      });
    }
  }
  return entries;
}

function applyOpportunities(source, opps) {
  const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const block = opps
    .map(
      (o) =>
        `  { title: "${escape(o.title)}", org: "${escape(o.org)}", description: "${escape(o.description)}", link: "${escape(o.link)}", tag: "${escape(o.tag)}" }`
    )
    .join(",\n");
  const replaced = source.replace(
    /const opportunities = \[[\s\S]*?\];/,
    `const opportunities = [\n${block}\n];`
  );
  if (replaced === source) console.warn("applyOpportunities: pattern not found in source!");
  return replaced;
}


const EMPTY_WEEK = { date: "", topic: "", details: "" };

function extractTimeline(source) {
  // Try top-level const first (new format)
  let match = source.match(/const programTimeline = \[([\s\S]*?)\];/);
  // Fall back to inline const inside ProgramPage (old format)
  if (!match) match = source.match(/const timeline = \[([\s\S]*?)\]/);
  if (!match) return [];

  const block = match[1];
  const entries = [];
  const objRegex = /\{([\s\S]*?)\}/g;
  let m;
  while ((m = objRegex.exec(block))) {
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"([^"]*)"`);
      const found = m[1].match(r);
      return found ? found[1] : "";
    };
    const date = get("date");
    if (date !== "" || get("topic") !== "") {
      entries.push({ date: get("date"), topic: get("topic"), details: get("details") });
    }
  }
  return entries;
}

function applyTimeline(source, items) {
  const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const block = items
    .map((o) => `  { date: "${escape(o.date)}", topic: "${escape(o.topic)}", details: "${escape(o.details)}" }`)
    .join(",\n");
  const replaced = source.replace(
    /const programTimeline = \[[\s\S]*?\];/,
    `const programTimeline = [\n${block}\n];`
  );
  if (replaced === source) console.warn("applyTimeline: pattern not found in source!");
  return replaced;
}


const EMPTY_P2 = { label: "", detail: "" };

function extractPhase2(source) {
  const match = source.match(/const phase2Schedule = \[([\s\S]*?)\];/);
  if (!match) return [];
  const block = match[1];
  const entries = [];
  const objRegex = /\{([\s\S]*?)\}/g;
  let m;
  while ((m = objRegex.exec(block))) {
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"([^"]*)"`);
      const found = m[1].match(r);
      return found ? found[1] : "";
    };
    const label = get("label");
    if (label !== "" || get("detail") !== "") {
      entries.push({ label: get("label"), detail: get("detail") });
    }
  }
  return entries;
}

function applyPhase2(source, items) {
  const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const block = items
    .map((o) => `  { label: "${escape(o.label)}", detail: "${escape(o.detail)}" }`)
    .join(",\n");
  const replaced = source.replace(
    /const phase2Schedule = \[[\s\S]*?\];/,
    `const phase2Schedule = [\n${block}\n];`
  );
  if (replaced === source) console.warn("applyPhase2: pattern not found in source!");
  return replaced;
}

function extractFields(source) {
  const values = {};
  FIELD_GROUPS.forEach((g) =>
    g.fields.forEach((f) => {
      if (!f.regex) return;
      const m = source.match(f.regex);
      values[f.id] = m ? m[1].trim() : "";
    })
  );
  return values;
}

function applyFields(source, values) {
  let result = source;
  FIELD_GROUPS.forEach((g) =>
    g.fields.forEach((f) => {
      if (!f.regex) return;
      const val = values[f.id];
      if (val === undefined) return;
      result = result.replace(f.regex, (full, g1) => full.replace(g1, val));
    })
  );
  return result;
}

export default function Admin() {
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const [rawSource, setRawSource] = useState("");
  const [fileSha, setFileSha] = useState("");
  const [values, setValues] = useState({});
  const [opps, setOpps] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [phase2, setPhase2] = useState([]);

  const [commitMsg, setCommitMsg] = useState("chore: update CMS content");

  const [status, setStatus] = useState({ type: "idle", msg: "Load file to begin" });

  const ALL_TABS = [...FIELD_GROUPS.map((g) => g.tab), "Opportunities"];

  const OPPS_IDX = FIELD_GROUPS.length;       // 6
  const PROG_TAB_IDX = FIELD_GROUPS.findIndex((g) => g.tab === "Program"); // 2

  const isOppsTab = activeTab === OPPS_IDX;
  const group = !isOppsTab ? FIELD_GROUPS[activeTab] : null;
  const canSave = !!rawSource && !!token;


  const fetchFile = useCallback(async () => {
    setStatus({ type: "load", msg: "Loading..." });
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      const data = await res.json();
      const source = atob(data.content.replace(/\n/g, ""));
      setRawSource(source);
      setFileSha(data.sha);
      setValues(extractFields(source));
      setOpps(extractOpportunities(source));
      setTimeline(extractTimeline(source));
      setPhase2(extractPhase2(source));
      setStatus({ type: "ok", msg: "Loaded CMS" });
    } catch (err) {
      setStatus({ type: "err", msg: "Load failed" });
      console.error(err);
    }
  }, [token]);


  const saveFile = useCallback(async () => {
    setStatus({ type: "load", msg: "Saving..." });
    try {
      let updated = applyFields(rawSource, values);
      updated = applyOpportunities(updated, opps);
      updated = applyTimeline(updated, timeline);
      updated = applyPhase2(updated, phase2);

      const encoded = btoa(unescape(encodeURIComponent(updated)));

      await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: commitMsg,
            content: encoded,
            sha: fileSha,
            branch: BRANCH,
          }),
        }
      );
      setStatus({ type: "ok", msg: "Saved" });
    } catch (err) {
      setStatus({ type: "err", msg: "Save failed" });
      console.error(err);
    }
  }, [token, rawSource, fileSha, values, opps, timeline, phase2, commitMsg]);

  const set = (id, val) => setValues((p) => ({ ...p, [id]: val }));

  /* ── OPPS helpers ── */
  const addOpp = () => setOpps((p) => [...p, { ...EMPTY_OPP }]);
  const updateOpp = (i, key, val) =>
    setOpps((p) => p.map((o, idx) => (idx === i ? { ...o, [key]: val } : o)));
  const removeOpp = (i) => setOpps((p) => p.filter((_, idx) => idx !== i));
  const moveOpp = (i, dir) =>
    setOpps((p) => {
      const arr = [...p];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });

  /* ── TIMELINE helpers ── */
  const addWeek = () => setTimeline((p) => [...p, { ...EMPTY_WEEK }]);
  const updateWeek = (i, key, val) =>
    setTimeline((p) => p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const removeWeek = (i) => setTimeline((p) => p.filter((_, idx) => idx !== i));
  const moveWeek = (i, dir) =>
    setTimeline((p) => {
      const arr = [...p];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });

  /* ── PHASE 2 helpers ── */
  const addP2 = () => setPhase2((p) => [...p, { ...EMPTY_P2 }]);
  const updateP2 = (i, key, val) =>
    setPhase2((p) => p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const removeP2 = (i) => setPhase2((p) => p.filter((_, idx) => idx !== i));


  return (
    <div className="admin-root">

      <div className="admin-topbar">
        <span className="admin-topbar__title">CURE CMS</span>
        <span className={`admin-status admin-status--${status.type}`}>{status.msg}</span>
      </div>

      <div className="admin-tokenbar">
        <input
          className="admin-tokenbar__input"
          placeholder="GitHub token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="admin-tokenbar__btn" onClick={fetchFile}>Load</button>
      </div>

      <div className="admin-body">

        <div className="admin-sidebar">
          {ALL_TABS.map((t, i) => (
            <button
              key={t}
              className={`admin-sidebar__tab ${i === activeTab ? "admin-sidebar__tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="admin-main">

          <div className="admin-main__section-label">
            {isOppsTab ? "Opportunities" : group.tab}
          </div>

          {!rawSource ? (
            <p className="admin-main__empty">Load file to begin editing</p>

          ) : isOppsTab ? (
            <div className="opps-grid">
              {opps.map((o, i) => (
                <div key={i} className="opp-card">
                  <div className="opp-actions">
                    <button onClick={() => moveOpp(i, -1)}>↑</button>
                    <button onClick={() => moveOpp(i, 1)}>↓</button>
                    <button onClick={() => removeOpp(i)}>✕</button>
                  </div>
                  <input placeholder="Title" value={o.title} onChange={(e) => updateOpp(i, "title", e.target.value)} />
                  <input placeholder="Org" value={o.org} onChange={(e) => updateOpp(i, "org", e.target.value)} />
                  <textarea placeholder="Description" value={o.description} onChange={(e) => updateOpp(i, "description", e.target.value)} />
                  <input placeholder="Link" value={o.link} onChange={(e) => updateOpp(i, "link", e.target.value)} />
                  <input placeholder="Tag" value={o.tag} onChange={(e) => updateOpp(i, "tag", e.target.value)} />
                </div>
              ))}
              <button className="add-btn" onClick={addOpp}>+ Add Opportunity</button>
            </div>

          ) : (
            <>
              {FIELD_GROUPS[activeTab].fields.map((f) => (
                <div key={f.id} className="admin-field">
                  <label className="admin-field__label">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      className="admin-field__textarea"
                      rows={f.rows || 3}
                      value={values[f.id] || ""}
                      onChange={(e) => set(f.id, e.target.value)}
                    />
                  ) : (
                    <input
                      className="admin-field__input"
                      value={values[f.id] || ""}
                      onChange={(e) => set(f.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {activeTab === PROG_TAB_IDX && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 32 }}>

                  <div className="prog-section-header">PHASE 1 — TIMELINE</div>
                  <div className="opps-grid">
                    {timeline.map((row, i) => (
                      <div key={i} className="opp-card">
                        <div className="opp-actions">
                          <button onClick={() => moveWeek(i, -1)}>↑</button>
                          <button onClick={() => moveWeek(i, 1)}>↓</button>
                          <button onClick={() => removeWeek(i)}>✕</button>
                        </div>
                        <input
                          placeholder="Date range (e.g. June 22-26, 2026)"
                          value={row.date}
                          onChange={(e) => updateWeek(i, "date", e.target.value)}
                        />
                        <input
                          placeholder="Topic"
                          value={row.topic}
                          onChange={(e) => updateWeek(i, "topic", e.target.value)}
                        />
                        <textarea
                          placeholder="Details"
                          rows={3}
                          value={row.details}
                          onChange={(e) => updateWeek(i, "details", e.target.value)}
                        />
                      </div>
                    ))}
                    <button className="add-btn" onClick={addWeek}>+ Add Week</button>
                  </div>

                  <div className="prog-section-header" style={{ marginTop: 8 }}>PHASE 2 — SCHEDULE</div>
                  <div className="opps-grid">
                    {phase2.map((row, i) => (
                      <div key={i} className="opp-card">
                        <div className="opp-actions">
                          <button onClick={() => removeP2(i)}>✕</button>
                        </div>
                        <input
                          placeholder="Label (e.g. Winter 2027)"
                          value={row.label}
                          onChange={(e) => updateP2(i, "label", e.target.value)}
                        />
                        <input
                          placeholder="Detail (e.g. Application Opens)"
                          value={row.detail}
                          onChange={(e) => updateP2(i, "detail", e.target.value)}
                        />
                      </div>
                    ))}
                    <button className="add-btn" onClick={addP2}>+ Add Row</button>
                  </div>

                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="admin-footer">
        <input
          className="admin-footer__commit"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
        />
        <button
          className={`admin-footer__save ${canSave ? "admin-footer__save--enabled" : "admin-footer__save--disabled"}`}
          onClick={saveFile}
        >
          Save
        </button>
      </div>
    </div>
  );
}