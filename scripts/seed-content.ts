/**
 * Seed Pernikus Sanity singletons (Site Settings, Homepage, About, Wholesale,
 * Credentials) with the current default site copy.
 *
 * - Idempotent: only fills in EMPTY fields. Never overwrites your edits.
 * - Safe to re-run anytime.
 *
 * Usage:
 *   npm run seed:content
 *
 * Requires SANITY_WRITE_TOKEN env var (Editor permissions).
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

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// =====================================================================
// Default content (mirrors lib/sanity-content.ts)
// =====================================================================

const SALES_EMAIL = "sales@pernikuswholesale.com";
const COMPLIANCE_EMAIL = "compliance@pernikuswholesale.com";
const LEGAL_NAME = "Pernikus LLC";

function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

function withKeys<T extends Record<string, unknown>>(items: T[]): (T & { _key: string })[] {
  return items.map((item, i) => ({ ...item, _key: `item-${i}` }));
}

const siteSettingsDefaults = {
  _id: "siteSettings",
  _type: "siteSettings",
  legalName: LEGAL_NAME,
  displayName: LEGAL_NAME,
  entityType: "Limited Liability Company",
  jurisdiction: "State of Florida, USA",
  establishedYear: 2023,
  salesEmail: SALES_EMAIL,
  complianceEmail: COMPLIANCE_EMAIL,
  supportEmail: SALES_EMAIL,
  phoneDisplay: "(407) 881-7996",
  phoneRaw: "+14078817996",
  addressLine1: "9550 Satellite Blvd",
  addressLine2: "",
  addressCity: "Orlando",
  addressState: "FL",
  addressZip: "32837",
  addressCountry: "USA",
  einLast4: "",
  sunbizDocumentNumber: "",
  flResaleCertificate: "active",
  dunsNumber: "041-702-526",
  bankReferenceOnRequest: true,
  tradeReferencesOnRequest: true,
  insuranceInsurer: "",
  insuranceGeneralLiability: "",
  insuranceProductLiability: "",
  insuranceCoiOnRequest: true,
  amazonStorefrontUrl: "",
};

const homePageDefaults = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: "Pernikus LLC · Florida",
  heroHeadline: "Everyday goods, reliably delivered.",
  heroSubheadline:
    "Pantry staples, beverages, household essentials, and personal care — sourced from trusted brands and shipped from our Florida operations.",
  heroPrimaryCtaLabel: "Shop Now",
  heroPrimaryCtaUrl: "/shop",
  heroSecondaryCtaLabel: "Our Story",
  heroSecondaryCtaUrl: "/about",
  valueProps: withKeys([
    {
      title: "Fast, tracked shipping",
      body: "Orders ship from our Florida warehouse with tracking on every package. Most orders arrive in 3 to 5 business days.",
    },
    {
      title: "Brands you already trust",
      body: "A curated catalog across grocery, beverages, household, and personal care — the brands you already keep at home.",
    },
    {
      title: "Family-run, Florida-based",
      body: "Headquartered in Orlando, Florida. A small U.S. operator focused on the basics: good prices, honest service, on-time orders.",
    },
  ]),
  categoriesEyebrow: "Categories",
  categoriesHeadline: "Shop by category",
  featuredEyebrow: "Featured",
  featuredHeadline: "Popular items this quarter",
  wholesaleCtaEyebrow: "For Wholesale & Trade",
  wholesaleCtaHeadline: "Buying for a store or distributor?",
  wholesaleCtaBody:
    "We support resale and trade accounts. W-9, EIN letter, and Florida resale certificate available on request.",
  wholesaleCtaButtonLabel: "Contact Our Team",
  wholesaleCtaButtonUrl: "/contact",
};

const aboutPageDefaults = {
  _id: "aboutPage",
  _type: "aboutPage",
  heroEyebrow: `About ${LEGAL_NAME}`,
  heroHeadline: "A Florida operator built for the demands of national retail.",
  companyEyebrow: "Our company",
  companyHeadline: "Distribution that moves at retail's pace.",
  companyBody: paragraphsToBlocks([
    "Pernikus LLC is a privately held wholesale distributor and multi-channel retailer based in Orlando, Florida. We specialize in consumer packaged goods (CPG) across grocery, beverages, household essentials, and health & beauty — the consumable categories that move predictable volume for both regional retailers and national online channels.",
    "Our model pairs disciplined inventory management with vetted 3PL warehouse and pallet operations, allowing us to take in truckload-sized inbound shipments and break them down into the case quantities, mixed pallets, and parcel orders that today's buyers expect. The result is a supply chain that scales without sacrificing the documentation, turnaround, and traceability our trade partners rely on.",
    "We are an Employer Identification Number (EIN) verified U.S. business registered in Florida. Tax certificates, liability insurance, and D-U-N-S registration are managed through our compliance workflow. W-9s and current standing on each item are issued on request through our compliance team, with anything in onboarding clearly disclosed on our public credentials page.",
  ]),
  companyImageUrl:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  companyImageAlt: "Warehouse pallet operations",
  operateEyebrow: "How we operate",
  operateHeadline: "What our trade partners can expect",
  operateCards: withKeys([
    {
      title: "Verified business standing",
      body: "U.S. registered Florida LLC in good standing with EIN on file and a W-9 ready to issue. Onboarding documents — tax certificates, insurance, and D-U-N-S — are tracked through our compliance workflow and current standing on each item is shared transparently on our credentials page.",
    },
    {
      title: "Multi-channel sell-through",
      body: "Active retail accounts across major online marketplaces, supporting a hybrid strategy of direct-to-consumer e-commerce and regional B2B fulfillment, with category-managed catalogs, MAP-compliant pricing, and brand-approved listings where required.",
    },
    {
      title: "Predictable fulfillment",
      body: "3PL pallet warehousing with documented receiving SOPs, scheduled outbound LTL, and parcel-level tracking for every shipment we route.",
    },
    {
      title: "Honest documentation",
      body: "Clean PO and invoice data, GTIN-mapped catalogs, and proactive ASN notifications. We won't ship what we can't document.",
    },
    {
      title: "Tier-1 distributor ready",
      body: "Onboarding paperwork formatted to the standards of national distributors. Documentation requests routed to a dedicated compliance contact and returned promptly with current standing on each item.",
    },
    {
      title: "Long-term partnerships",
      body: "We build with the same accounts year over year. Reliability over volume spikes, every time.",
    },
  ]),
  ctaHeadline: "Need verification documents for an onboarding application?",
  ctaBody:
    "Our compliance team responds to wholesale verification requests within one business day.",
  ctaButtonLabel: "Contact Compliance",
  ctaButtonUrl: `mailto:${COMPLIANCE_EMAIL}?subject=${encodeURIComponent(
    "Onboarding documentation request"
  )}`,
  seoTitle: `About ${LEGAL_NAME}`,
  seoDescription:
    "Pernikus LLC is a Florida-based wholesale distributor and multi-channel retailer of consumer packaged goods, headquartered in Orlando.",
};

const wholesalePageDefaults = {
  _id: "wholesalePage",
  _type: "wholesalePage",
  heroEyebrow: "For Brand Partners & Distributors",
  heroHeadline: "A reliable U.S. retail and wholesale partner for consumer brands.",
  heroIntro: `${LEGAL_NAME} is a Florida-based multi-channel retailer and small-format wholesaler. We sell consumer packaged goods to U.S. customers through Amazon, our own website, and direct B2B relationships, and we are actively building authorized reseller and distribution accounts with consumer brands and their primary distribution partners.`,
  heroPrimaryCtaLabel: "Open an account with us",
  heroPrimaryCtaUrl: "/contact",
  heroSecondaryCtaLabel: "Email our buying team",
  heroSecondaryCtaUrl: `mailto:${SALES_EMAIL}?subject=Brand%20Partner%20Inquiry`,
  whoWeAreEyebrow: "Who we are",
  whoWeAreHeadline:
    "A small, professionally run retailer—not a diverter, not a marketplace flipper.",
  whoWeAreBody: paragraphsToBlocks([
    "We were founded in 2023 and operate from Orlando, Florida. Our business is intentionally focused: we move proven, brand-name CPG products to end consumers and small B2B accounts in the United States. We do not engage in unauthorized cross-border diversion, gray-market sourcing, or the resale of products outside their intended distribution channel.",
    "Today, the majority of our volume runs through our Amazon storefront, and we are expanding the share of inventory sourced through brand-direct and authorized-distributor relationships. The goal is simple: clean chain of custody, accurate listings, and a partner brands are comfortable being represented by online.",
  ]),
  whyPartnerEyebrow: "Why partner with us",
  whyPartnerHeadline: "What we bring to a brand relationship.",
  whyPartnerCards: withKeys([
    {
      title: "Authorized-channel discipline",
      body: "We respect MAP policies, advertising guidelines, and channel restrictions. Listings are kept accurate, on-policy, and brand-safe across every storefront we operate.",
    },
    {
      title: "U.S. registered & onboarding-ready",
      body: "Florida LLC in good standing, EIN-verified, with a W-9 ready to issue. Florida Annual Resale Certificate, Certificate of Insurance, and D-U-N-S registration are in onboarding and can be confirmed directly with our compliance team.",
    },
    {
      title: "Direct, responsive ownership",
      body: "No layers of middlemen. Brand reps and distributor account managers reach a decision-maker on the first email. We respond within one business day.",
    },
    {
      title: "Multi-channel reach",
      body: "A hybrid sell-through model: an Amazon FBA storefront with sustained order velocity, our direct e-commerce site, and regional B2B accounts. We grow shelf presence for the brands we carry instead of cannibalizing their existing channels.",
    },
    {
      title: "Clean paperwork",
      body: "W-9, banking and trade references, and signed reseller agreements turned around quickly. Tax certificates and insurance documents shared as soon as they are placed. We are easy to onboard.",
    },
    {
      title: "Long-term orientation",
      body: "We are building a durable retail business, not chasing one-off arbitrage. We commit to consistent reorder cadence and protect the brands we represent.",
    },
    {
      title: "Brand builders, not box movers",
      body: "We invest in our listings: professional product photography, optimized titles and bullet copy, A+ content where supported, and SEO-driven category placement. Our goal is for your brand to look better in our channels than in most of the unauthorized ones.",
    },
    {
      title: "Reporting on request",
      body: "Sell-through summaries, sales velocity, and channel-level reporting available to brand managers and category buyers. Quarterly business reviews supported for established accounts.",
    },
  ]),
  categoriesEyebrow: "Categories we focus on",
  categoriesHeadline: "Where we're actively adding brand partners.",
  categoriesIntro:
    "We concentrate on consumable, replenishment-driven CPG categories with predictable demand and clean shelf-life profiles. If your brand operates in any of the following, we'd like to talk.",
  categoriesList: [
    "Grocery & Snacks",
    "Beverages",
    "Household Essentials",
    "Health & Beauty",
    "Personal Care",
    "Baby & Kids (non-food)",
    "Pet Care",
    "Home Fragrance",
  ],
  finalCtaHeadline: `Open an account with ${LEGAL_NAME}.`,
  finalCtaBody:
    "Brand managers, distributor account reps, and authorized-reseller program administrators — reach our buying team directly. We'll respond with whatever documentation your onboarding process requires.",
  finalCtaPrimaryLabel: "Send a message",
  finalCtaPrimaryUrl: "/contact",
  finalCtaSecondaryLabel: "View credentials & compliance",
  finalCtaSecondaryUrl: "/credentials",
  seoTitle: "Wholesale & Brand Partners",
  seoDescription:
    "Pernikus LLC is a Florida-based multi-channel retailer actively seeking authorized reseller relationships with consumer brands and their primary distribution partners.",
};

const credentialsPageDefaults = {
  _id: "credentialsPage",
  _type: "credentialsPage",
  heroEyebrow: "Credentials & Compliance",
  heroHeadline: "Verify {legalName} in 60 seconds.",
  heroIntro:
    "Public business verification information intended for distributor onboarding, brand-partner compliance reviews, and procurement KYC. Documentation packets — W-9, applicable tax certificates, insurance, and references — are issued promptly on request to our compliance team. Items currently in onboarding are noted below so reviewers always see an accurate snapshot of our standing.",
  heroPrimaryCtaLabel: "Request full documentation packet",
  heroPrimaryCtaSubject: "Documentation packet request",
  footerDisclaimer:
    "The information on this page is provided for legitimate vendor onboarding and compliance review purposes only. Specific identifying numbers (EIN, FL Resale Certificate Number, full insurance policy numbers) are released directly from {complianceEmail} upon verified request, and may be addressed to the requesting organization's certificate holder where applicable.",
  seoTitle: "Credentials & Compliance",
  seoDescription:
    "Public business verification information for Pernikus LLC. Legal entity, tax registrations, insurance, and onboarding documentation for distributor and brand-partner compliance teams.",
};

// =====================================================================
// Seeder
// =====================================================================

async function seedDocument(doc: Record<string, unknown>) {
  const { _id, _type, ...fields } = doc;
  const id = _id as string;

  // 1. Ensure document exists (no-op if already exists)
  await client.createIfNotExists({ _id: id, _type: _type as string });

  // 2. Patch with setIfMissing for each field — only fills empty fields
  let patch = client.patch(id);
  for (const [key, value] of Object.entries(fields)) {
    patch = patch.setIfMissing({ [key]: value });
  }
  await patch.commit();

  console.log(`✓ Seeded ${id} (only filled empty fields, your edits preserved)`);
}

async function main() {
  console.log("Seeding singleton documents with current site copy...\n");

  await seedDocument(siteSettingsDefaults);
  await seedDocument(homePageDefaults);
  await seedDocument(aboutPageDefaults);
  await seedDocument(wholesalePageDefaults);
  await seedDocument(credentialsPageDefaults);

  console.log("\n✓ Done. Refresh /studio to see populated fields.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
