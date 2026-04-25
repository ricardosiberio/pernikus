/**
 * Dump all imported products with their current category, sorted by category.
 * Used to spot miscategorizations.
 *
 * Usage: npm run list:products
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) config({ path: envPath });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  const products: { _id: string; title: string; cat: string }[] = await client.fetch(
    `*[_type == "product" && _id match "prod-*"] | order(category->slug.current asc, title asc) {
       _id,
       title,
       "cat": category->slug.current
     }`
  );
  let lastCat = "";
  for (const p of products) {
    if (p.cat !== lastCat) {
      console.log(`\n=== ${p.cat?.toUpperCase() ?? "(no category)"} ===`);
      lastCat = p.cat;
    }
    const asin = p._id.replace(/^prod-/, "");
    console.log(`${asin.padEnd(13)} ${p.title}`);
  }
  console.log(`\nTotal: ${products.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
