/**
 * Generate a visual HTML audit of every product image in Sanity.
 * Opens the report so you can quickly spot images that don't fit.
 *
 * Usage: npm run audit:images
 *
 * Output: ./products-audit.html  (opened automatically in your default browser)
 */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { config } from "dotenv";
import { resolve } from "node:path";
import { existsSync, writeFileSync } from "node:fs";
import { exec } from "node:child_process";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) config({ path: envPath });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const builder = imageUrlBuilder({ projectId, dataset });

type Product = {
  _id: string;
  title: string;
  cat: string | null;
  image: { asset?: { _ref: string } } | null;
};

async function main() {
  const products: Product[] = await client.fetch(
    `*[_type == "product" && _id match "prod-*"] | order(category->slug.current asc, title asc) {
       _id,
       title,
       "cat": category->slug.current,
       image
     }`
  );

  const html = renderHtml(products);
  const outPath = resolve(process.cwd(), "products-audit.html");
  writeFileSync(outPath, html, "utf8");

  console.log(`✓ Wrote ${products.length} products to ${outPath}`);
  console.log("Opening in browser...");

  // Open in default browser
  const cmd =
    process.platform === "win32"
      ? `powershell -Command "Start-Process '${outPath.replace(/'/g, "''")}'"`
      : process.platform === "darwin"
        ? `open "${outPath}"`
        : `xdg-open "${outPath}"`;
  exec(cmd, (err) => {
    if (err) {
      console.log(
        `(could not auto-open browser — open manually: ${outPath})`
      );
    }
  });
}

function renderHtml(products: Product[]): string {
  const grouped = new Map<string, Product[]>();
  for (const p of products) {
    const key = p.cat ?? "(no category)";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  const sections = [...grouped.entries()]
    .map(([cat, items]) => {
      const cards = items
        .map((p) => {
          const asin = p._id.replace(/^prod-/, "");
          const imgUrl = p.image?.asset
            ? builder.image(p.image as never).width(400).url()
            : null;
          const imgTag = imgUrl
            ? `<img src="${imgUrl}" alt="${escapeHtml(p.title)}" loading="lazy" />`
            : `<div class="no-img">no image</div>`;
          return `
            <div class="card">
              ${imgTag}
              <div class="meta">
                <div class="asin">${asin}</div>
                <div class="title">${escapeHtml(p.title)}</div>
              </div>
            </div>`;
        })
        .join("");
      return `
        <section>
          <h2>${escapeHtml(cat)} <span class="count">(${items.length})</span></h2>
          <div class="grid">${cards}</div>
        </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Product image audit — ${products.length} products</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f8fafc; color: #0f172a;
  }
  h1 { margin: 0 0 8px; }
  .summary { color: #475569; margin-bottom: 32px; }
  h2 { margin: 32px 0 12px; text-transform: capitalize; }
  .count { color: #94a3b8; font-weight: 400; font-size: 0.7em; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  .card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .card img, .no-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
  }
  .no-img {
    display: flex; align-items: center; justify-content: center;
    color: #94a3b8; font-style: italic;
  }
  .meta { padding: 10px 12px; font-size: 13px; }
  .asin {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    color: #64748b;
    user-select: all;
  }
  .title { color: #0f172a; line-height: 1.35; margin-top: 4px; }
</style>
</head>
<body>
  <h1>Product image audit</h1>
  <p class="summary">
    ${products.length} products. Click an ASIN to copy. To replace an image,
    drop a file named <code>&lt;ASIN&gt;.jpg</code> (or .png/.webp) into the
    <code>products/</code> folder and run <code>npm run replace:image -- &lt;ASIN&gt;</code>
    or <code>npm run attach:images -- --force</code>.
  </p>
  ${sections}
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
