import { useState, useCallback } from "react";
import "./admin.css";

const REPO      = "cureacademy/CureAcademy.github.io";
const FILE_PATH = "frontend/src/App.jsx";
const BRANCH    = "main";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const FIELD_GROUPS = [
  {
    tab: "Home",
    fields: [
      { id: "home_headline", label: "Main headline",   textarea: true, regex: /(Empowering the next generation of cancer scientists and physicians)/ },
      { id: "home_cta",      label: "CTA button text",               regex: /(Join the Program)/ },
      { id: "home_b1",       label: "Benefit card 1",                regex: /(Learn about cancer from experts in the field)/ },
      { id: "home_b2",       label: "Benefit card 2",                regex: /(Gain hands-on paid lab experience)/ },
      { id: "home_b3",       label: "Benefit card 3",                regex: /(Receive mentorship and support)/ },
    ],
  },
  {
    tab: "About",
    fields: [
      { id: "about_mission", label: "Mission subtitle",              textarea: true, regex: /(Our Mission: Empowering the next generation of cancer scientists and physicians)/ },
      { id: "about_c1",      label: "Card 1 — Our Mission",         textarea: true, rows: 4, regex: /(Cure Academy is a cancer education and mentorship program designed to introduce high school students to the field of cancer\. Through lectures led by researchers, physicians, and healthcare professionals, students gain a foundational understanding of cancer\.)/ },
      { id: "about_c2",      label: "Card 2 — Research",            textarea: true, rows: 4, regex: /(In collaboration with NY Bioforce, selected students will be matched with hands-on, paid biomedical research opportunities\. These experiences allow students to apply what they have learned, develop laboratory skills, and work alongside researchers on real-world scientific projects\.)/ },
      { id: "about_c3",      label: "Card 3 — Mentorship",          textarea: true, rows: 4, regex: /(Beyond education and research, Cure Academy provides mentorship and guidance to help students navigate opportunities in science, medicine, and higher education\. We share cancer-related opportunities, research programs, internships, events, and educational resources through our website, listserv, and Instagram community\.)/ },
      { id: "about_c4",      label: "Card 4 — Stay Connected",      textarea: true, regex: /(Join our community to stay informed about cancer research opportunities, events, and resources\.)/ },
    ],
  },
  {
    tab: "Program",
    fields: [
      { id: "prog_desc",   label: "Program description", textarea: true, rows: 3, regex: /(Cure Academy is an educational program designed for students interested in learning about cancer through lecture series by physicians, scientists, and professors\.)/ },
      { id: "prog_p1sub",  label: "Phase 1 subtitle",                               regex: /(Open to high school students in any grade interested in medicine and cancer research\.)/ },
      { id: "prog_p2desc", label: "Phase 2 description", textarea: true, rows: 3,  regex: /(This paid, hands-on summer internship is available to up to five selected students graduating in 2027 or 2028 who will be at least 16 years old by July 1, 2027\.)/ },
      { id: "prog_sel",    label: "Selection criteria",  textarea: true,            regex: /(Based on Phase 1 engagement, research motivation, and NY Bioforce eligibility\.)/ },
    ],
  },
  {
    tab: "Apply",
    fields: [
      { id: "apply_deadline", label: "Deadline text", regex: /(Deadline: [A-Za-z]+ \d+, \d{4})/ },
      { id: "apply_sub",      label: "Tagline",       regex: /(Register for the lecture series)/ },
      { id: "apply_btn",      label: "Button text",   regex: /(OPEN REGISTRATION FORM)/ },
    ],
  },
  {
    tab: "Support",
    fields: [
      { id: "support_body", label: "Body text",    textarea: true, rows: 3, regex: /(If you are interested in volunteering as a guest instructor or student mentor at Cure Academy, please complete the form below\.)/ },
      { id: "support_btn",  label: "Button text",                           regex: /(Support Cure Academy)/ },
    ],
  },
  {
    tab: "Nav / Footer",
    fields: [
      { id: "nav_brand",    label: "Brand name",      regex: /(CURE ACADEMY)/ },
      { id: "nav_tag",      label: "Nav tagline",     regex: /(Inspiring students in cancer research)/ },
      { id: "footer_email", label: "Contact email",   regex: /(cureacademyinfo@gmail\.com)/ },
      { id: "footer_copy",  label: "Copyright line",  regex: /(© \d{4} Cure Academy[^"<]+)/ },
    ],
  },
];

// ── HELPERS ───────────────────────────────────────────────
function extractFields(source) {
  const values = {};
  FIELD_GROUPS.forEach(({ fields }) =>
    fields.forEach(({ id, regex }) => {
      const m = source.match(regex);
      values[id] = m ? m[1].trim() : "";
    })
  );
  return values;
}

function applyFields(source, values) {
  let result = source;
  FIELD_GROUPS.forEach(({ fields }) =>
    fields.forEach(({ id, regex }) => {
      const newVal = values[id];
      if (newVal === undefined) return;
      result = result.replace(regex, (full, g1) => full.replace(g1, newVal));
    })
  );
  return result;
}

// Extract opportunities array from source
function extractOpportunities(source) {
  const match = source.match(/const opportunities = \[([\s\S]*?)\];/);
  if (!match) return [];
  const block = match[1].trim();
  if (!block || block.replace(/\/\/.*$/gm, "").trim() === "") return [];
  const results = [];
  const entryRegex = /\{([^}]+)\}/g;
  let m;
  while ((m = entryRegex.exec(block)) !== null) {
    const entry = m[1];
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"([^"]*)"`, );
      const match = entry.match(r);
      return match ? match[1] : "";
    };
    results.push({
      title: get("title"),
      org: get("org"),
      description: get("description"),
      link: get("link"),
      tag: get("tag"),
    });
  }
  return results;
}

// Replace opportunities array in source
function applyOpportunities(source, opps) {
  const entries = opps.map(o =>
    `    { title: "${o.title}", org: "${o.org}", description: "${o.description}", link: "${o.link}", tag: "${o.tag}" }`
  ).join(",\n");
  const replacement = `const opportunities = [\n${entries}${entries ? ",\n  " : ""}\n  ]`;
  return source.replace(/const opportunities = \[[\s\S]*?\]/, replacement);
}

const EMPTY_OPP = { title: "", org: "", description: "", link: "", tag: "" };
const TAG_OPTIONS = ["Internship", "Program", "Event", "Fellowship", "Competition", "Other"];

export default function Admin() {
  const [authed,       setAuthed]       = useState(false);
  const [pwInput,      setPwInput]      = useState("");
  const [pwError,      setPwError]      = useState("");
  const [token,        setToken]        = useState("");
  const [activeTab,    setActiveTab]    = useState(0);
  const [rawSource,    setRawSource]    = useState("");
  const [fileSha,      setFileSha]      = useState("");
  const [values,       setValues]       = useState({});
  const [opps,         setOpps]         = useState([]);
  const [commitMsg,    setCommitMsg]    = useState("chore: update site content via admin panel");
  const [status,       setStatus]       = useState({ type: "idle", msg: "Not connected — load file to begin" });

  const ALL_TABS = [...FIELD_GROUPS.map(g => g.tab), "Opportunities"];

  // Auth
  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError("Incorrect password.");
    }
  };

  // Fetch App.jsx from GitHub
  const fetchFile = useCallback(async () => {
    if (!token) { setStatus({ type: "err", msg: "Enter a GitHub token first" }); return; }
    setStatus({ type: "load", msg: "Fetching file…" });
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const source = atob(data.content.replace(/\n/g, ""));
      setRawSource(source);
      setFileSha(data.sha);
      setValues(extractFields(source));
      setOpps(extractOpportunities(source));
      setStatus({ type: "ok", msg: `Loaded — ${FILE_PATH}` });
    } catch (e) {
      setStatus({ type: "err", msg: e.message });
    }
  }, [token]);

  const saveFile = useCallback(async () => {
    if (!token || !rawSource) return;
    setStatus({ type: "load", msg: "Saving…" });
    try {
      let updated = applyFields(rawSource, values);
      updated = applyOpportunities(updated, opps);
      const encoded = btoa(unescape(encodeURIComponent(updated)));
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: commitMsg, content: encoded, sha: fileSha, branch: BRANCH }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `GitHub ${res.status}`);
      }
      const data = await res.json();
      setFileSha(data.content.sha);
      setRawSource(updated);
      setStatus({ type: "ok", msg: "Saved & committed — GitHub Pages redeploying…" });
    } catch (e) {
      setStatus({ type: "err", msg: e.message });
    }
  }, [token, rawSource, fileSha, values, opps, commitMsg]);

  const set = (id, val) => setValues((prev) => ({ ...prev, [id]: val }));

  // Opportunities helpers
  const addOpp = () => setOpps(prev => [...prev, { ...EMPTY_OPP }]);
  const removeOpp = (i) => setOpps(prev => prev.filter((_, idx) => idx !== i));
  const updateOpp = (i, field, val) => setOpps(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
  const moveOpp = (i, dir) => {
    setOpps(prev => {
      const next = [...prev];
      const swap = i + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[i], next[swap]] = [next[swap], next[i]];
      return next;
    });
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__box">
          <div className="admin-gate__title">Cure Academy — Admin</div>
          <label className="admin-gate__label">Password</label>
          <input
            type="password"
            className="admin-gate__input"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            autoFocus
          />
          <button className="admin-gate__btn" onClick={handleLogin}>Enter</button>
          {pwError && <div className="admin-gate__error">{pwError}</div>}
        </div>
      </div>
    );
  }

  const isOppsTab = activeTab === ALL_TABS.length - 1;
  const group = !isOppsTab ? FIELD_GROUPS[activeTab] : null;
  const canSave = !!rawSource && !!token;

  return (
    <div className="admin-root">
      {/* Topbar */}
      <div className="admin-topbar">
        <span className="admin-topbar__title">Cure Academy — Content Editor</span>
        <span className={`admin-status admin-status--${status.type}`}>{status.msg}</span>
      </div>

      {/* Token bar */}
      <div className="admin-tokenbar">
        <span className="admin-tokenbar__label">GitHub Token</span>
        <input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchFile()}
          className="admin-tokenbar__input"
        />
        <button className="admin-tokenbar__btn" onClick={fetchFile}>Load file</button>
      </div>

      {/* Body */}
      <div className="admin-body">
        {/* Sidebar */}
        <div className="admin-sidebar">
          {ALL_TABS.map((tab, i) => (
            <button
              key={tab}
              className={`admin-sidebar__tab${i === activeTab ? " admin-sidebar__tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="admin-main">
          {!rawSource ? (
            <p className="admin-main__empty">
              Enter your GitHub token above and click <strong>Load file</strong> to pull the live{" "}
              <code>App.jsx</code> from your repo.
              <br /><br />
              Create a token at{" "}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">
                github.com/settings/tokens
              </a>{" "}
              — enable the <code>repo</code> scope (or <code>contents: write</code> for fine-grained tokens).
            </p>
          ) : isOppsTab ? (
            /* ── OPPORTUNITIES TAB ── */
            <div>
              <div className="admin-main__section-label">Opportunities</div>
              <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Add, edit, or remove opportunities. Click Save &amp; publish when done.
              </p>

              {opps.length === 0 && (
                <p style={{ color: "#9ca3af", fontStyle: "italic", marginBottom: "1rem" }}>
                  No opportunities yet. Click "Add Opportunity" to add one.
                </p>
              )}

              {opps.map((opp, i) => (
                <div key={i} style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  marginBottom: "1rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: 700, color: "#374151" }}>Opportunity #{i + 1}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => moveOpp(i, -1)} disabled={i === 0}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                      <button onClick={() => moveOpp(i, 1)} disabled={i === opps.length - 1}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", opacity: i === opps.length - 1 ? 0.4 : 1 }}>↓</button>
                      <button onClick={() => removeOpp(i)}
                        style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff1f1", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                    </div>
                  </div>

                  {[
                    { field: "title", label: "Title" },
                    { field: "org", label: "Organization" },
                    { field: "description", label: "Description" },
                    { field: "link", label: "Link (URL)" },
                  ].map(({ field, label }) => (
                    <div key={field} className="admin-field" style={{ marginBottom: "0.75rem" }}>
                      <label className="admin-field__label">{label}</label>
                      {field === "description" ? (
                        <textarea
                          rows={2}
                          className="admin-field__textarea"
                          value={opp[field]}
                          onChange={(e) => updateOpp(i, field, e.target.value)}
                        />
                      ) : (
                        <input
                          className="admin-field__input"
                          value={opp[field]}
                          onChange={(e) => updateOpp(i, field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="admin-field">
                    <label className="admin-field__label">Tag</label>
                    <select
                      className="admin-field__input"
                      value={opp.tag}
                      onChange={(e) => updateOpp(i, "tag", e.target.value)}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select a tag…</option>
                      {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              <button
                onClick={addOpp}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "#0d9488",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                + Add Opportunity
              </button>
            </div>
          ) : (
            /* ── REGULAR FIELD TABS ── */
            <>
              <div className="admin-main__section-label">{group.tab}</div>
              {group.fields.map((f) => (
                <div key={f.id} className="admin-field">
                  <label className="admin-field__label">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      rows={f.rows || 3}
                      className="admin-field__textarea"
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
            </>
          )}
        </div>
      </div>

      {/* Footer / save bar */}
      <div className="admin-footer">
        <input
          className="admin-footer__commit"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          placeholder="Commit message"
        />
        <button
          className={`admin-footer__save admin-footer__save--${canSave ? "enabled" : "disabled"}`}
          onClick={saveFile}
          disabled={!canSave}
        >
          Save & publish
        </button>
      </div>
    </div>
  );
}