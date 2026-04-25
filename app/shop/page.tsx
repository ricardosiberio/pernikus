import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { allProductsQuery, type SanityProduct } from "@/sanity/queries";
import { ProductCard } from "@/components/ProductCard";
import { PlaceholderProductCard } from "@/components/PlaceholderProductCard";
import { CATEGORIES } from "@/lib/utils";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-products";
import { withTimeout } from "@/lib/with-timeout";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Wholesale Catalog",
  description:
    "Browse Pernikus LLC's catalog of consumer packaged goods across grocery, health & beauty, household essentials, and beverages.",
};

async function getProducts(): Promise<SanityProduct[]> {
  try {
    return await withTimeout(sanityClient.fetch(allProductsQuery), 4000);
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();
  const usePlaceholders = process.env.NODE_ENV !== "production" && products.length === 0;

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            Catalog
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Shop the Pernikus catalog
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Browse the full assortment, or jump straight into a category.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <CategoryPill href="/shop" label="All" active />
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.slug} href={`/shop/${c.slug}`} label={c.name} />
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
              {PLACEHOLDER_PRODUCTS.map((p) => (
                <PlaceholderProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : products.length === 0 ? (
          <EmptyState />
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

function CategoryPill({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded border border-navy-900 bg-navy-900 px-4 py-2 text-sm font-semibold text-white"
          : "rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-navy-900 hover:text-navy-900"
      }
    >
      {label}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <h2 className="text-lg font-semibold text-navy-950">Catalog coming online</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Once you connect Sanity (see <code>README.md</code>) and seed your first
        products, the catalog will populate here automatically.
      </p>
      <Link
        href="/studio"
        className="mt-6 inline-flex rounded bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Open Content Studio
      </Link>
    </div>
  );
}
