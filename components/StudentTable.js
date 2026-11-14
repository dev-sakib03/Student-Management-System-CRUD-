"use client";

import { Edit3, Trash2, Search, Users, ChevronDown } from "lucide-react";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

const avatarColors = ["bg-indigo-100 text-indigo-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-sky-100 text-sky-700", "bg-rose-100 text-rose-700"];

export default function StudentTable({ students, search, setSearch, department, setDepartment, onEdit, onDelete }) {
  const departments = [...new Set(students.map((student) => student.department))].sort();

  return (
    <section id="students" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/70">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Student directory</h2>
          <p className="mt-1 text-xs text-slate-500">Manage and organize all registered students.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 px-3 sm:w-64">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400" />
          </label>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3">
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="max-w-[190px] bg-transparent text-xs text-slate-600 outline-none">
              <option value="All">All departments</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none text-slate-400" />
          </label>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Users size={25} /></span>
          <h3 className="mt-4 text-sm font-bold text-slate-800">No students found</h3>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Try changing your search or department filter, or add a new student.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, index) => (
                  <tr key={student._id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${avatarColors[index % avatarColors.length]}`}>{initials(student.name)}</span>
                        <span className="whitespace-nowrap text-sm font-semibold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{student.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{student.phone}</td>
                    <td className="px-5 py-4"><span className="inline-flex whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">{student.department}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><Edit3 size={16} /></button>
                        <button type="button" onClick={() => onDelete(student)} aria-label={`Delete ${student.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">Showing <span className="font-semibold text-slate-600">{students.length}</span> student{students.length === 1 ? "" : "s"}</div>
        </>
      )}
    </section>
  );
}
