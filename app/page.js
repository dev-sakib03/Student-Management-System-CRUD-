"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Plus, GraduationCap, Menu, X, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import StudentTable from "@/components/StudentTable";
import StudentForm from "@/components/StudentForm";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/students", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not load students.");
      setStudents(result.data || []);
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesDepartment = department === "All" || student.department === department;
      const matchesSearch = !term || [student.name, student.email, student.phone, student.department]
        .some((value) => value?.toLowerCase().includes(term));
      return matchesDepartment && matchesSearch;
    });
  }, [students, search, department]);

  const stats = useMemo(() => ({
    total: students.length,
    departments: new Set(students.map((student) => student.department)).size,
    recent: students.filter((student) => Date.now() - new Date(student.createdAt).getTime() <= 7 * 86400000).length,
  }), [students]);

  function openCreateForm() {
    setSelectedStudent(null);
    setFormOpen(true);
  }

  function openEditForm(student) {
    setSelectedStudent(student);
    setFormOpen(true);
  }

  async function saveStudent(form) {
    setSaving(true);
    try {
      const editing = Boolean(selectedStudent);
      const endpoint = editing ? `/api/students/${selectedStudent._id}` : "/api/students";
      const response = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, message: result.message || "Unable to save student." };
      setFormOpen(false);
      setSelectedStudent(null);
      await loadStudents();
      showToast(result.message);
      return { success: true };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    const confirmed = window.confirm(`Delete ${student.name}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/students/${student._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to delete student.");
      setStudents((current) => current.filter((item) => item._id !== student._id));
      showToast(result.message);
    } catch (error) {
      showToast(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        {mobileMenu && (
          <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMobileMenu(false)}>
            <div className="h-full w-[270px] bg-white p-5" onClick={(event) => event.stopPropagation()}>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-bold">CampusFlow</span>
                <button onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={20} /></button>
              </div>
              <a href="#students" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700">Student directory</a>
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(true)} aria-label="Open menu" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white lg:hidden"><GraduationCap size={19} /></div>
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900">Overview</p>
                <p className="hidden text-[11px] text-slate-400 sm:block">Your student directory at a glance</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden text-xs font-medium text-slate-400 sm:block">Student workspace</span>
              <button type="button" aria-label="Notifications" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" /></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">AD</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-7 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">CampusFlow / Directory</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Student management</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">A clear view of your student records. Add, update and organize information in one place.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={loadStudents} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"><RefreshCw size={15} /> Refresh</button>
                <button type="button" onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"><Plus size={16} /> Add student</button>
              </div>
            </section>

            <StatsCards stats={stats} />

            <section className="relative overflow-hidden rounded-2xl bg-[#20265b] p-5 text-white sm:p-7">
              <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[36px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-28 right-44 h-52 w-52 rounded-full bg-indigo-400/10 blur-2xl" />
              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Keep everything in order</p>
                  <h2 className="mt-2 text-lg font-bold sm:text-xl">Your student records, organized.</h2>
                  <p className="mt-1 max-w-lg text-xs leading-5 text-indigo-100/70">One simple workspace for managing student information throughout the academic journey.</p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><GraduationCap size={28} /></div>
              </div>
            </section>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Directory overview</h2>
                <p className="mt-1 text-xs text-slate-400">Browse and manage registered student profiles</p>
              </div>
              <span className="rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">{students.length} records</span>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
                <p className="mt-3 text-xs text-slate-500">Loading student records...</p>
              </div>
            ) : (
              <StudentTable students={filteredStudents} search={search} setSearch={setSearch} department={department} setDepartment={setDepartment} onEdit={openEditForm} onDelete={deleteStudent} />
            )}

            <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-400 sm:flex-row">
              <span>© {new Date().getFullYear()} CampusFlow Student Management</span>
              <span>Built with Next.js · Tailwind CSS · MongoDB</span>
            </footer>
          </div>
        </div>
      </div>

      <StudentForm open={formOpen} onClose={() => { setFormOpen(false); setSelectedStudent(null); }} onSubmit={saveStudent} student={selectedStudent} saving={saving} />

      {toast && <div role="status" className="fixed bottom-5 right-5 z-[60] max-w-[calc(100%-2.5rem)] rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
    </main>
  );
}
