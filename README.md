# Pernikus LLC — Corporate Site

A Next.js 16 + Tailwind 4 site for **Pernikus LLC**, a Florida-based wholesale
distributor and multi-channel retailer. Built to support both wholesale verification
(W-9 / EIN / resale documentation) and direct online sales via Stripe Checkout.

## Tech Stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| CMS | Sanity (Studio embedded at `/studio`) |
| Payments | Stripe Checkout |
| Email | Resend (contact form) |
| State | Zustand (cart) |
| Forms | react-hook-form + Zod |
| Hosting | Vercel (recommended) |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in the values described below.

### 3. Set up Sanity (CMS)

1. Sign up at <https://www.sanity.io> (free).
2. Click **+ Create new project**, name it `Pernikus`, and choose dataset name `production`.
3. Copy the **Project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
4. Go to **API → CORS Origins** and add `http://localhost:3000` (and later your production domain).
5. Go to **API → Tokens**, create a token with **Editor** permissions, and copy
   it into `SANITY_WRITE_TOKEN` in `.env.local`. (Used only by the seed script.)

### 4. Seed the catalog

```bash
npm run seed
```

This uploads 4 categories and 12 placeholder products to your Sanity dataset.

### 5. Set up Stripe (test mode)

1. Sign up at <https://stripe.com>.
2. Go to <https://dashboard.stripe.com/test/apikeys> and copy:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Use card number `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP for test purchases.

### 6. (Optional) Set up Resend for the contact form

1. Sign up at <https://resend.com> (free tier).
2. Create an API key and put it in `RESEND_API_KEY`.
3. Until you verify a domain, leave `CONTACT_FROM_EMAIL` as `onboarding@resend.dev` and use any `CONTACT_TO_EMAIL` you control.

If `RESEND_API_KEY` is unset, contact-form submissions are **logged to the dev server console** so you can still test the form locally.

### 7. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/about` | About Pernikus LLC |
| `/shop` | Full catalog |
| `/shop/[category]` | Category pages |
| `/shop/product/[slug]` | Product detail |
| `/cart` | Cart + Stripe checkout |
| `/contact` | Contact form |
| `/privacy`, `/terms`, `/shipping-returns` | Legal |
| `/studio` | **Sanity content editor — log in with your Sanity account** |

---

## Editing the catalog

Open <http://localhost:3000/studio> in your browser, log in with the same Sanity
account that owns the project, and add/edit products through the UI. The site
revalidates content every 60 seconds, so changes appear automatically.

Each product supports: title, slug, category, image, short and long
description, SKU, UPC/GTIN, retail price, compare-at price, in-stock toggle,
featured-on-home toggle, and case/pack size.

---

## Things to fill in before going live

- **Operations address** in `lib/utils.ts` (currently a `TODO` placeholder).
- **Domain**: pick one and update `NEXT_PUBLIC_SITE_URL`. (Suggested: `pernikuswholesale.com`.)
- **Email**: replace `sales@pernikuswholesale.com` once your real domain is set.
- Switch Stripe keys from **test mode** to **live mode** when ready to take real payments.
- Verify your sending domain in Resend so contact-form emails come from `support@pernikusllc.com`.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>.
3. Copy every variable from `.env.local` into Vercel's **Environment Variables** section.
4. Deploy. Add your custom domain in Vercel's **Domains** tab.

---

## Project structure

```
app/
  page.tsx                 # Home
  about/                   # About
  shop/                    # Catalog (list, category, product detail)
  cart/                    # Cart UI
  checkout/success/        # Post-Stripe confirmation
  contact/                 # Contact form
  privacy/, terms/,
  shipping-returns/        # Legal pages
  studio/[[...tool]]/      # Sanity Studio mount
  api/
    checkout/              # Stripe Checkout session creator
    contact/               # Contact form handler

components/
  Navbar.tsx, Footer.tsx, ProductCard.tsx,
  AddToCartButton.tsx, ContactForm.tsx, LegalPage.tsx

lib/
  cart-store.ts            # Zustand cart with localStorage persistence
  stripe.ts                # Stripe client
  utils.ts                 # SITE config, formatters

sanity/
  client.ts, env.ts, queries.ts
  schemas/product.ts, category.ts

scripts/
  seed.ts                  # Populates Sanity with placeholder catalog
```
