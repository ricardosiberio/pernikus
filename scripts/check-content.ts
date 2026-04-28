/**
 * Inspect what's actually in Sanity for each singleton.
 * Shows published values vs. drafts vs. missing fields.
 *
 * Usage: npm run check:content
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) config({ path: envPath });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
  perspective: "raw", // see published + drafts together
});

const SINGLETONS = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "wholesalePage",
  "credentialsPage",
];

async function main() {
  for (const id of SINGLETONS) {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`📄 ${id}`);
    console.log("=".repeat(70));

    const published = await client.getDocument(id);
    const draft = await client.getDocument(`drafts.${id}`);

    if (!published && !draft) {
      console.log("❌ DOCUMENT DOES NOT EXIST");
      continue;
    }

    const has = (doc: Record<string, unknown> | null, field: string) => {
      if (!doc) return null;
      const v = doc[field];
      if (v === undefined || v === null) return null;
      if (typeof v === "string" && v.trim() === "") return null;
      if (Array.isArray(v) && v.length === 0) return null;
      return v;
    };

    const fields = published
      ? Object.keys(published).filter((k) => !k.startsWith("_"))
      : draft
        ? Object.keys(draft).filter((k) => !k.startsWith("_"))
        : [];

    console.log(
      `Published doc: ${published ? "EXISTS" : "MISSING"} | Draft doc: ${draft ? "EXISTS" : "none"}\n`
    );

    for (const field of fields) {
      const pubVal = has(published as Record<string, unknown> | null, field);
      const draftVal = has(draft as Record<string, unknown> | null, field);
      const same = JSON.stringify(pubVal) === JSON.stringify(draftVal);

      const valToShow = pubVal;
      let preview = "";
      if (valToShow === null) preview = "(empty — falls back to code default)";
      else if (typeof valToShow === "string")
        preview = `"${valToShow.length > 70 ? valToShow.slice(0, 70) + "..." : valToShow}"`;
      else if (Array.isArray(valToShow))
        preview = `[${valToShow.length} items]`;
      else if (typeof valToShow === "object")
        preview = JSON.stringify(valToShow).slice(0, 70);
      else preview = String(valToShow);

      const draftMarker =
        draft && !same ? " ⚠️ UNPUBLISHED DRAFT EXISTS" : "";
      console.log(`  ${field.padEnd(28)} ${preview}${draftMarker}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
