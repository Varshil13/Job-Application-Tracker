import { useState } from "react";

const INTEGRATIONS = [
  {
    name: "Google Drive",
    bg: "white",
    icon: (
      <svg viewBox="0 0 87.3 78" width="32" height="32">
        <path
          d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
          fill="#0066da"
        />
        <path
          d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"
          fill="#00ac47"
        />
        <path
          d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 11.5z"
          fill="#ea4335"
        />
        <path
          d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
          fill="#00832d"
        />
        <path
          d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
          fill="#2684fc"
        />
        <path
          d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z"
          fill="#ffba00"
        />
      </svg>
    ),
  },
  {
    name: "Adobe CC",
    bg: "white",
    icon: (
      <svg viewBox="0 0 100 100" width="34" height="34">
        <rect width="100" height="100" rx="14" fill="#FF0000" />
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontSize="46"
          fontWeight="bold"
          fill="white"
          fontFamily="serif"
        >
          Ai
        </text>
      </svg>
    ),
  },
  {
    name: "Jira",
    bg: "white",
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32">
        <defs>
          <linearGradient id="jg" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2684FF" />
            <stop offset="100%" stopColor="#0052CC" />
          </linearGradient>
        </defs>
        <path
          d="M15.53 1.6 8.16 9l4.1 4.1 3.27-3.27 7.37 7.36-4.1 4.1 7.37 7.38 7.36-7.37a2.77 2.77 0 0 0 0-3.91z"
          fill="#2684FF"
        />
        <path
          d="M15.53 16.42 11.43 12.32l-3.27 3.27-4.1-4.1L.69 18.86a2.77 2.77 0 0 0 0 3.91L8.07 30.15 15.43 22.79 11.33 18.69Z"
          fill="url(#jg)"
        />
      </svg>
    ),
  },
  {
    name: "Gmail",
    bg: "white",
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <path fill="#EA4335" d="M6 40h6V22.5L4 16.5V38c0 1.1.9 2 2 2z" />
        <path fill="#34A853" d="M36 40h6c1.1 0 2-.9 2-2V16.5l-8 6z" />
        <path
          fill="#FBBC05"
          d="M36 10l-12 9L12 10 4 16l8 6.5 12-9 12 9 8-6.5z"
        />
        <path fill="#4285F4" d="M4 16l8 6.5V10z" />
        <path fill="#C5221F" d="M44 10l-8 6.5V10z" />
      </svg>
    ),
  },
  {
    name: "Figma",
    bg: "white",
    icon: (
      <svg viewBox="0 0 38 57" width="26" height="34">
        <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19H19z" fill="#1ABCFE" />
        <path
          d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 0 1 0 47.5z"
          fill="#0ACF83"
        />
        <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19z" fill="#FF7262" />
        <path
          d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"
          fill="#F24E1E"
        />
        <path
          d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"
          fill="#FF7262"
        />
      </svg>
    ),
  },
  {
    name: "Outlook",
    bg: "white",
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <rect x="6" y="6" width="22" height="36" rx="3" fill="#0072C6" />
        <rect x="20" y="14" width="22" height="28" rx="2" fill="#0078D4" />
        <path d="M20 14h22v4L20 26z" fill="#50A0DC" />
        <ellipse cx="17" cy="24" rx="6" ry="7" fill="white" opacity="0.9" />
      </svg>
    ),
  },
  {
    name: "Slack",
    bg: "white",
    icon: (
      <svg viewBox="0 0 122.8 122.8" width="32" height="32">
        <path
          d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9z"
          fill="#E01E5A"
        />
        <path
          d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9z"
          fill="#36C5F0"
        />
        <path
          d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9z"
          fill="#2EB67D"
        />
        <path
          d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9z"
          fill="#ECB22E"
        />
      </svg>
    ),
  },
  {
    name: "Notion",
    bg: "white",
    icon: (
      <svg viewBox="0 0 100 100" width="30" height="30">
        <rect
          width="100"
          height="100"
          rx="12"
          fill="#fff"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          d="M28 22h44l-6 8H28V22zm0 0v56l10-8V30zm44 0v38l-10 10V30z"
          fill="#1a1a1a"
        />
      </svg>
    ),
  },
  {
    name: "Salesforce",
    bg: "white",
    icon: (
      <svg viewBox="0 0 64 64" width="34" height="34">
        <ellipse cx="32" cy="42" rx="24" ry="14" fill="#00A1E0" />
        <circle cx="18" cy="28" r="9" fill="#00A1E0" />
        <circle cx="46" cy="26" r="11" fill="#00A1E0" />
        <circle cx="32" cy="22" r="13" fill="#00A1E0" />
        <text
          x="32"
          y="47"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          salesforce
        </text>
      </svg>
    ),
  },
  {
    name: "Support",
    bg: "#22c55e",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28">
        <path
          d="M24 6C14 6 6 14 6 24v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-6a4 4 0 0 0-4-4h-2v-2c0-6.6 5.4-12 12-12s12 5.4 12 12v2h-2a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V24c0-10-8-18-18-18z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: "HubSpot",
    bg: "white",
    icon: (
      <svg viewBox="0 0 60 60" width="32" height="32">
        <circle cx="42" cy="18" r="8" fill="#FF7A59" />
        <circle cx="18" cy="32" r="6" fill="#FF7A59" />
        <circle cx="42" cy="46" r="6" fill="#FF7A59" />
        <line
          x1="42"
          y1="26"
          x2="42"
          y2="40"
          stroke="#FF7A59"
          strokeWidth="3"
        />
        <line
          x1="24"
          y1="32"
          x2="36"
          y2="22"
          stroke="#FF7A59"
          strokeWidth="3"
        />
        <line
          x1="24"
          y1="36"
          x2="36"
          y2="44"
          stroke="#FF7A59"
          strokeWidth="3"
        />
      </svg>
    ),
  },
  {
    name: "Intercom",
    bg: "#1a1a1a",
    icon: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <rect x="8" y="10" width="4" height="18" rx="2" fill="white" />
        <rect x="15" y="7" width="4" height="22" rx="2" fill="white" />
        <rect x="22" y="10" width="4" height="18" rx="2" fill="white" />
        <rect x="29" y="13" width="4" height="14" rx="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "Calendar",
    bg: "white",
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <rect x="4" y="8" width="40" height="36" rx="4" fill="#1a73e8" />
        <rect x="4" y="8" width="40" height="14" rx="4" fill="#4285F4" />
        <rect x="4" y="18" width="40" height="4" fill="#4285F4" />
        <text
          x="24"
          y="38"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="white"
          fontFamily="sans-serif"
        >
          31
        </text>
        <rect x="14" y="4" width="4" height="8" rx="2" fill="#5f6368" />
        <rect x="30" y="4" width="4" height="8" rx="2" fill="#5f6368" />
      </svg>
    ),
  },
  {
    name: "MongoDB",
    bg: "white",
    icon: (
      <svg viewBox="0 0 40 60" width="22" height="32">
        <path
          d="M20 2C10 16 6 24 6 32c0 7.7 6.3 14 14 14s14-6.3 14-14c0-8-4-16-14-30z"
          fill="#4DB33D"
        />
        <path
          d="M20 46v10"
          stroke="#4DB33D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const DOUBLED = [...INTEGRATIONS, ...INTEGRATIONS];

// ─── Shared sub-components ──────────────────────────────────────────────────

function LogoMark({ size = 34 }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "#0f766e",
        borderRadius: size * 0.26,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.52}
        height={size * 0.52}
        fill="none"
      >
        <circle cx="8" cy="8" r="3" fill="white" />
        <circle cx="16" cy="8" r="3" fill="white" opacity="0.65" />
        <circle cx="8" cy="16" r="3" fill="white" opacity="0.65" />
        <circle cx="16" cy="16" r="3" fill="white" />
      </svg>
    </div>
  );
}

function Badge({ children, dark = false }) {
  return (
    <span
      className="inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase font-dm"
      style={{
        background: dark ? "rgba(15,118,110,0.25)" : "#f0fdfa",
        color: dark ? "#5eead4" : "#0f766e",
      }}
    >
      {children}
    </span>
  );
}

// ─── Navbar ─────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16"
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <LogoMark />
        <span
          className="font-sora font-bold text-lg"
          style={{ color: "#0f766e" }}
        >
          AppTrack
        </span>
      </div>

      {/* Links */}
      <ul className="flex gap-8 list-none m-0 p-0">
        {["Features", "Integrations", "Pricing", "Blog"].map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm font-medium font-dm transition-colors duration-150 hover:text-teal"
              style={{ color: "#475569", textDecoration: "none" }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <button
          className="text-sm font-medium font-dm bg-transparent border-none cursor-pointer"
          style={{ color: "#475569" }}
        >
          Log in
        </button>
        <button
          className="text-sm font-semibold font-dm text-white rounded-lg px-5 py-2.5 border-none cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
          style={{
            background: "#0f766e",
            boxShadow: "0 2px 10px rgba(15,118,110,0.25)",
          }}
        >
          Get free demo
        </button>
      </div>
    </nav>
  );
}

// ─── Floating Hero Cards ─────────────────────────────────────────────────────

function TaskCard() {
  const tasks = [
    { label: "New Ideas for campaign", pct: 65, color: "#0f766e" },
    { label: "Design PPT #4", pct: 100, color: "#14b8a6" },
  ];
  return (
    <div
      className="animate-float rounded-2xl font-dm"
      style={{
        background: "white",
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(15,118,110,0.11)",
        minWidth: 230,
      }}
    >
      <p
        className="text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: "#0f766e" }}
      >
        Today's tasks
      </p>
      {tasks.map((t) => (
        <div key={t.label} className="mb-3">
          <div
            className="flex justify-between text-xs mb-1"
            style={{ color: "#334155" }}
          >
            <span>{t.label}</span>
            <span className="font-semibold" style={{ color: t.color }}>
              {t.pct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "#e2e8f0" }}>
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${t.pct}%`, background: t.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function NoteCard() {
  return (
    <div
      className="animate-float2 rounded-xl font-dm text-xs leading-relaxed"
      style={{
        background: "#fef9c3",
        padding: "14px 16px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
        maxWidth: 190,
        transform: "rotate(-2.5deg)",
        color: "#713f12",
      }}
    >
      Take notes to keep track of crucial details and accomplish more tasks with
      ease.
    </div>
  );
}

function ReminderCard() {
  return (
    <div
      className="animate-float3 rounded-xl font-dm"
      style={{
        background: "white",
        padding: "12px 16px",
        boxShadow: "0 6px 24px rgba(15,118,110,0.11)",
        minWidth: 178,
        transform: "rotate(1.5deg)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="rounded-lg p-1" style={{ background: "#f0fdfa" }}>
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2.2"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
        </div>
        <span className="text-sm font-semibold" style={{ color: "#0f766e" }}>
          Reminders
        </span>
      </div>
      <div
        className="text-xs rounded-lg px-2.5 py-1.5"
        style={{
          background: "#f8fafc",
          borderLeft: "2.5px solid #0f766e",
          color: "#475569",
        }}
      >
        <p className="font-semibold mb-0.5" style={{ color: "#0f172a" }}>
          Today's Meeting
        </p>
        <p>🕙 10:00 – 11:00</p>
      </div>
    </div>
  );
}

function IntegrationPill() {
  return (
    <div
      className="flex items-center gap-3 rounded-xl font-dm"
      style={{
        background: "white",
        padding: "12px 18px",
        boxShadow: "0 6px 24px rgba(15,118,110,0.11)",
      }}
    >
      <div className="flex gap-1.5">
        {[
          ["#ea4335", "✉"],
          ["#611f69", "S"],
          ["#1a73e8", "31"],
        ].map(([bg, label]) => (
          <div
            key={label}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white"
            style={{ background: bg, fontSize: 9, fontWeight: 700 }}
          >
            {label}
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: "#0f766e" }}>
          100+ Integrations
        </p>
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          Connect your tools
        </p>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        padding: "110px 6% 80px",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, #ccfbf1 0%, transparent 65%), #f8fafc",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0f766e22 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating cards */}
      <div className="absolute" style={{ top: 120, left: "6%" }}>
        <NoteCard />
      </div>
      <div className="absolute" style={{ top: 110, right: "7%" }}>
        <ReminderCard />
      </div>
      <div className="absolute" style={{ bottom: 90, left: "5%" }}>
        <TaskCard />
      </div>
      <div className="absolute" style={{ bottom: 110, right: "6%" }}>
        <IntegrationPill />
      </div>

      {/* Center logo tile */}
      <div
        className="animate-fadeUp mb-7"
        style={{ animationDelay: "0.1s", opacity: 0 }}
      >
        <div
          className="grid grid-cols-2 grid-rows-2 gap-1.5 rounded-2xl"
          style={{
            width: 54,
            height: 54,
            background: "white",
            padding: 12,
            boxShadow: "0 4px 24px rgba(15,118,110,0.15)",
          }}
        >
          {["#0f766e", "#14b8a6", "#5eead4", "#0f766e"].map((c, i) => (
            <div key={i} className="rounded-sm" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Headline */}
      <h1
        className="animate-fadeUp font-sora font-extrabold text-center"
        style={{
          fontSize: "clamp(2.4rem,5.5vw,4rem)",
          lineHeight: 1.1,
          color: "#0f172a",
          maxWidth: 680,
          marginBottom: 6,
          animationDelay: "0.2s",
          opacity: 0,
        }}
      >
        Think, plan, and track
      </h1>
      <h2
        className="animate-fadeUp font-sora font-bold text-center"
        style={{
          fontSize: "clamp(2.1rem,5vw,3.7rem)",
          lineHeight: 1.1,
          color: "#94a3b8",
          maxWidth: 680,
          marginBottom: 22,
          animationDelay: "0.3s",
          opacity: 0,
        }}
      >
        all in one place
      </h2>

      {/* Subtext */}
      <p
        className="animate-fadeUp font-dm text-center"
        style={{
          fontSize: "1.05rem",
          color: "#64748b",
          maxWidth: 440,
          marginBottom: 36,
          lineHeight: 1.65,
          animationDelay: "0.4s",
          opacity: 0,
        }}
      >
        Efficiently manage your tasks, track applications, and boost
        productivity — all from a single beautiful dashboard.
      </p>

      {/* CTA buttons */}
      <div
        className="animate-fadeUp flex gap-3"
        style={{ animationDelay: "0.5s", opacity: 0 }}
      >
        <button
          className="font-dm font-semibold text-white rounded-xl border-none cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
          style={{
            padding: "13px 30px",
            fontSize: "0.95rem",
            background: "#0f766e",
            boxShadow: "0 4px 18px rgba(15,118,110,0.28)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 8px 26px rgba(15,118,110,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 4px 18px rgba(15,118,110,0.28)")
          }
        >
          Get free demo
        </button>
        <button
          className="font-dm font-semibold rounded-xl cursor-pointer transition-colors duration-150 hover:bg-teal-faint"
          style={{
            padding: "13px 28px",
            fontSize: "0.95rem",
            background: "white",
            color: "#0f766e",
            border: "1.5px solid #0f766e",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdfa")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          Learn more →
        </button>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

const ICON = (path) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="#0f766e"
    strokeWidth="2"
  >
    {path}
  </svg>
);

const FEATURES = [
  {
    title: "Smart Task Board",
    desc: "Drag, assign, and prioritize with a Kanban board built for speed.",
    icon: ICON(
      <>
        <rect x="3" y="3" width="7" height="18" rx="2" />
        <rect x="14" y="3" width="7" height="10" rx="2" />
        <rect x="14" y="17" width="7" height="4" rx="2" />
      </>,
    ),
  },
  {
    title: "Progress Tracking",
    desc: "Visual progress bars and milestones keep the whole team aligned.",
    icon: ICON(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  },
  {
    title: "Smart Reminders",
    desc: "Never miss a deadline with intelligent, context-aware reminders.",
    icon: ICON(
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>,
    ),
  },
  {
    title: "Team Collaboration",
    desc: "Comment, mention, and share files right inside your tasks.",
    icon: ICON(
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>,
    ),
  },
  {
    title: "Analytics Dashboard",
    desc: "Get real-time insights on velocity, blockers, and team performance.",
    icon: ICON(
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>,
    ),
  },
  {
    title: "100+ Integrations",
    desc: "Connect Gmail, Slack, Jira, Figma, and everything else you love.",
    icon: ICON(
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>,
    ),
  },
];

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl p-7 border cursor-default transition-all duration-200"
      style={{
        background: "white",
        borderColor: "#e2e8f0",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(15,118,110,0.13)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "#f0fdfa" }}
      >
        {icon}
      </div>
      <h3
        className="font-sora font-bold text-base mb-2"
        style={{ color: "#0f172a" }}
      >
        {title}
      </h3>
      <p
        className="font-dm text-sm leading-relaxed m-0"
        style={{ color: "#64748b" }}
      >
        {desc}
      </p>
    </div>
  );
}

function Features() {
  return (
    <section className="px-16 py-20" style={{ background: "#f8fafc" }}>
      <div className="text-center mb-14">
        <Badge>Features</Badge>
        <h2
          className="font-sora font-extrabold mt-4"
          style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", color: "#0f172a" }}
        >
          Everything your team needs
        </h2>
        <p
          className="font-dm mt-3 mx-auto"
          style={{ color: "#64748b", maxWidth: 420, lineHeight: 1.65 }}
        >
          One workspace for tasks, notes, reminders, and real-time
          collaboration.
        </p>
      </div>
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

// ─── Integrations Marquee Row ─────────────────────────────────────────────────

function MarqueeRow({ items, reverse = false }) {
  return (
    <div className="overflow-hidden mb-3.5">
      <div
        className={reverse ? "animate-marqueeRev" : "animate-marquee"}
        style={{
          display: "flex",
          gap: 14,
          width: "max-content",
          transform: reverse ? "translateX(-6%)" : undefined,
        }}
      >
        {items.map((app, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
            style={{
              width: 72,
              height: 72,
              background: app.bg,
              boxShadow: "0 2px 14px rgba(0,0,0,0.18)",
            }}
          >
            {app.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: "#0f172a", overflow: "hidden" }}>
      <div className="pt-16">
        <div className="text-center mb-10">
          <Badge dark>Integrations</Badge>
          <h2
            className="font-sora font-extrabold mt-4 text-white"
            style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}
          >
            Connect your favorite apps
          </h2>
          <p
            className="font-dm mt-2.5"
            style={{ color: "#94a3b8", fontSize: "0.95rem" }}
          >
            100+ integrations to supercharge your workflow
          </p>
        </div>

        <MarqueeRow items={DOUBLED} />
        <MarqueeRow items={[...DOUBLED].reverse()} reverse />

        <div className="mb-14" />
      </div>

      {/* Bottom bar */}
      <div className="px-16 py-8" style={{ borderTop: "1px solid #1e293b" }}>
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span
              className="font-sora font-bold text-lg"
              style={{ color: "#0f766e" }}
            >
              AppTrack
            </span>
          </div>

          <div className="flex gap-7">
            {["Privacy", "Terms", "Contact", "Docs"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-dm text-sm transition-colors duration-150 hover:text-teal-light"
                style={{ color: "#64748b", textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-dm text-sm m-0" style={{ color: "#475569" }}>
            © 2025 AppTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="font-dm">
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
