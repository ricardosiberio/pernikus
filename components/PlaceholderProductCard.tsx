import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { PlaceholderProduct } from "@/lib/placeholder-products";

type Props = {
  product: PlaceholderProduct;
};

export function PlaceholderProductCard({ product }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-slate-200 bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {product.category.name}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-navy-950">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.shortDescription}</p>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-navy-950">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.compareAtPriceCents)}
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-slate-500">{product.caseSize}</div>
        </div>
      </div>
    </div>
  );
}
