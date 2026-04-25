/**
 * Seed Pernikus Sanity dataset with 4 categories and 12 placeholder products.
 *
 * Usage:
 *   1. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and
 *      SANITY_WRITE_TOKEN (with editor permissions) in your shell or .env.local.
 *   2. npm run seed
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) config({ path: envPath });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Create one at https://www.sanity.io/manage with Editor permissions."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const categories = [
  {
    _id: "cat-grocery-snacks",
    name: "Grocery & Snacks",
    slug: "grocery-snacks",
    order: 1,
    description: "Pantry staples, shelf-stable groceries, and individually packaged snacks.",
  },
  {
    _id: "cat-health-beauty",
    name: "Health & Beauty",
    slug: "health-beauty",
    order: 2,
    description: "Personal care, skincare, hair care, and over-the-counter wellness.",
  },
  {
    _id: "cat-household-essentials",
    name: "Household Essentials",
    slug: "household-essentials",
    order: 3,
    description: "Cleaning, paper goods, laundry, and everyday household supplies.",
  },
  {
    _id: "cat-beverages",
    name: "Beverages",
    slug: "beverages",
    order: 4,
    description: "Bottled water, soft drinks, coffee, tea, and ready-to-drink beverages.",
  },
];

type SeedProduct = {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  priceCents: number;
  compareAtPriceCents?: number;
  caseSize: string;
  sku: string;
  upc: string;
  imageUrl: string;
  featured?: boolean;
};

const products: SeedProduct[] = [
  {
    id: "p-multigrain-crackers",
    title: "Sea Salt Multigrain Crackers, 6.5 oz",
    category: "cat-grocery-snacks",
    shortDescription: "Crisp multigrain crackers with rolled oats, flax, and a light sea-salt finish.",
    priceCents: 449,
    caseSize: "Case of 12",
    sku: "PRN-GRC-1001",
    upc: "850000100107",
    imageUrl: "https://images.unsplash.com/photo-1599629954294-14df9ec8bc1c?w=1200&q=80",
    featured: true,
  },
  {
    id: "p-honey-roasted-almonds",
    title: "Honey Roasted Almonds, 9 oz Resealable",
    category: "cat-grocery-snacks",
    shortDescription: "Whole California almonds, lightly glazed with honey and a touch of cane sugar.",
    priceCents: 799,
    compareAtPriceCents: 899,
    caseSize: "Case of 8",
    sku: "PRN-GRC-1002",
    upc: "850000100114",
    imageUrl: "https://images.unsplash.com/photo-1606937295547-bc0f668293db?w=1200&q=80",
    featured: true,
  },
  {
    id: "p-organic-rolled-oats",
    title: "Organic Rolled Oats, 32 oz Canister",
    category: "cat-grocery-snacks",
    shortDescription: "USDA-organic whole-grain rolled oats. Naturally gluten-free sourced.",
    priceCents: 549,
    caseSize: "Case of 6",
    sku: "PRN-GRC-1003",
    upc: "850000100121",
    imageUrl: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=1200&q=80",
  },
  {
    id: "p-daily-moisturizer",
    title: "Daily Hydrating Facial Moisturizer, 1.7 fl oz",
    category: "cat-health-beauty",
    shortDescription: "Lightweight, fragrance-free daily moisturizer with hyaluronic acid and niacinamide.",
    priceCents: 1299,
    caseSize: "Case of 24",
    sku: "PRN-HBA-2001",
    upc: "850000200104",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
    featured: true,
  },
  {
    id: "p-mineral-sunscreen",
    title: "Broad-Spectrum Mineral Sunscreen SPF 50, 3.0 fl oz",
    category: "cat-health-beauty",
    shortDescription: "Reef-friendly zinc-oxide mineral sunscreen, water-resistant up to 80 minutes.",
    priceCents: 1499,
    caseSize: "Case of 24",
    sku: "PRN-HBA-2002",
    upc: "850000200111",
    imageUrl: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=1200&q=80",
  },
  {
    id: "p-vitamin-c-serum",
    title: "Brightening Vitamin C Serum, 1.0 fl oz",
    category: "cat-health-beauty",
    shortDescription: "10% L-ascorbic acid serum with vitamin E and ferulic acid for everyday brightness.",
    priceCents: 1899,
    compareAtPriceCents: 2299,
    caseSize: "Case of 12",
    sku: "PRN-HBA-2003",
    upc: "850000200128",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80",
  },
  {
    id: "p-laundry-detergent",
    title: "Free & Clear Liquid Laundry Detergent, 100 oz",
    category: "cat-household-essentials",
    shortDescription: "Plant-based, dye- and fragrance-free liquid detergent. 64 standard loads per bottle.",
    priceCents: 1399,
    caseSize: "Case of 4",
    sku: "PRN-HHE-3001",
    upc: "850000300101",
    imageUrl: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=1200&q=80",
  },
  {
    id: "p-multi-surface-cleaner",
    title: "Citrus Multi-Surface Cleaner, 32 fl oz",
    category: "cat-household-essentials",
    shortDescription: "Plant-derived multi-surface cleaner with a fresh citrus profile. No harsh solvents.",
    priceCents: 549,
    caseSize: "Case of 12",
    sku: "PRN-HHE-3002",
    upc: "850000300118",
    imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&q=80",
  },
  {
    id: "p-bath-tissue",
    title: "2-Ply Premium Bath Tissue, 12 Mega Rolls",
    category: "cat-household-essentials",
    shortDescription: "Soft, strong, and septic-safe 2-ply bath tissue. Each mega roll equals four standard rolls.",
    priceCents: 1899,
    caseSize: "Case of 4 packs",
    sku: "PRN-HHE-3003",
    upc: "850000300125",
    imageUrl: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=1200&q=80",
    featured: true,
  },
  {
    id: "p-spring-water",
    title: "Natural Spring Water, 16.9 fl oz Bottles",
    category: "cat-beverages",
    shortDescription: "BPA-free 16.9 fl oz bottles of natural spring water. Bottled at the source in the U.S.",
    priceCents: 599,
    caseSize: "Case of 24",
    sku: "PRN-BEV-4001",
    upc: "850000400108",
    imageUrl: "https://images.unsplash.com/photo-1606168094336-48f8b0c1e1d2?w=1200&q=80",
  },
  {
    id: "p-cold-brew-coffee",
    title: "Cold Brew Coffee, Unsweetened Black, 11 fl oz",
    category: "cat-beverages",
    shortDescription: "Slow-steeped cold brew coffee in single-serve cans. Smooth, low-acid, unsweetened.",
    priceCents: 349,
    caseSize: "Case of 12",
    sku: "PRN-BEV-4002",
    upc: "850000400115",
    imageUrl: "https://images.unsplash.com/photo-1559525839-d9acfd0b8ad7?w=1200&q=80",
    featured: true,
  },
  {
    id: "p-sparkling-citrus",
    title: "Sparkling Citrus Water, 8-Pack",
    category: "cat-beverages",
    shortDescription: "Zero-calorie sparkling water with natural citrus essence. No sweeteners, no sodium.",
    priceCents: 499,
    caseSize: "Case of 6 (8-packs)",
    sku: "PRN-BEV-4003",
    upc: "850000400122",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=1200&q=80",
  },
];

async function uploadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`   ! image fetch failed (${res.status}) for ${url} — skipping image`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return await client.assets.upload("image", buf, { filename });
  } catch (err) {
    console.warn(`   ! image fetch error for ${url} — skipping image`);
    return null;
  }
}

async function main() {
  console.log(`Seeding project ${projectId} / dataset ${dataset}…`);

  console.log("→ creating categories");
  const tx = client.transaction();
  for (const c of categories) {
    tx.createOrReplace({
      _id: c._id,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      order: c.order,
      description: c.description,
    });
  }
  await tx.commit();

  console.log("→ uploading product images & creating products");
  for (const p of products) {
    process.stdout.write(`   • ${p.title} … `);
    const asset = await uploadImage(p.imageUrl, `${p.id}.jpg`);
    await client.createOrReplace({
      _id: p.id,
      _type: "product",
      title: p.title,
      slug: { _type: "slug", current: p.id.replace(/^p-/, "") },
      category: { _type: "reference", _ref: p.category },
      shortDescription: p.shortDescription,
      priceCents: p.priceCents,
      compareAtPriceCents: p.compareAtPriceCents,
      caseSize: p.caseSize,
      sku: p.sku,
      upc: p.upc,
      inStock: true,
      featured: p.featured ?? false,
      ...(asset
        ? {
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: asset._id },
              alt: p.title,
            },
          }
        : {}),
    });
    console.log("done");
  }

  console.log("\n✓ Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
