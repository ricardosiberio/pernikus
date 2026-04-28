import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileText,
  Handshake,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  getWholesaleContent,
  getSiteSettings,
} from "@/lib/sanity-content";
import { PortableParagraphs } from "@/components/PortableParagraphs";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWholesaleContent();
  return {
    title: content.seoTitle,
    description: content.seoDescription,
  };
}

// Icons cycle for value cards — kept in code, not CMS
const VALUE_CARD_ICONS = [
  <ShieldCheck key="i0" className="h-6 w-6" />,
  <Building2 key="i1" className="h-6 w-6" />,
  <Handshake key="i2" className="h-6 w-6" />,
  <TrendingUp key="i3" className="h-6 w-6" />,
  <FileText key="i4" className="h-6 w-6" />,
  <CheckCircle2 key="i5" className="h-6 w-6" />,
  <TrendingUp key="i6" className="h-6 w-6" />,
  <FileText key="i7" className="h-6 w-6" />,
];

export default async function WholesalePage() {
  const [content, site] = await Promise.all([
    getWholesaleContent(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {content.heroHeadline}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            {content.heroIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {content.heroPrimaryCtaLabel && (
              <Link
                href={content.heroPrimaryCtaUrl || "/contact"}
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-100"
              >
                {content.heroPrimaryCtaLabel}
              </Link>
            )}
            {content.heroSecondaryCtaLabel && (
              <a
                href={
                  content.heroSecondaryCtaUrl ||
                  `mailto:${site.salesEmail}?subject=Brand%20Partner%20Inquiry`
                }
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {content.heroSecondaryCtaLabel}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {content.whoWeAreEyebrow}
        </p>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-navy-950">
          {content.whoWeAreHeadline}
        </h2>
        <PortableParagraphs
          blocks={content.whoWeAreBody}
          className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-slate-700"
        />
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {content.whyPartnerEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            {content.whyPartnerHeadline}
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {content.whyPartnerCards.map((card, i) => (
              <ValueCard
                key={`${card.title}-${i}`}
                icon={VALUE_CARD_ICONS[i % VALUE_CARD_ICONS.length]}
                title={card.title}
                body={card.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {content.categoriesEyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
          {content.categoriesHeadline}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          {content.categoriesIntro}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.categoriesList.map((c, i) => (
            <li
              key={`${c}-${i}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy-950"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {content.finalCtaHeadline}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            {content.finalCtaBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {content.finalCtaPrimaryLabel && (
              <Link
                href={content.finalCtaPrimaryUrl || "/contact"}
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-100"
              >
                {content.finalCtaPrimaryLabel}
              </Link>
            )}
            {content.finalCtaSecondaryLabel && (
              <Link
                href={content.finalCtaSecondaryUrl || "/credentials"}
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {content.finalCtaSecondaryLabel}
              </Link>
            )}
            <a
              href={`mailto:${site.salesEmail}?subject=Brand%20Partner%20Inquiry`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {site.salesEmail}
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-navy-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
