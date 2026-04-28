/**
 * List all categories in Sanity. Usage: npx tsx scripts/list-categories.ts
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
  const cats = await client.fetch(
    `*[_type=="category"] | order(coalesce(order, 999) asc, name asc) {
      _id, name, "slug": slug.current, order
    }`
  );
  console.log(JSON.stringify(cats, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
