import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/client";
import { groq } from "next-sanity";

export const runtime = "nodejs";

const lineItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
});

const bodySchema = z.object({
  items: z.array(lineItemSchema).min(1),
});

const productsByIdsQuery = groq`*[_type == "product" && _id in $ids] {
  _id,
  title,
  priceCents,
  image
}`;

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local (use a test mode key from https://dashboard.stripe.com/test/apikeys).",
      },
      { status: 500 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const requested = parsed.data.items;
    const ids = Array.from(new Set(requested.map((i) => i.id)));
    const products: Array<{
      _id: string;
      title: string;
      priceCents?: number;
      image?: { asset: { _ref: string } };
    }> = await sanityClient.fetch(productsByIdsQuery, { ids });

    const byId = new Map(products.map((p) => [p._id, p] as const));
    const lineItems = requested.map((item) => {
      const product = byId.get(item.id);
      if (!product) {
        throw new Error("One or more products could not be found.");
      }
      if (typeof product.priceCents !== "number" || product.priceCents <= 0) {
        throw new Error("One or more products are not available for online checkout.");
      }
      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.priceCents,
          product_data: {
            name: product.title,
            metadata: { product_id: product._id },
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      automatic_tax: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
