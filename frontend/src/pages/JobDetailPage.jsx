import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CORE_STAGES = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "screen", label: "Screen" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
];

const TERMINAL_STATUSES = ["rejected", "withdrawn", "ghosted", "accepted"];
const STAGE_INDEX = { saved: 0, applied: 1, screen: 2, interview: 3, offer: 4 };
const STAGE_DATE_FIELD = {
  saved: "savedDate",
  applied: "appliedDate",
  screen: "screenDate",
  interview: "interviewDate",
  offer: "offerDate",
};

function todayISO() {
  return new Date().toISOString();
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.getDate() + 1}/${d.getMonth()}/${String(d.getFullYear()).slice(2)}`;
}

function detectWorkMode(job) {
  const values = [job?.workMode, job?.location, job?.description, job?.summary]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());

  const combined = values.join(" ");
  if (combined.includes("hybrid")) return "Hybrid";
  if (combined.includes("remote") || combined.includes("work from home")) {
    return "Remote";
  }
  if (
    combined.includes("on-site") ||
    combined.includes("onsite") ||
    combined.includes("in office") ||
    combined.includes("at office") ||
    combined.includes("physically present")
  ) {
    return "On-site";
  }
  return null;
}

function normalizeEligibilityValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return value > 0 ? String(value) : null;
  }

  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "0" || trimmed.toLowerCase() === "null") {
    return null;
  }
  return trimmed;
}

function Badge({ children, color = "teal" }) {
  const cls =
    color === "teal"
      ? "bg-teal-50 text-teal-700 border border-teal-200"
      : "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  if (!value || value === "null" || value === "N/A") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2 group"
      aria-pressed={enabled}
    >
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${enabled ? "bg-teal-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? "translate-x-4" : "translate-x-0"}`}
        />
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-500 group-hover:text-teal-600 transition-colors">
          {label}
        </span>
      )}
    </button>
  );
}

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
  );
}

function Overview({ job }) {
  if (!job)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <Skeleton className="h-24" />
        <Skeleton className="h-32" />
      </div>
    );

  const el = job.eligibility || {};
  const workMode = detectWorkMode(job);
  const gpaValue = normalizeEligibilityValue(el.minGPA ?? el.cgpa);
  const yearValue = normalizeEligibilityValue(el.year);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <InfoRow label="Location" value={job.location} />
        <InfoRow label="Stipend/Salary" value={job.salary} />
        <InfoRow label="Work Mode" value={workMode} />
        <InfoRow
          label="Job Type"
          value={
            job.jobType
              ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)
              : null
          }
        />
        <InfoRow
          label="Deadline"
          value={formatDate(job.applicationDeadline) || job.applicationDeadline}
        />
      </div>

      {job.portalLink && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            URL
          </span>
          <a
            href={job.portalLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-teal-600 hover:text-teal-800 underline underline-offset-2 transition-colors"
          >
            View Job Posting ↗
          </a>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Description
        </p>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div className="border border-slate-100 rounded-2xl p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Eligibility
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {el.degree && <InfoRow label="Degree" value={el.degree} />}
          {gpaValue && <InfoRow label="GPA/CGPA" value={gpaValue} />}
          {yearValue && <InfoRow label="Year" value={yearValue} />}
          {el.experience && (
            <InfoRow label="Experience" value={el.experience} />
          )}
        </div>
        {el.branches?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Branches
            </p>
            <div className="flex flex-wrap gap-2">
              {el.branches.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>
          </div>
        )}
        {el.skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {el.skills.map((s) => (
                <Badge key={s} color="slate">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Documents({ jobId }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        //documents required for that job
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/applications/getjobdetails/${jobId}`,
          {
            credentials: "include",
          },
        );
        if (!r.ok) throw new Error("Failed to fetch documents");
        const d = await r.json();
        setDocs(d.documents || []);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [jobId]);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );

  if (!docs.length)
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
        <svg
          className="w-10 h-10 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">No documents attached yet.</p>
      </div>
    );

  return (
    <ul className="space-y-3">
      {docs.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {doc.name}
            </span>
          </div>
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-teal-600 font-semibold hover:underline"
          >
            View
          </a>
        </li>
      ))}
    </ul>
  );
}

function ResumeMatch({ jobId, initialResult }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
      setLoading(false);
      return;
    }

    const fetchMatch = async () => {
      try {
        //run resume match for that jobid
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/resume/match/${jobId}`,
          {
            credentials: "include",
          },
        );
        if (!r.ok) throw new Error("Failed to fetch resume match");
        const d = await r.json();
        setResult(d.matchResult ?? d);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [jobId, initialResult]);

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-16" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );

  if (!result)
    return (
      <div className="text-slate-400 text-sm text-center mt-10">
        No resume match data available.
      </div>
    );

  const score = result.matchScore ?? result.score ?? 0;
  const color =
    score >= 75
      ? "text-teal-600"
      : score >= 50
        ? "text-amber-500"
        : "text-rose-500";
  const bar =
    score >= 75 ? "bg-teal-500" : score >= 50 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className={`text-5xl font-black ${color}`}>{score}%</div>
        <div className="flex-1">
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${bar} transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {result.eligible ? "✓ Eligible" : "✗ Not Eligible"}
          </p>
        </div>
      </div>

      {result.summary && (
        <p className="text-sm text-slate-700 leading-relaxed">
          {result.summary}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Strengths
            </p>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-teal-700 flex gap-2">
                  <span>✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.missingSkills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Missing Skills
            </p>
            <ul className="space-y-1">
              {result.missingSkills.map((s, i) => (
                <li key={i} className="text-sm text-rose-500 flex gap-2">
                  <span>✗</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result.suggestions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Suggestions
          </p>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2">
                <span className="text-teal-500 shrink-0">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Status Tracker ──────────────────────────────────────────────────────────
function StatusTracker({ jobId, onStatusChange }) {
  const [currentStageKey, setCurrentStageKey] = useState("saved");
  const [terminalStatus, setTerminalStatus] = useState(null);
  const [dates, setDates] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [tempDate, setTempDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // get status of that application
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}/status`,
          {
            credentials: "include",
          },
        );
        if (!r.ok) throw new Error("Failed to fetch status");
        const d = await r.json();

        const s = d.status?.toLowerCase() ?? "saved";
        if (TERMINAL_STATUSES.includes(s)) {
          setTerminalStatus(s);
          const lastCore = CORE_STAGES.slice()
            .reverse()
            .find((st) => d[STAGE_DATE_FIELD[st.key]]);
          setCurrentStageKey(lastCore?.key ?? "saved");
        } else {
          setCurrentStageKey(STAGE_INDEX[s] !== undefined ? s : "saved");
          setTerminalStatus(null);
        }
        const mapped = {};
        CORE_STAGES.forEach(({ key }) => {
          const val = d[STAGE_DATE_FIELD[key]];
          if (val) mapped[key] = val;
        });
        setDates(mapped);
      } catch {}
    };

    fetchStatus();
  }, [jobId]);

  const patch = async (status, extraDateField, extraDateValue) => {
    setSaving(true);
    const body = { status };
    if (extraDateField) body[extraDateField] = extraDateValue;
    try {
      //modify the status of application
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateStage = (stageKey) => {
    const newDates = { ...dates };
    if (!newDates[stageKey]) newDates[stageKey] = todayISO();
    setCurrentStageKey(stageKey);
    setTerminalStatus(null);
    setDates(newDates);
    onStatusChange?.(stageKey);
    patch(stageKey, STAGE_DATE_FIELD[stageKey], newDates[stageKey]);
  };

  const updateTerminalStatus = (ts) => {
    setTerminalStatus(ts);
    patch(ts);
    onStatusChange?.(ts);
  };

  const saveDate = (stageKey) => {
    const iso = tempDate ? new Date(tempDate).toISOString() : todayISO();
    const newDates = { ...dates, [stageKey]: iso };
    setDates(newDates);
    setEditingDate(null);
    patch(terminalStatus ?? currentStageKey, STAGE_DATE_FIELD[stageKey], iso);
  };

  const currentIdx = STAGE_INDEX[currentStageKey] ?? 0;

  return (
    <div>
      <div className="mb-5">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-2">
          Application Status
        </label>
        <div className="relative">
          <select
            value={terminalStatus ?? currentStageKey}
            onChange={(e) => {
              const val = e.target.value;
              if (TERMINAL_STATUSES.includes(val)) updateTerminalStatus(val);
              else updateStage(val);
            }}
            className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-white outline-none focus:ring-2 focus:ring-teal-400 pr-8"
          >
            {CORE_STAGES.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
            <optgroup label="────────────">
              {TERMINAL_STATUSES.map((ts) => (
                <option key={ts} value={ts}>
                  {ts.charAt(0).toUpperCase() + ts.slice(1)}
                </option>
              ))}
            </optgroup>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {saving && <p className="text-xs text-teal-600 mt-1">Saving…</p>}

        {terminalStatus && (
          <div
            className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              terminalStatus === "accepted"
                ? "bg-teal-50 text-teal-700 border border-teal-200"
                : terminalStatus === "offer"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {terminalStatus.charAt(0).toUpperCase() + terminalStatus.slice(1)}
          </div>
        )}
      </div>

      <div className="space-y-0">
        {CORE_STAGES.map(({ key, label }, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = key === currentStageKey && !terminalStatus;
          const dateVal = dates[key];

          return (
            <div key={key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => updateStage(key)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-1 ${
                    isCompleted
                      ? "bg-teal-600 border-teal-600"
                      : "bg-white border-slate-300 hover:border-teal-400"
                  }`}
                >
                  {isCompleted && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                {idx < CORE_STAGES.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-0.5 transition-colors duration-300 ${idx < currentIdx ? "bg-teal-400" : "bg-slate-200"}`}
                  />
                )}
              </div>

              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-semibold ${isCurrent ? "text-teal-700" : isCompleted ? "text-slate-700" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                  {dateVal ? (
                    <button
                      onClick={() => {
                        setEditingDate(key);
                        setTempDate("");
                      }}
                      className="text-xs text-slate-400 hover:text-teal-600 transition-colors flex items-center gap-1"
                    >
                      {formatDate(dateVal)}
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        setEditingDate(key);
                        setTempDate("");
                      }}
                      className="text-xs text-teal-500 hover:text-teal-700 font-medium"
                    >
                      + Add date
                    </button>
                  ) : null}
                </div>

                {editingDate === key && (
                  <div className="mt-2 flex gap-2 items-center">
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                      onClick={() => saveDate(key)}
                      className="text-xs bg-teal-600 text-white px-2 py-1 rounded-lg hover:bg-teal-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDate(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("saved");

  // Reminder toggle state — fetched from backend, saved on change
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // get application detail (from parsed body)
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/applications/getjobdetails/${jobId}`,
          {
            credentials: "include",
          },
        );
        if (!r.ok) throw new Error("Failed to fetch job details");
        const d = await r.json();
        const app = d.application ?? d;
        setJob({
          ...app,
          position: app.position ?? app.role,
          salary: app.salary ?? app.stipend ?? null,
          portalLink: app.portalLink ?? app.link,
          applicationDeadline: app.applicationDeadline ?? app.deadline,
          eligibility: app.eligibility ?? app.eligibilitySnapshot,
        });
        setCurrentStatus((app.status ?? "saved").toLowerCase());
      } catch (err) {
        console.error("Job fetch failed:", err);
        setJob(null);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        //made earlier
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}/status`,
          {
            credentials: "include",
          },
        );
        if (!r.ok) throw new Error("Failed to fetch current status");
        const d = await r.json();
        setCurrentStatus(d.status?.toLowerCase() ?? "saved");
      } catch {}
    };

    fetchCurrentStatus();
  }, [jobId]);

  // ── Fetch reminder state ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchReminderState = async () => {
      try {
        //for reminder
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/reminders/${jobId}`,
          {
            credentials: "include",
          },
        );
        const d = await r.json();
        setReminderEnabled(d.enabled ?? false);
      } catch {}
    };

    fetchReminderState();
  }, [jobId]);

  // ── Toggle reminder ────────────────────────────────────────────────────────
  const handleReminderToggle = async (newState) => {
    setReminderEnabled(newState);
    setReminderSaving(true);
    try {
      // to modify status of reminder
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/reminders/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newState }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setReminderSaving(false);
    }
  };

  const isSavedOnly = currentStatus === "saved";
  const [statusVersion, setStatusVersion] = useState(0);
  const handleDraft = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "applied", appliedDate: todayISO() }),
        },
      );
      setCurrentStatus("applied");
      setJob((prev) => ({
        ...prev,
        status: "applied",
        appliedDate: todayISO(),
      }));
      setStatusVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "saved" }),
        },
      );
      setCurrentStatus("saved"); // ✅ reflects in status badge
      setJob((prev) => ({ ...prev, status: "saved" }));
      setStatusVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      // delete application
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/applications/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const TABS = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: "resume",
      label: "Resume Match",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white font-[system-ui]">
      {/* ── Header ── */}
      <div className="border-b border-slate-100 px-4 sm:px-8 pt-6 pb-0 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 pb-4">
            <div>
              {jobLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {job?.position ?? "—"}
                    </h1>
                    {job?.jobType && (
                      <span className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {job.jobType}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        isSavedOnly
                          ? "bg-red-50 text-red-500 border-red-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {job?.company}
                  </p>
                </>
              )}
            </div>

            {/* Right side: reminder toggle + action buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
              {/* ── Reminder Email toggle ── */}
              {/* ── Reminder Email toggle ── */}
              <div className="flex items-center gap-1.5 text-sm text-teal-600  bg-teal-50  border border-teal-200  px-3 py-1.5 rounded-xl transition-colors font-medium">
                <svg
                  className="w-4 h-4" // match size
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* svg path */}
                </svg>

                <span className="hidden sm:inline">Smart Reminder</span>

                <ToggleSwitch
                  enabled={reminderEnabled}
                  onChange={handleReminderToggle}
                />
              </div>

              {isSavedOnly ? (
                <button
                  onClick={handleDraft}
                  className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 hover:border-teal-300 px-3 py-1.5 rounded-xl transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Apply</span>
                </button>
              ) : (
                <button
                  onClick={handleArchive}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Archive</span>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-300 px-3 py-1.5 rounded-xl transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          {/* Tabs — no Reminder Email tab */}
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — main content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {activeTab === "overview" && "Job Posting"}
                {activeTab === "resume" && "Resume Match Analysis"}
              </h2>

              {activeTab === "overview" && (
                <Overview job={jobLoading ? null : job} />
              )}
              {activeTab === "resume" && (
                <ResumeMatch jobId={jobId} initialResult={job?.matchResult} />
              )}
            </div>
          </div>

          {/* Right — status sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <StatusTracker
                jobId={jobId}
                key={statusVersion}
                onStatusChange={(s) => setCurrentStatus(s)}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease; }
      `}</style>
    </div>
  );
}
