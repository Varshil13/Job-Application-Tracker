export default function PillButton({ variant = "light", children, ...props }) {
  const baseClasses =
    "w-full rounded-full border px-4 py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all";

  const variants = {
    light:
      "bg-white border-slate-200 hover:border-slate-400 hover:-translate-y-px hover:shadow-lg",
    solid:
      "bg-teal-600 text-white border-teal-700 shadow-lg shadow-teal-800/30 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-800/30",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
