import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
const TIMELINE_STEPS = ["Saved", "Applied", "Screen", "Interview", "Offer"];

const stepIndex = (status) => {
  const map = { Saved: 0, Applied: 1, Screen: 2, Interview: 3, Offer: 4 };
  return map[status] ?? -1;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
};

function StatusDropdown({ current, onChange, appId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = ["Saved", "Applied", "Screen", "Interview", "Offer"];
  const terminal = ["Withdrawn", "Ghosted", "Rejected", "Accepted"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-36 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
      >
        {current}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d={open ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[148px] overflow-hidden py-1">
          {active.map((s) => (
            <DropdownItem
              key={s}
              label={s}
              active={current === s}
              onClick={() => {
                onChange(appId, s);
                setOpen(false);
              }}
            />
          ))}
          <div className="h-px bg-slate-100 my-1 mx-2" />
          {terminal.map((s) => (
            <DropdownItem
              key={s}
              label={s}
              active={current === s}
              onClick={() => {
                onChange(appId, s);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm transition-colors
        ${active ? "text-teal-700 font-semibold bg-teal-50" : "text-slate-600 hover:bg-slate-50"}`}
    >
      {active ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="#0f766e"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="w-3" />
      )}
      {label}
    </div>
  );
}

function Timeline({ app }) {
  const activeIdx = stepIndex(app.status);
  const isTerminal = ["Withdrawn", "Ghosted", "Rejected", "Accepted"].includes(
    app.status,
  );
  const dates = [
    app.saved_at,
    app.applied_at,
    app.screen_at,
    app.interview_at,
    app.offer_at,
  ];

  const steps = TIMELINE_STEPS.map((step, i) => ({
    step,
    i,
    filled: !isTerminal && activeIdx >= i,
    date: dates[i],
  }));

  return (
    <div className="flex-1 flex flex-col gap-0.5 justify-center">
      <div className="flex items-end">
        {steps.map(({ step, i }) => (
          <div key={step} className="flex items-center">
            <div className="w-4 flex justify-center">
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                {step}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-12" />}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        {steps.map(({ step, i, filled }) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full shrink-0 transition-colors ${filled ? "bg-teal-700" : "bg-slate-200 border-2 border-slate-300"}`}
            />
            {i < steps.length - 1 && (
              <div
                className={`w-12 border-t-2 border-dashed transition-colors ${!isTerminal && activeIdx > i ? "border-teal-700" : "border-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-start">
        {steps.map(({ step, i, filled, date }) => (
          <div key={step} className="flex items-center">
            <div className="w-4 flex justify-center">
              <span
                className={`text-[10px] whitespace-nowrap ${filled && date ? "text-teal-700" : "text-transparent"}`}
              >
                {formatDate(date) || "·"}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-12" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppCard({ app, onStatusChange }) {
  const [flyData, setFlyData] = useState(null);

  const circleLeft = (idx) => 292 + idx * 64;

  const handleChange = (id, newStatus) => {
    const fromIdx = stepIndex(app.status);
    const toIdx = stepIndex(newStatus);
    if (fromIdx >= 0 && toIdx >= 0 && fromIdx !== toIdx) {
      const dx = (toIdx - fromIdx) * 64;
      const animKey = Date.now();
      setFlyData({ fromIdx, dx, animKey });
      setTimeout(() => setFlyData(null), 650);
    }
    onStatusChange(id, newStatus);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200 relative">
      {flyData && (
        <>
          <style>{`
            @keyframes plane-${flyData.animKey} {
              0%   { transform: translateX(0px) translateY(0px) rotate(-10deg); opacity: 1; }
              60%  { opacity: 1; }
              100% { transform: translateX(${flyData.dx}px) translateY(-8px) rotate(-10deg); opacity: 0; }
            }
          `}</style>
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: circleLeft(flyData.fromIdx),
              top: "50%",
              transform: "translateY(-50%)",
              animation: `plane-${flyData.animKey} 0.6s ease-in forwards`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="#0f766e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="#0f766e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#ccfbf1"
              />
            </svg>
          </div>
        </>
      )}

      <div className="min-w-[176px]">
        <p className="text-sm font-semibold text-slate-800 leading-tight">
          {app.role}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{app.company}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1C3.34 1 2 2.34 2 4C2 6.5 5 9 5 9C5 9 8 6.5 8 4C8 2.34 6.66 1 5 1ZM5 5C4.45 5 4 4.55 4 4C4 3.45 4.45 3 5 3C5.55 3 6 3.45 6 4C6 4.55 5.55 5 5 5Z"
              fill="#94a3b8"
            />
          </svg>
          <span className="text-[11px] text-slate-400">{app.location}</span>
        </div>
      </div>
      <Timeline app={app} />
      <StatusDropdown
        current={app.status}
        onChange={handleChange}
        appId={app.id}
      />
    </div>
  );
}

function StatCard({ label, count, accent, icon }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm min-w-[148px]">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          {count}
        </p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
const STATUS_MAP = {
  saved: "Saved",
  applied: "Applied",
  screen: "Screen",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
};
const mapStatus = (s) => STATUS_MAP[s] || "Saved";

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/applications/getall`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((app) => ({
          id: app._id,
          role: app.role,
          company: app.company,
          location: app.location ?? "Not specified",
          status: mapStatus(app.status),
          pending: ["saved", "applied"].includes(app.status) ? "yes" : "no",
          saved_at: app.savedDate || null,
          applied_at: app.appliedDate || null,
          screen_at: app.screenDate || null,
          interview_at: app.interviewDate || null,
          offer_at: app.offerDate || null,
        }));
        setApplications(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const REVERSE_STATUS_MAP = {
    Saved: "saved",
    Applied: "applied",
    Screen: "screen",
    Interview: "interview",
    Offer: "offer",
    Withdrawn: "withdrawn",
    Ghosted: "ghosted",
    Rejected: "rejected",
    Accepted: "accepted",
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              pending: ["Saved", "Applied"].includes(newStatus) ? "yes" : "no",
            }
          : app,
      ),
    );
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/applications/modify/${id}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: REVERSE_STATUS_MAP[newStatus] }),
      },
    ).catch(console.error);
  };
  const pendingCount = applications.filter((a) => a.pending === "yes").length;
  const appliedCount = applications.filter((a) => a.pending === "no").length;

  return (
    <div className="min-h-screen bg-slate-50 px-12 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-9">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-slate-400">Hi,</span>
            <span className="text-2xl font-bold text-slate-800">
              {authUser?.name || "User"}
            </span>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Consistency is the bridge between where you are and where you want
            to be —{" "}
            <span className="text-teal-700 font-medium">
              keep showing up, every application counts.
            </span>
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <StatCard
            label="Pending"
            count={loading ? "—" : pendingCount}
            accent="bg-amber-50"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="7.5"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 5.5V9.5L11.5 11"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Applied"
            count={loading ? "—" : appliedCount}
            accent="bg-teal-50"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 9.5L7 13.5L15 5"
                  stroke="#0f766e"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-20 border border-slate-100 animate-pulse"
                />
              ))
            : applications.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onStatusChange={handleStatusChange}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
