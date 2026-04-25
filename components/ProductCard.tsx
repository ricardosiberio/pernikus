import Link from "next/link";
import Image from "next/image";
import type { SanityProduct } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: SanityProduct;
};

export function ProductCard({ product }: Props) {
  const imageUrl = product.image
    ? urlFor(product.image).width(800).height(800).fit("crop").url()
    : null;

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded border border-slate-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-slate-400">
            No image
          </div>
        )}
        {product.compareAtPriceCents &&
          product.priceCents &&
          product.compareAtPriceCents > product.priceCents && (
            <span className="absolute left-3 top-3 rounded bg-navy-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {product.category.name}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-navy-950 group-hover:text-navy-700">
          {product.title}
        </h3>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-auto pt-3">
          {typeof product.priceCents === "number" ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-navy-950">
                {formatPrice(product.priceCents)}
              </span>
              {product.compareAtPriceCents &&
                product.compareAtPriceCents > product.priceCents && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.compareAtPriceCents)}
                  </span>
                )}
            </div>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Contact for Wholesale Pricing
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
