/**
 * Delete one or more products from Sanity by ID.
 *
 * Usage:
 *   tsx scripts/delete-product.ts prod-B0D3733D2J prod-XXXXXXXXXX
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
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error("Usage: tsx scripts/delete-product.ts <id> [id...]");
    process.exit(1);
  }

  const tx = client.transaction();
  for (const id of ids) {
    console.log(`Deleting ${id}`);
    tx.delete(id);
  }
  await tx.commit();
  console.log(`✓ Deleted ${ids.length} document(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
