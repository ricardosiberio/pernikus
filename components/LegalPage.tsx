import type { ReactNode } from "react";

export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-300">Effective {effectiveDate}</p>
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6 text-base leading-7 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-950 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-navy-700 [&_a:hover]:text-navy-900 [&_a]:underline">
          {children}
        </div>
      </article>
    </>
  );
}
