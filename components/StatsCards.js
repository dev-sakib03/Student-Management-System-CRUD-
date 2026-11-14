import { Users, Building2, UserPlus, Activity } from "lucide-react";

const items = [
  { label: "Total students", key: "total", icon: Users, color: "bg-indigo-50 text-indigo-600" },
  { label: "Departments", key: "departments", icon: Building2, color: "bg-emerald-50 text-emerald-600" },
  { label: "Recently added", key: "recent", icon: UserPlus, color: "bg-amber-50 text-amber-600" },
  { label: "Directory status", key: "status", icon: Activity, color: "bg-sky-50 text-sky-600" },
];

export default function StatsCards({ stats }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, key, icon: Icon, color }) => (
        <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={19} /></span>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            {key === "total" ? stats.total : key === "departments" ? stats.departments : key === "recent" ? stats.recent : "Active"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {key === "recent" ? "Added in the last 7 days" : key === "status" ? "Database-connected directory" : "Live directory overview"}
          </p>
        </article>
      ))}
    </section>
  );
}
