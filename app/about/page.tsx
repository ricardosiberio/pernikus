import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getAboutContent, getSiteSettings } from "@/lib/sanity-content";
import { PortableParagraphs } from "@/components/PortableParagraphs";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();
  return {
    title: content.seoTitle,
    description: content.seoDescription,
  };
}

export default async function AboutPage() {
  const [content, site] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {content.heroHeadline}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {content.companyEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            {content.companyHeadline}
          </h2>
          <PortableParagraphs
            blocks={content.companyBody}
            className="mt-6 space-y-4 text-base leading-7 text-slate-700"
          />
        </div>
        {content.companyImageUrl && (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded border border-slate-200">
            <Image
              src={content.companyImageUrl}
              alt={content.companyImageAlt || ""}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {content.operateEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            {content.operateHeadline}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.operateCards.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className="rounded border border-slate-200 bg-white p-6"
              >
                <CheckCircle2 className="h-6 w-6 text-navy-900" />
                <h3 className="mt-3 text-base font-semibold text-navy-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded border border-slate-200 bg-white p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">
              {content.ctaHeadline}
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">{content.ctaBody}</p>
          </div>
          {content.ctaButtonLabel && (
            <a
              href={
                content.ctaButtonUrl ||
                `mailto:${site.complianceEmail}?subject=${encodeURIComponent(
                  "Onboarding documentation request"
                )}`
              }
              className="inline-flex items-center gap-2 rounded bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
            >
              {content.ctaButtonLabel}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
