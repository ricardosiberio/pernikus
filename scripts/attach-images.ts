/**
 * Bulk-attach product images by ASIN filename.
 *
 * Reads every image in ./products/ named <ASIN>.<ext> (jpg/jpeg/png/webp),
 * uploads it to Sanity, and links it to the matching product (id = "prod-<ASIN>").
 *
 * Usage:
 *   npm run attach:images                    # only attach to products with NO image
 *   npm run attach:images -- --force         # also REPLACE existing images
 *   npm run attach:images -- B0ABC123        # only process this ASIN (replaces by default)
 *   npm run attach:images -- B0ABC123 B0XYZ  # process multiple specific ASINs
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { readFile, readdir } from "node:fs/promises";
import { resolve, extname, basename } from "node:path";
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

const IMG_DIR = resolve(process.cwd(), "products");
const VALID_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function main() {
  if (!existsSync(IMG_DIR)) {
    console.error(`Could not find ${IMG_DIR}`);
    process.exit(1);
  }

  // Parse CLI args: --force flag and any explicit ASINs to limit to.
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const asinAllowlist = new Set(
    args
      .filter((a) => !a.startsWith("--"))
      .map((a) => a.toUpperCase())
  );
  const hasAllowlist = asinAllowlist.size > 0;
  // When user names specific ASINs, default to replace (otherwise it's
  // surprising — they explicitly listed those because they want them updated).
  const replaceExisting = forceAll || hasAllowlist;

  let files = (await readdir(IMG_DIR)).filter((f) =>
    VALID_EXTS.has(extname(f).toLowerCase())
  );

  if (hasAllowlist) {
    files = files.filter((f) =>
      asinAllowlist.has(basename(f, extname(f)).toUpperCase())
    );
  }

  console.log(
    `Found ${files.length} image file(s) to process in ${IMG_DIR}` +
      (replaceExisting ? "  [REPLACE mode — existing images will be overwritten]" : "")
  );

  let attached = 0;
  let replaced = 0;
  let skipped = 0;
  const unmatched: string[] = [];

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const asin = basename(file, ext).toUpperCase();
    const docId = `prod-${asin}`;

    process.stdout.write(`   • ${file.padEnd(20)} `);
    const exists: { _id: string; image?: unknown } | null = await client.fetch(
      `*[_id == $id][0]{ _id, image }`,
      { id: docId }
    );
    if (!exists) {
      console.log("✗ no matching product");
      unmatched.push(file);
      continue;
    }
    const hadImage = Boolean(exists.image);
    if (hadImage && !replaceExisting) {
      console.log("⊙ already has image — skipped (use --force to replace)");
      skipped++;
      continue;
    }

    const buf = await readFile(resolve(IMG_DIR, file));
    const asset = await client.assets.upload("image", buf, {
      filename: file,
      contentType: CONTENT_TYPE[ext],
    });

    await client
      .patch(docId)
      .set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: docId,
        },
      })
      .commit();

    if (hadImage) {
      replaced++;
      console.log("✓ replaced");
    } else {
      attached++;
      console.log("✓ attached");
    }
  }

  console.log(
    `\n✓ Attached ${attached}, replaced ${replaced}, skipped ${skipped}, unmatched ${unmatched.length}.`
  );
  if (unmatched.length > 0) {
    console.log("Unmatched files (no Sanity product with that ASIN):");
    unmatched.forEach((f) => console.log(`   - ${f}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
