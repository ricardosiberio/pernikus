"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  inquiryType: z.enum([
    "wholesale",
    "compliance",
    "press",
    "general",
  ]),
  message: z.string().min(10, "Please share a bit more detail"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inquiryType: "wholesale" },
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            {...register("name")}
            className="block w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-navy-950 shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </Field>
        <Field label="Work Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="block w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-navy-950 shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </Field>
      </div>

      <Field label="Company (optional)" error={errors.company?.message}>
        <input
          type="text"
          autoComplete="organization"
          {...register("company")}
          className="block w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-navy-950 shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
        />
      </Field>

      <Field label="Inquiry Type" error={errors.inquiryType?.message}>
        <select
          {...register("inquiryType")}
          className="block w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-950 shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
        >
          <option value="wholesale">Wholesale Account / Distribution</option>
          <option value="compliance">Compliance / Verification Documents</option>
          <option value="press">Press &amp; Partnerships</option>
          <option value="general">General Inquiry</option>
        </select>
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          rows={5}
          {...register("message")}
          className="block w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-navy-950 shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 items-center justify-center rounded bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-emerald-700">
          Thank you. Your message has been received and we will respond within one business day.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-red-700">
          {errorMsg ?? "Something went wrong. Please try again or email us directly."}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
