import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not set. Checkout will fail until this is configured."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  typescript: true,
});
