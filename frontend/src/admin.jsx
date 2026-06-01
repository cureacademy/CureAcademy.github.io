import { useState, useCallback } from "react";
import "./admin.css";

const REPO = "cureacademy/CureAcademy.github.io";
const FILE_PATH = "frontend/src/App.jsx";
const BRANCH = "main";

/* ───────────────────────── FIELD CONFIG ───────────────────────── */

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

/* ───────────────────────── OPPORTUNITIES ───────────────────────── */

const EMPTY_OPP = {
  title: "",
  org: "",
  description: "",
  link: "",
  tag: "",
};

function extractOpportunities(source) {
  const match = source.match(/const opportunities = \[([\s\S]*?)\];/);
  if (!match) return [];

  const block = match[1];
  const entries = [];
  const regex = /\{([^}]+)\}/g;

  let m;
  while ((m = regex.exec(block))) {
    const entry = m[1];

    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"([^"]*)"`);
      const found = entry.match(r);
      return found ? found[1] : "";
    };

    entries.push({
      title: get("title"),
      org: get("org"),
      description: get("description"),
      link: get("link"),
      tag: get("tag"),
    });
  }

  return entries;
}

function applyOpportunities(source, opps) {
  const block = opps
    .map(
      (o) =>
        `  { title: "${o.title}", org: "${o.org}", description: "${o.description}", link: "${o.link}", tag: "${o.tag}" }`
    )
    .join(",\n");

  return source.replace(
    /const opportunities = \[[\s\S]*?\];/,
    `const opportunities = [\n${block}\n];`
  );
}

/* ───────────────────────── HELPERS ───────────────────────── */

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

      result = result.replace(f.regex, (full, g1) =>
        full.replace(g1, val)
      );
    })
  );

  return result;
}

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function Admin() {
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const [rawSource, setRawSource] = useState("");
  const [fileSha, setFileSha] = useState("");
  const [values, setValues] = useState({});
  const [opps, setOpps] = useState([]);

  const [commitMsg, setCommitMsg] = useState(
    "chore: update CMS content"
  );

  const [status, setStatus] = useState({
    type: "idle",
    msg: "Load file to begin",
  });

  const ALL_TABS = [...FIELD_GROUPS.map((g) => g.tab), "Opportunities"];

  const isOppsTab = activeTab === ALL_TABS.length - 1;
  const group = isOppsTab ? null : FIELD_GROUPS[activeTab];
  const canSave = !!rawSource && !!token;

  /* ── FETCH ── */

  const fetchFile = useCallback(async () => {
    setStatus({ type: "load", msg: "Loading..." });

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

    setStatus({ type: "ok", msg: "Loaded CMS" });
  }, [token]);

  /* ── SAVE ── */

  const saveFile = useCallback(async () => {
    setStatus({ type: "load", msg: "Saving..." });

    let updated = applyFields(rawSource, values);
    updated = applyOpportunities(updated, opps);

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
  }, [token, rawSource, fileSha, values, opps, commitMsg]);

  const set = (id, val) =>
    setValues((p) => ({ ...p, [id]: val }));

  /* ── OPPS ── */

  const addOpp = () =>
    setOpps((p) => [...p, { ...EMPTY_OPP }]);

  const updateOpp = (i, key, val) =>
    setOpps((p) =>
      p.map((o, idx) =>
        idx === i ? { ...o, [key]: val } : o
      )
    );

  const removeOpp = (i) =>
    setOpps((p) => p.filter((_, idx) => idx !== i));

  const moveOpp = (i, dir) =>
    setOpps((p) => {
      const arr = [...p];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });

  /* ── UI ── */

  return (
    <div className="admin-root">

      <div className="admin-topbar">
        <span className="admin-topbar__title">
          CURE CMS
        </span>

        <span className={`admin-status admin-status--${status.type}`}>
          {status.msg}
        </span>
      </div>

      <div className="admin-tokenbar">
        <input
          className="admin-tokenbar__input"
          placeholder="GitHub token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          className="admin-tokenbar__btn"
          onClick={fetchFile}
        >
          Load
        </button>
      </div>

      <div className="admin-body">

        <div className="admin-sidebar">
          {ALL_TABS.map((t, i) => (
            <button
              key={t}
              className={`admin-sidebar__tab ${
                i === activeTab
                  ? "admin-sidebar__tab--active"
                  : ""
              }`}
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
            <p className="admin-main__empty">
              Load file to begin editing
            </p>
          ) : isOppsTab ? (
            <div className="opps-grid">

              {opps.map((o, i) => (
                <div key={i} className="opp-card">

                  <div className="opp-actions">
                    <button onClick={() => moveOpp(i, -1)}>↑</button>
                    <button onClick={() => moveOpp(i, 1)}>↓</button>
                    <button onClick={() => removeOpp(i)}>✕</button>
                  </div>

                  <input
                    placeholder="Title"
                    value={o.title}
                    onChange={(e) =>
                      updateOpp(i, "title", e.target.value)
                    }
                  />
                  <input
                    placeholder="Org"
                    value={o.org}
                    onChange={(e) =>
                      updateOpp(i, "org", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={o.description}
                    onChange={(e) =>
                      updateOpp(
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="Link"
                    value={o.link}
                    onChange={(e) =>
                      updateOpp(i, "link", e.target.value)
                    }
                  />
                  <input
                    placeholder="Tag"
                    value={o.tag}
                    onChange={(e) =>
                      updateOpp(i, "tag", e.target.value)
                    }
                  />
                </div>
              ))}

              <button className="add-btn" onClick={addOpp}>
                + Add Opportunity
              </button>

            </div>
          ) : (
            FIELD_GROUPS[activeTab].fields.map((f) => (
              <div key={f.id} className="admin-field">
                <label className="admin-field__label">
                  {f.label}
                </label>

                {f.textarea ? (
                  <textarea
                    className="admin-field__textarea"
                    rows={f.rows || 3}
                    value={values[f.id] || ""}
                    onChange={(e) =>
                      set(f.id, e.target.value)
                    }
                  />
                ) : (
                  <input
                    className="admin-field__input"
                    value={values[f.id] || ""}
                    onChange={(e) =>
                      set(f.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="admin-footer">
        <input
          className="admin-footer__commit"
          value={commitMsg}
          onChange={(e) =>
            setCommitMsg(e.target.value)
          }
        />

        <button
          className={`admin-footer__save ${
            canSave
              ? "admin-footer__save--enabled"
              : "admin-footer__save--disabled"
          }`}
          onClick={saveFile}
        >
          Save
        </button>
      </div>
    </div>
  );
}