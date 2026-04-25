/**
 * List all imported Amazon products that don't have an image in Sanity.
 * Prints ASIN + Title so you can download images manually.
 *
 * Usage: npm run list:missing-images
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
  const products: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "product" && _id match "prod-*" && !defined(image)] | order(title asc) {
       _id, title
     }`
  );

  console.log(`\nFound ${products.length} imported products without images:\n`);
  console.log("ASIN          | Title");
  console.log("--------------|---------------------------------------------------------------");
  for (const p of products) {
    const asin = p._id.replace(/^prod-/, "");
    console.log(`${asin.padEnd(13)} | ${p.title}`);
  }
  console.log(
    `\nSave each image as <ASIN>.jpg (or .png/.webp) into c:\\Users\\R\\Documents\\pernikus\\product-images\\`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
