import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/client";
import { productsByCategoryQuery, type SanityProduct } from "@/sanity/queries";
import { ProductCard } from "@/components/ProductCard";
import { PlaceholderProductCard } from "@/components/PlaceholderProductCard";
import { CATEGORIES } from "@/lib/utils";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-products";
import { withTimeout } from "@/lib/with-timeout";

export const revalidate = 60;

type Params = { category: string };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORIES.find((c) => c.slug === category);
  if (!meta) return {};
  return {
    title: `${meta.name} — Wholesale Catalog`,
    description: `Shop ${meta.name.toLowerCase()} from Pernikus LLC's wholesale catalog.`,
  };
}

async function getProducts(slug: string): Promise<SanityProduct[]> {
  try {
    return await withTimeout(sanityClient.fetch(productsByCategoryQuery, { slug }), 4000);
  } catch {
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const meta = CATEGORIES.find((c) => c.slug === category);
  if (!meta) notFound();

  const products = await getProducts(category);
  const placeholder = PLACEHOLDER_PRODUCTS.filter((p) => p.category.slug === category);
  const usePlaceholders =
    process.env.NODE_ENV !== "production" && products.length === 0 && placeholder.length > 0;

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200 hover:text-white">
            &larr; All Categories
          </Link>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {meta.name}
          </h1>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-navy-900 hover:text-navy-900"
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className={
                c.slug === category
                  ? "rounded border border-navy-900 bg-navy-900 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-navy-900 hover:text-navy-900"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {usePlaceholders ? (
          <>
            <div className="mb-6 rounded border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              Showing a sample assortment while the live catalog syncs.
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {placeholder.map((p) => (
                <PlaceholderProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : products.length === 0 ? (
          <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <h2 className="text-lg font-semibold text-navy-950">
              No products in this category yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Add products in the Content Studio and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
