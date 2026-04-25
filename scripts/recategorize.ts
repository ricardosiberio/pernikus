/**
 * One-shot category cleanup:
 *   1. Creates 2 new categories: Toys & Games, Apparel
 *   2. Reassigns miscategorized products to their correct category
 *
 * Idempotent: safe to re-run.
 *
 * Usage: npm run recategorize
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

const NEW_CATEGORIES = [
  {
    _id: "cat-toys-games",
    name: "Toys & Games",
    slug: "toys-games",
    order: 5,
    description: "Plush toys, blasters, and play accessories for all ages.",
  },
  {
    _id: "cat-apparel",
    name: "Apparel",
    slug: "apparel",
    order: 6,
    description: "Branded apparel and accessories.",
  },
];

// asin -> target category id
const REASSIGN: Record<string, string> = {
  // Reassignments within existing categories
  B0CS938PL4: "cat-household-essentials", // Stain Remover & Color Booster
  B009SE4UX2: "cat-health-beauty", // Kirkland Baby Wipes
  B0713X7CJ4: "cat-health-beauty", // Kirkland Quit Smoking Gum
  B01ACK6AC4: "cat-household-essentials", // Kirkland Parchment Paper
  B00X8K7Y5I: "cat-health-beauty", // ORS Edge Control Hair Gel
  B0752V63BJ: "cat-household-essentials", // Snapware Pyrex Glass Storage
  B01IAE0JM6: "cat-health-beauty", // VO5 Hairspray 4pk
  B01IAE0L3S: "cat-health-beauty", // VO5 Hairspray 5pk
  B0G9VSLJTP: "cat-grocery-snacks", // Amara Smoothie Melts (toddler snack)

  // Toys & Games (new category)
  B07N95BRXL: "cat-toys-games", // Jellycat Bashful Dino
  B01N22BMJB: "cat-toys-games", // Jellycat Bashful Fox Cub
  B00DJXX8UO: "cat-toys-games", // Jellycat Bashful Toffee Puppy
  B0796MCW9J: "cat-toys-games", // Jellycat Smudge Elephant
  B07G3HVMNW: "cat-toys-games", // Jellycat Smudge Rabbit
  B08SY8WMHZ: "cat-toys-games", // Nerf Mega XL Dart Refill
  B0BS48G1BD: "cat-toys-games", // Nerf Pro Gelfire Blaster

  // Apparel (new category)
  B010RSB58U: "cat-apparel", // NIKE No Show Socks
};

async function main() {
  console.log("→ Creating new categories");
  const tx = client.transaction();
  for (const c of NEW_CATEGORIES) {
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
  console.log(`  ✓ Ensured ${NEW_CATEGORIES.length} new categories exist.`);

  // Auto-detect the Dove Beauty Bar (currently in Beverages because of "tea")
  console.log("\n→ Locating Dove Beauty Bar misclassified into Beverages");
  const bevDoveSoap: { _id: string; title: string } | null = await client.fetch(
    `*[_type == "product" && category->slug.current == "beverages" && title match "Dove*"][0]{ _id, title }`
  );
  if (bevDoveSoap) {
    const asin = bevDoveSoap._id.replace(/^prod-/, "");
    REASSIGN[asin] = "cat-health-beauty";
    console.log(`  ✓ Found ${asin}: ${bevDoveSoap.title.slice(0, 70)}`);
  } else {
    console.log("  (none found, skipping)");
  }

  console.log("\n→ Applying reassignments");
  let applied = 0;
  let missing = 0;
  for (const [asin, catId] of Object.entries(REASSIGN)) {
    const docId = `prod-${asin}`;
    const exists: { _id: string } | null = await client.fetch(`*[_id == $id][0]{ _id }`, {
      id: docId,
    });
    if (!exists) {
      console.log(`  ! ${asin}: product not found, skipping`);
      missing++;
      continue;
    }
    await client
      .patch(docId)
      .set({
        category: { _type: "reference", _ref: catId },
      })
      .commit();
    console.log(`  ✓ ${asin} → ${catId}`);
    applied++;
  }

  console.log(`\n✓ Recategorized ${applied} products. ${missing} not found.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
