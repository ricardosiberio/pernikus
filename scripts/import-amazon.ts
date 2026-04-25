/**
 * Import an Amazon Seller Central "All Listings Report" into Sanity.
 *
 * Usage:
 *   1. Place the report file at the repo root as Listings.txt (tab-delimited).
 *   2. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and
 *      SANITY_WRITE_TOKEN (Editor permissions) are set in .env.local.
 *   3. npm run import:amazon
 *
 * Behaviour:
 *   - Skips rows that aren't status=Active.
 *   - Maps each title to one of the 4 site categories via keyword heuristics.
 *   - Tries to fetch a product image from Amazon's legacy P-image CDN by ASIN.
 *     If that 404s, the product is created without an image (fill in via /studio).
 *   - Idempotent: uses createOrReplace keyed on ASIN, so re-running updates rows.
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
  console.error("Missing SANITY_WRITE_TOKEN (Editor permissions required).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const LISTINGS_PATH = resolve(process.cwd(), "Listings.txt");

type Row = Record<string, string>;

function parseTsv(text: string): Row[] {
  // Amazon reports use \r\n or \n; split tolerantly.
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map((h) => h.trim());
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split("\t");
    const row: Row = {};
    headers.forEach((h, idx) => {
      row[h] = (cells[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

const CATEGORY_RULES: { id: string; keywords: RegExp }[] = [
  {
    id: "cat-beverages",
    keywords:
      /\b(coffee|tea|espresso|latte|cold[\s-]?brew|water|sparkling|seltzer|soda|cola|juice|drink|beverage|kombucha|energy[\s-]?drink|lemonade|smoothie|protein[\s-]?shake|gatorade|powerade)\b/i,
  },
  {
    id: "cat-health-beauty",
    keywords:
      /\b(shampoo|conditioner|soap|body[\s-]?wash|lotion|cream|moisturizer|serum|deodorant|antiperspirant|razor|shave|toothpaste|toothbrush|mouthwash|floss|vitamin|supplement|probiotic|sunscreen|spf|makeup|mascara|lipstick|foundation|cosmetic|skincare|hair[\s-]?care|nail|perfume|cologne|fragrance|feminine|tampon|pad|diaper|baby[\s-]?wipe|first[\s-]?aid|bandage|pain[\s-]?reliever|allergy|cough|cold[\s-]?medicine|melatonin)\b/i,
  },
  {
    id: "cat-household-essentials",
    keywords:
      /\b(cleaner|detergent|laundry|fabric[\s-]?softener|dryer[\s-]?sheet|dish[\s-]?soap|dishwash|paper[\s-]?towel|toilet[\s-]?paper|tissue|napkin|trash[\s-]?bag|garbage[\s-]?bag|sponge|wipe|disinfectant|bleach|air[\s-]?freshener|febreze|candle|broom|mop|foil|plastic[\s-]?wrap|sandwich[\s-]?bag|storage[\s-]?bag|battery|light[\s-]?bulb|pest|insect|bug[\s-]?spray)\b/i,
  },
  {
    id: "cat-grocery-snacks",
    keywords:
      /\b(snack|chip|cookie|cracker|candy|chocolate|gum|cereal|granola|oatmeal|pasta|rice|noodle|sauce|ketchup|mustard|mayo|dressing|spice|seasoning|rub|salt|pepper|sugar|flour|bread|peanut[\s-]?butter|jelly|jam|honey|syrup|nuts|trail[\s-]?mix|popcorn|pretzel|jerky|bar|protein[\s-]?bar|food|grocery)\b/i,
  },
];

function categorizeTitle(title: string): string {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.test(title)) return rule.id;
  }
  return "cat-grocery-snacks"; // safe default
}

function slugify(input: string, suffix: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base}-${suffix.toLowerCase()}`.replace(/-+/g, "-").slice(0, 96);
}

function shortDescriptionFrom(title: string): string {
  if (title.length <= 200) return title;
  return title.slice(0, 197) + "...";
}

function priceCents(raw: string): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

const AMAZON_IMG_BASE = "https://images-na.ssl-images-amazon.com/images/P";

async function fetchAmazonImage(asin: string): Promise<Buffer | null> {
  const url = `${AMAZON_IMG_BASE}/${asin}.01._SCRMZZZZZZ_.jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    // Amazon serves a 1x1 placeholder gif (~43 bytes) for missing images.
    if (buf.byteLength < 1500) return null;
    return buf;
  } catch {
    return null;
  }
}

async function uploadImage(asin: string): Promise<string | null> {
  const buf = await fetchAmazonImage(asin);
  if (!buf) return null;
  try {
    const asset = await client.assets.upload("image", buf, {
      filename: `${asin}.jpg`,
      contentType: "image/jpeg",
    });
    return asset._id;
  } catch (err) {
    console.warn(`   ! upload failed for ${asin}: ${(err as Error).message}`);
    return null;
  }
}

async function ensureCategoriesExist() {
  const ids = [
    "cat-grocery-snacks",
    "cat-health-beauty",
    "cat-household-essentials",
    "cat-beverages",
  ];
  const existing: { _id: string }[] = await client.fetch(
    `*[_type == "category" && _id in $ids]{_id}`,
    { ids }
  );
  if (existing.length === ids.length) return;
  console.warn(
    `! Some categories are missing in Sanity (${existing.length}/${ids.length}). ` +
      `Run \`npm run seed\` first to create them, or create them manually in /studio.`
  );
  process.exit(1);
}

async function main() {
  console.log(`Importing Amazon listings into ${projectId}/${dataset}…`);
  await ensureCategoriesExist();

  if (!existsSync(LISTINGS_PATH)) {
    console.error(`Could not find ${LISTINGS_PATH}`);
    process.exit(1);
  }

  const text = await readFile(LISTINGS_PATH, "utf8");
  const rows = parseTsv(text);
  const active = rows.filter((r) => (r["status"] ?? "").toLowerCase() === "active");
  console.log(`Parsed ${rows.length} rows, ${active.length} active.`);

  const skipped: { reason: string; title: string }[] = [];
  let created = 0;
  let withImage = 0;
  const seenAsin = new Set<string>();

  for (const row of active) {
    const title = row["item-name"];
    const asin = row["asin1"] || row["product-id"];
    const priceRaw = row["price"];
    const sku = row["seller-sku"];
    const quantity = Number(row["quantity"] ?? "0");

    if (!title || !asin) {
      skipped.push({ reason: "missing title or ASIN", title: title || "(no title)" });
      continue;
    }
    if (seenAsin.has(asin)) {
      skipped.push({ reason: "duplicate ASIN", title });
      continue;
    }
    seenAsin.add(asin);

    const cents = priceCents(priceRaw);
    if (cents === null) {
      skipped.push({ reason: "missing/invalid price", title });
      continue;
    }

    const docId = `prod-${asin}`;
    const slug = slugify(title, asin);
    const categoryId = categorizeTitle(title);

    process.stdout.write(`   • ${title.slice(0, 70).padEnd(70)} `);
    const assetId = await uploadImage(asin);
    if (assetId) withImage++;

    await client.createOrReplace({
      _id: docId,
      _type: "product",
      title,
      slug: { _type: "slug", current: slug },
      category: { _type: "reference", _ref: categoryId },
      shortDescription: shortDescriptionFrom(title),
      priceCents: cents,
      sku: sku || asin,
      upc: undefined,
      inStock: quantity > 0,
      featured: false,
      ...(assetId
        ? {
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: assetId },
              alt: title,
            },
          }
        : {}),
    });

    created++;
    console.log(assetId ? "✓ with image" : "✓ no image");
  }

  console.log(`\n✓ Imported ${created} products (${withImage} with images).`);
  if (skipped.length > 0) {
    console.log(`! Skipped ${skipped.length}:`);
    for (const s of skipped.slice(0, 20)) {
      console.log(`    - [${s.reason}] ${s.title}`);
    }
    if (skipped.length > 20) console.log(`    … and ${skipped.length - 20} more.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
