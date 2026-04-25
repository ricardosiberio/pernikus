import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { sanityClient, urlFor } from "@/sanity/client";
import { productBySlugQuery, type SanityProduct } from "@/sanity/queries";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

type Params = { slug: string };

async function getProduct(slug: string): Promise<SanityProduct | null> {
  try {
    return await sanityClient.fetch(productBySlugQuery, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const imageUrl = product.image
    ? urlFor(product.image).width(1200).height(1200).fit("crop").url()
    : null;
  const cardImageUrl = product.image
    ? urlFor(product.image).width(400).height(400).fit("crop").url()
    : undefined;

  const hasPrice = typeof product.priceCents === "number";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs font-medium text-slate-500">
        <Link href="/shop" className="hover:text-navy-900">
          Shop
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-navy-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded border border-slate-200 bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.image?.alt ?? product.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-wider text-slate-400">
              No image
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            {product.title}
          </h1>
          {product.shortDescription && (
            <p className="mt-4 text-base text-slate-700">{product.shortDescription}</p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            {hasPrice ? (
              <>
                <span className="text-3xl font-semibold text-navy-950">
                  {formatPrice(product.priceCents!)}
                </span>
                {product.compareAtPriceCents &&
                  product.compareAtPriceCents > product.priceCents! && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.compareAtPriceCents)}
                    </span>
                  )}
              </>
            ) : (
              <span className="text-base font-semibold uppercase tracking-wider text-slate-500">
                Contact for Wholesale Pricing
              </span>
            )}
          </div>

          {product.caseSize && (
            <p className="mt-2 text-sm text-slate-500">
              Case size: <span className="font-medium text-slate-700">{product.caseSize}</span>
            </p>
          )}

          <div className="mt-8">
            {hasPrice ? (
              <AddToCartButton
                id={product._id}
                slug={product.slug}
                title={product.title}
                priceCents={product.priceCents!}
                imageUrl={cardImageUrl}
                caseSize={product.caseSize}
                disabled={product.inStock === false}
              />
            ) : (
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Request Wholesale Pricing
              </Link>
            )}
          </div>

          {product.inStock === false && (
            <p className="mt-3 text-sm font-medium text-amber-700">Currently out of stock.</p>
          )}

          {Array.isArray(product.description) && (
            <div className="prose prose-slate mt-10 max-w-none border-t border-slate-200 pt-8 text-sm leading-7 text-slate-700">
              <PortableText value={product.description as never} />
            </div>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm">
            {product.sku && (
              <>
                <dt className="font-medium text-slate-500">SKU</dt>
                <dd className="text-slate-700">{product.sku}</dd>
              </>
            )}
            {product.upc && (
              <>
                <dt className="font-medium text-slate-500">UPC / GTIN</dt>
                <dd className="text-slate-700">{product.upc}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
