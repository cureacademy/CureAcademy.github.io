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
      // Replace only the first capture group with the new value
      result = result.replace(regex, (full, g1) => full.replace(g1, newVal));
    })
  );
  return result;
}

export default function Admin() {
  const [authed,    setAuthed]    = useState(false);
  const [pwInput,   setPwInput]   = useState("");
  const [pwError,   setPwError]   = useState("");
  const [token,     setToken]     = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [rawSource, setRawSource] = useState("");
  const [fileSha,   setFileSha]   = useState("");
  const [values,    setValues]    = useState({});
  const [commitMsg, setCommitMsg] = useState("chore: update site content via admin panel");
  const [status,    setStatus]    = useState({ type: "idle", msg: "Not connected — load file to begin" });

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
      setStatus({ type: "ok", msg: `Loaded — ${FILE_PATH}` });
    } catch (e) {
      setStatus({ type: "err", msg: e.message });
    }
  }, [token]);

  const saveFile = useCallback(async () => {
    if (!token || !rawSource) return;
    setStatus({ type: "load", msg: "Saving…" });
    try {
      const updated = applyFields(rawSource, values);
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
  }, [token, rawSource, fileSha, values, commitMsg]);

  const set = (id, val) => setValues((prev) => ({ ...prev, [id]: val }));

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

  const group   = FIELD_GROUPS[activeTab];
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
          {FIELD_GROUPS.map((g, i) => (
            <button
              key={g.tab}
              className={`admin-sidebar__tab${i === activeTab ? " admin-sidebar__tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {g.tab}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="admin-main">
          <div className="admin-main__section-label">{group.tab}</div>

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
          ) : (
            group.fields.map((f) => (
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
            ))
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