import { GraduationCap, LayoutDashboard, Users, Settings2 } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">
      <a href="/" className="mb-12 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <GraduationCap size={22} />
        </span>
        <span>
          <span className="block text-[15px] font-bold tracking-tight text-slate-900">CampusFlow</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Student workspace</span>
        </span>
      </a>

      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
      <nav className="space-y-1">
        <a href="/" className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700">
          <LayoutDashboard size={18} /> Overview
        </a>
        <a href="#students" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
          <Users size={18} /> Students
        </a>
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <Settings2 size={18} />
        </div>
        <p className="text-xs font-semibold text-slate-800">Student records</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">A simple space to manage your academic directory.</p>
      </div>
    </aside>
  );
}
