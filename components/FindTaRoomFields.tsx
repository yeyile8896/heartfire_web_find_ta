"use client";

import type { ChangeEventHandler, ReactNode } from "react";

type TextFieldProps = {
  autoComplete?: string;
  help?: string;
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  value: string;
};

export function TextField({
  autoComplete,
  help,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  value
}: TextFieldProps) {
  const inputClass =
    "mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200";

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {textarea ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          value={value}
        />
      ) : (
        <input
          autoComplete={autoComplete}
          className={inputClass}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type="text"
          value={value}
        />
      )}
      {help ? <span className="mt-2 block text-xs leading-5 text-slate-500">{help}</span> : null}
    </label>
  );
}

export function StatusPill({
  children,
  tone = "amber"
}: {
  children: ReactNode;
  tone?: "amber" | "emerald" | "slate";
}) {
  const colors = {
    amber: "border-orange-200 bg-orange-50 text-[#9a4a1f]",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    slate: "border-stone-200 bg-white text-slate-700"
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${colors[tone]}`}>
      {children}
    </span>
  );
}
