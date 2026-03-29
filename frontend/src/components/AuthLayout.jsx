export default function AuthLayout({
  title,
  subtitle,
  activeTab,
  onTabChange,
  children,
}) {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.14),transparent_45%),radial-gradient(circle_at_78%_10%,rgba(14,165,233,0.12),transparent_40%)]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-800/10 p-7">
        <div className="mb-4">
   
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 leading-relaxed mt-1.5">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 mb-5">
          <button
            onClick={() => onTabChange("signin")}
            className={`px-3 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === "signin"
                ? "bg-gradient-to-r from-teal-50/50 to-white shadow-md shadow-slate-800/5 text-slate-800"
                : "text-slate-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onTabChange("signup")}
            className={`px-3 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === "signup"
                ? "bg-gradient-to-r from-teal-50/50 to-white shadow-md shadow-slate-800/5 text-slate-800"
                : "text-slate-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
