"use client";

import { useState } from "react";
import { Check, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";

type Props = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl?: string;
  caseSize?: string;
  disabled?: boolean;
};

export function AddToCartButton(props: Props) {
  const { id, slug, title, priceCents, imageUrl, caseSize, disabled } = props;
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id, slug, title, priceCents, imageUrl, caseSize }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex items-center rounded border border-slate-300">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-100"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-navy-950">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded bg-navy-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
