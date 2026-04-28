import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Building2 } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { featuredProductsQuery, type SanityProduct } from "@/sanity/queries";
import { ProductCard } from "@/components/ProductCard";
import { withTimeout } from "@/lib/with-timeout";
import { getHomeContent, getAllCategories } from "@/lib/sanity-content";

export const revalidate = 10;

async function getFeaturedProducts(): Promise<SanityProduct[]> {
  try {
    return await withTimeout(sanityClient.fetch(featuredProductsQuery), 4000);
  } catch {
    return [];
  }
}

// Icons stay in code (not in CMS) — match value props by index
const VALUE_PROP_ICONS = [
  <Truck key="truck" className="h-6 w-6" />,
  <ShieldCheck key="shield" className="h-6 w-6" />,
  <Building2 key="building" className="h-6 w-6" />,
];

export default async function HomePage() {
  const [featured, content, categories] = await Promise.all([
    getFeaturedProducts(),
    getHomeContent(),
    getAllCategories(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-navy-950">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {content.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {content.heroSubheadline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {content.heroPrimaryCtaLabel && (
              <Link
                href={content.heroPrimaryCtaUrl || "/shop"}
                className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-slate-200"
              >
                {content.heroPrimaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {content.heroSecondaryCtaLabel && (
              <Link
                href={content.heroSecondaryCtaUrl || "/about"}
                className="inline-flex items-center gap-2 rounded border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {content.heroSecondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </section>

      {content.valueProps.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-slate-200 md:grid-cols-3">
            {content.valueProps.map((vp, i) => (
              <ValueProp
                key={`${vp.title}-${i}`}
                icon={VALUE_PROP_ICONS[i % VALUE_PROP_ICONS.length]}
                title={vp.title}
                body={vp.body}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {content.categoriesEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
              {content.categoriesHeadline}
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-semibold text-navy-900 hover:text-navy-700 sm:inline-flex"
          >
            All products &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group rounded border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Category
              </div>
              <div className="mt-2 text-lg font-semibold text-navy-950 group-hover:text-navy-700">
                {c.name}
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-navy-900">
                Browse <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {content.featuredEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
              {content.featuredHeadline}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy-950">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
              {content.wholesaleCtaEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {content.wholesaleCtaHeadline}
            </h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              {content.wholesaleCtaBody}
            </p>
          </div>
          {content.wholesaleCtaButtonLabel && (
            <Link
              href={content.wholesaleCtaButtonUrl || "/contact"}
              className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-200"
            >
              {content.wholesaleCtaButtonLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

function ValueProp({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded bg-navy-50 text-navy-900">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-navy-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
