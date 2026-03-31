import { FileText, BriefcaseBusiness, LogOut } from "lucide-react";

export default function WorkspaceLayout({
  activeSection,
  setActiveSection,
  onLogout,
  applicationsPanel,
  children,
}) {
  return (
    <div className="flex w-full gap-6">
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col justify-between rounded-3xl border border-[#0d635d] bg-[#0f766e] p-5 shadow-sm lg:flex">
        <div>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6fffa]/80">
              Job Tracker
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#e6fffa]">Workspace</h2>
            <p className="mt-2 text-sm text-[#e6fffa]/85">
              Manage your documents and applications in one place.
            </p>
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setActiveSection("vault");
                // navigate("/docs");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                activeSection === "vault"
                  ? "bg-[#e6fffa] text-[#0f766e] shadow-md"
                  : "text-[#e6fffa] hover:bg-[#0d635d]"
              }`}
            >
              <FileText size={18} />
              Document Vault
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection("applications");
                // navigate("/applications");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                activeSection === "applications"
                  ? "bg-[#e6fffa] text-[#0f766e] shadow-md"
                  : "text-[#e6fffa] hover:bg-[#0d635d]"
              }`}
            >
              <BriefcaseBusiness size={18} />
              Applications
            </button>
          </nav>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-[#0d635d] bg-[#e6fffa] px-4 py-3 text-sm font-semibold text-[#0f766e] transition hover:bg-[#ccf7ef]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-5 flex gap-2 rounded-2xl border border-[#0d635d] bg-[#0f766e] p-2 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveSection("vault")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              activeSection === "vault"
                ? "bg-[#e6fffa] text-[#0f766e]"
                : "text-[#e6fffa] hover:bg-[#0d635d]"
            }`}
          >
            Document Vault
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("applications")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              activeSection === "applications"
                ? "bg-[#e6fffa] text-[#0f766e]"
                : "text-[#e6fffa] hover:bg-[#0d635d]"
            }`}
          >
            Applications
          </button>
        </div>

        {activeSection === "applications" ? applicationsPanel : children}
      </div>
    </div>
  );
}
