"use client";

import { useEffect, useState } from "react";
import { X, UserRound, Mail, Phone, Building2 } from "lucide-react";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Business Administration",
  "Civil Engineering",
  "Mechanical Engineering",
  "Other",
];

const emptyForm = { name: "", email: "", phone: "", department: "" };

export default function StudentForm({ open, onClose, onSubmit, student, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(student ? {
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        department: student.department || "",
      } : emptyForm);
      setError("");
    }
  }, [open, student]);

  if (!open) return null;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.department) {
      setError("Please complete all four fields.");
      return;
    }

    const result = await onSubmit(form);
    if (!result?.success) setError(result?.message || "Something went wrong.");
  }

  const fields = [
    { name: "name", label: "Full name", placeholder: "e.g. Alex Morgan", icon: UserRound, type: "text" },
    { name: "email", label: "Email address", placeholder: "alex@university.edu", icon: Mail, type: "email" },
    { name: "phone", label: "Phone number", placeholder: "+880 1XXXXXXXXX", icon: Phone, type: "tel" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[3px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="student-form-title" className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">{student ? "Update record" : "New registration"}</p>
            <h2 id="student-form-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900">{student ? "Edit student" : "Add a student"}</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the student's details below.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6 sm:px-7">
          {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
            <label key={name} className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">{label}</span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50">
                <Icon size={17} className="shrink-0 text-slate-400" />
                <input required name={name} type={type} value={form[name]} onChange={updateField} placeholder={placeholder} className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              </span>
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-700">Department</span>
            <span className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50">
              <Building2 size={17} className="shrink-0 text-slate-400" />
              <select required name="department" value={form.department} onChange={updateField} className="h-12 w-full bg-transparent text-sm text-slate-700 outline-none">
                <option value="">Select a department</option>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </span>
          </label>

          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
            <button disabled={saving} type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : student ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
