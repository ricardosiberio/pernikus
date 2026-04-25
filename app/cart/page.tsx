"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotalCents());

  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);

  const handleCheckout = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return <CartLayout>Loading cart…</CartLayout>;
  }

  if (items.length === 0) {
    return (
      <CartLayout>
        <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <h2 className="text-lg font-semibold text-navy-950">Your cart is empty.</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add items from the catalog to get started.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Browse Catalog
          </Link>
        </div>
      </CartLayout>
    );
  }

  return (
    <CartLayout>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <ul className="divide-y divide-slate-200 rounded border border-slate-200 lg:col-span-2">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link
                    href={`/shop/product/${item.slug}`}
                    className="text-sm font-semibold text-navy-950 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="text-sm font-semibold text-navy-950">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </div>
                {item.caseSize && (
                  <p className="mt-1 text-xs text-slate-500">{item.caseSize}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="inline-flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="inline-flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-navy-950">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium text-navy-950">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Shipping</dt>
              <dd className="text-slate-500">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Tax</dt>
              <dd className="text-slate-500">Calculated at checkout</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-semibold text-navy-950">Total</dt>
              <dd className="font-semibold text-navy-950">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center rounded bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Redirecting to Stripe…" : "Secure Checkout"}
          </button>
          {error && (
            <p className="mt-3 text-xs font-medium text-red-700">{error}</p>
          )}
          <p className="mt-3 text-[11px] leading-5 text-slate-500">
            Payments are processed by Stripe. We never see or store your card details.
          </p>
        </aside>
      </div>
    </CartLayout>
  );
}

function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-navy-950">Your Cart</h1>
      <div className="mt-8">{children}</div>
    </section>
  );
}
