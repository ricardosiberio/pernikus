/**
 * Remove the original placeholder products (IDs prefixed with "p-") from Sanity
 * so the live catalog only shows real imported Amazon products (prefixed "prod-").
 *
 * Usage: npm run cleanup:placeholders
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
  const placeholders: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "product" && _id match "p-*" && !(_id match "prod-*")] { _id, title }`
  );

  if (placeholders.length === 0) {
    console.log("No placeholder products found — nothing to delete.");
    return;
  }

  console.log(`Deleting ${placeholders.length} placeholder products:`);
  const tx = client.transaction();
  for (const p of placeholders) {
    console.log(`  - ${p._id} | ${p.title}`);
    tx.delete(p._id);
  }
  await tx.commit();
  console.log(`\n✓ Deleted ${placeholders.length} placeholder products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
