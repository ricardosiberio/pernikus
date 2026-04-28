import { groq, createClient } from "next-sanity";
import { withTimeout } from "@/lib/with-timeout";
import { SITE, CATEGORIES as FALLBACK_CATEGORIES } from "@/lib/utils";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Dedicated client with CDN OFF for CMS content fetches.
// CMS edits should appear quickly; we accept the small latency cost on these
// (low-frequency) fetches in exchange for fresher data.
const sanityClient = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * CMS content fetchers with hardcoded fallbacks.
 *
 * Each page exports a `getXContent()` function. If Sanity is reachable
 * AND the singleton document exists AND has the field set, the Sanity
 * value is used. Otherwise the hardcoded default (matching the current
 * design) is returned. This means the site never breaks — even if Sanity
 * is empty, pages render exactly as they did before wiring.
 */

const FETCH_TIMEOUT_MS = 4000;

async function safeFetch<T>(query: string): Promise<T | null> {
  try {
    return await withTimeout(sanityClient.fetch<T>(query), FETCH_TIMEOUT_MS);
  } catch {
    return null;
  }
}

// =====================================================================
// Categories (dynamic — newly created Sanity categories appear automatically)
// =====================================================================

export type Category = {
  slug: string;
  name: string;
};

const allCategoriesQuery = groq`
  *[_type == "category" && defined(slug.current) && defined(name)]
    | order(coalesce(order, 999) asc, name asc) {
      "slug": slug.current,
      name
    }
`;

/**
 * Fetch all categories from Sanity, ordered by `order` then name.
 * Falls back to the hardcoded list in lib/utils.ts if Sanity is unreachable.
 */
export async function getAllCategories(): Promise<Category[]> {
  const result = await safeFetch<Category[]>(allCategoriesQuery);
  if (!result || result.length === 0) {
    return FALLBACK_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));
  }
  return result;
}

/** Convert plain-text paragraphs to a minimal Portable Text array for defaults. */
function paragraphsToBlocks(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  children: { _type: "span"; _key: string; text: string; marks: string[] }[];
};

// =====================================================================
// Site Settings
// =====================================================================

export type SiteSettingsContent = {
  legalName: string;
  displayName: string;
  entityType: string;
  jurisdiction: string;
  establishedYear: number;
  salesEmail: string;
  complianceEmail: string;
  supportEmail: string;
  phoneDisplay: string;
  phoneRaw: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressCountry: string;
  einLast4: string;
  sunbizDocumentNumber: string;
  flResaleCertificate: "active" | "in-progress" | "";
  dunsNumber: string;
  bankReferenceOnRequest: boolean;
  tradeReferencesOnRequest: boolean;
  insuranceInsurer: string;
  insuranceGeneralLiability: string;
  insuranceProductLiability: string;
  insuranceCoiOnRequest: boolean;
  amazonStorefrontUrl: string;
};

export const siteSettingsDefaults: SiteSettingsContent = {
  legalName: SITE.legalName,
  displayName: SITE.name,
  entityType: SITE.credentials.entityType,
  jurisdiction: SITE.credentials.jurisdiction,
  establishedYear: SITE.credentials.establishedYear,
  salesEmail: SITE.email,
  complianceEmail: SITE.complianceEmail,
  supportEmail: SITE.email,
  phoneDisplay: SITE.phone,
  phoneRaw: SITE.phoneRaw,
  addressLine1: SITE.address.line1,
  addressLine2: "",
  addressCity: SITE.address.city,
  addressState: SITE.address.state,
  addressZip: SITE.address.zip,
  addressCountry: SITE.address.country,
  einLast4: SITE.credentials.einLast4,
  sunbizDocumentNumber: SITE.credentials.sunbizDocumentNumber,
  flResaleCertificate: SITE.credentials.flResaleCertificate,
  dunsNumber: SITE.credentials.dunsNumber,
  bankReferenceOnRequest: SITE.credentials.bankReferenceOnRequest,
  tradeReferencesOnRequest: SITE.credentials.tradeReferencesOnRequest,
  insuranceInsurer: SITE.credentials.insurance.insurer,
  insuranceGeneralLiability: SITE.credentials.insurance.generalLiability,
  insuranceProductLiability: SITE.credentials.insurance.productLiability,
  insuranceCoiOnRequest: SITE.credentials.insurance.coiOnRequest,
  amazonStorefrontUrl: SITE.credentials.amazonStorefrontUrl,
};

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  const data = await safeFetch<Partial<SiteSettingsContent> | null>(siteSettingsQuery);
  if (!data) return siteSettingsDefaults;
  return mergeNonEmpty(siteSettingsDefaults, data);
}

// =====================================================================
// Homepage
// =====================================================================

export type HomeContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaUrl: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaUrl: string;
  valueProps: { title: string; body: string }[];
  categoriesEyebrow: string;
  categoriesHeadline: string;
  featuredEyebrow: string;
  featuredHeadline: string;
  wholesaleCtaEyebrow: string;
  wholesaleCtaHeadline: string;
  wholesaleCtaBody: string;
  wholesaleCtaButtonLabel: string;
  wholesaleCtaButtonUrl: string;
};

export const homeDefaults: HomeContent = {
  heroEyebrow: "Pernikus LLC · Florida",
  heroHeadline: "Everyday goods, reliably delivered.",
  heroSubheadline:
    "Pantry staples, beverages, household essentials, and personal care — sourced from trusted brands and shipped from our Florida operations.",
  heroPrimaryCtaLabel: "Shop Now",
  heroPrimaryCtaUrl: "/shop",
  heroSecondaryCtaLabel: "Our Story",
  heroSecondaryCtaUrl: "/about",
  valueProps: [
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
  ],
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

const homePageQuery = groq`*[_type == "homePage"][0]`;

export async function getHomeContent(): Promise<HomeContent> {
  const data = await safeFetch<Partial<HomeContent> | null>(homePageQuery);
  if (!data) return homeDefaults;
  return mergeNonEmpty(homeDefaults, data);
}

// =====================================================================
// About Page
// =====================================================================

export type AboutContent = {
  heroEyebrow: string;
  heroHeadline: string;
  companyEyebrow: string;
  companyHeadline: string;
  companyBody: PortableTextBlock[];
  companyImageUrl: string;
  companyImageAlt: string;
  operateEyebrow: string;
  operateHeadline: string;
  operateCards: { title: string; body: string }[];
  ctaHeadline: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonUrl: string;
  seoTitle: string;
  seoDescription: string;
};

export const aboutDefaults: AboutContent = {
  heroEyebrow: `About ${SITE.legalName}`,
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
  operateCards: [
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
  ],
  ctaHeadline: "Need verification documents for an onboarding application?",
  ctaBody:
    "Our compliance team responds to wholesale verification requests within one business day.",
  ctaButtonLabel: "Contact Compliance",
  ctaButtonUrl: `mailto:${SITE.complianceEmail}?subject=${encodeURIComponent("Onboarding documentation request")}`,
  seoTitle: `About ${SITE.legalName}`,
  seoDescription:
    "Pernikus LLC is a Florida-based wholesale distributor and multi-channel retailer of consumer packaged goods, headquartered in Orlando.",
};

const aboutPageQuery = groq`*[_type == "aboutPage"][0]`;

export async function getAboutContent(): Promise<AboutContent> {
  const data = await safeFetch<Partial<AboutContent> | null>(aboutPageQuery);
  if (!data) return aboutDefaults;
  return mergeNonEmpty(aboutDefaults, data);
}

// =====================================================================
// Wholesale Page
// =====================================================================

export type WholesaleContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaUrl: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaUrl: string;
  whoWeAreEyebrow: string;
  whoWeAreHeadline: string;
  whoWeAreBody: PortableTextBlock[];
  whyPartnerEyebrow: string;
  whyPartnerHeadline: string;
  whyPartnerCards: { title: string; body: string }[];
  categoriesEyebrow: string;
  categoriesHeadline: string;
  categoriesIntro: string;
  categoriesList: string[];
  finalCtaHeadline: string;
  finalCtaBody: string;
  finalCtaPrimaryLabel: string;
  finalCtaPrimaryUrl: string;
  finalCtaSecondaryLabel: string;
  finalCtaSecondaryUrl: string;
  seoTitle: string;
  seoDescription: string;
};

export const wholesaleDefaults: WholesaleContent = {
  heroEyebrow: "For Brand Partners & Distributors",
  heroHeadline: "A reliable U.S. retail and wholesale partner for consumer brands.",
  heroIntro: `${SITE.legalName} is a Florida-based multi-channel retailer and small-format wholesaler. We sell consumer packaged goods to U.S. customers through Amazon, our own website, and direct B2B relationships, and we are actively building authorized reseller and distribution accounts with consumer brands and their primary distribution partners.`,
  heroPrimaryCtaLabel: "Open an account with us",
  heroPrimaryCtaUrl: "/contact",
  heroSecondaryCtaLabel: "Email our buying team",
  heroSecondaryCtaUrl: `mailto:${SITE.email}?subject=Brand%20Partner%20Inquiry`,
  whoWeAreEyebrow: "Who we are",
  whoWeAreHeadline:
    "A small, professionally run retailer—not a diverter, not a marketplace flipper.",
  whoWeAreBody: paragraphsToBlocks([
    `We were founded in ${SITE.established} and operate from Orlando, Florida. Our business is intentionally focused: we move proven, brand-name CPG products to end consumers and small B2B accounts in the United States. We do not engage in unauthorized cross-border diversion, gray-market sourcing, or the resale of products outside their intended distribution channel.`,
    "Today, the majority of our volume runs through our Amazon storefront, and we are expanding the share of inventory sourced through brand-direct and authorized-distributor relationships. The goal is simple: clean chain of custody, accurate listings, and a partner brands are comfortable being represented by online.",
  ]),
  whyPartnerEyebrow: "Why partner with us",
  whyPartnerHeadline: "What we bring to a brand relationship.",
  whyPartnerCards: [
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
  ],
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
  finalCtaHeadline: `Open an account with ${SITE.legalName}.`,
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

const wholesalePageQuery = groq`*[_type == "wholesalePage"][0]`;

export async function getWholesaleContent(): Promise<WholesaleContent> {
  const data = await safeFetch<Partial<WholesaleContent> | null>(wholesalePageQuery);
  if (!data) return wholesaleDefaults;
  return mergeNonEmpty(wholesaleDefaults, data);
}

// =====================================================================
// Credentials Page
// =====================================================================

export type CredentialsPageContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaSubject: string;
  footerDisclaimer: string;
  seoTitle: string;
  seoDescription: string;
};

export const credentialsPageDefaults: CredentialsPageContent = {
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

const credentialsPageQuery = groq`*[_type == "credentialsPage"][0]`;

export async function getCredentialsPageContent(): Promise<CredentialsPageContent> {
  const data = await safeFetch<Partial<CredentialsPageContent> | null>(credentialsPageQuery);
  if (!data) return credentialsPageDefaults;
  return mergeNonEmpty(credentialsPageDefaults, data);
}

// =====================================================================
// Helpers
// =====================================================================

/**
 * Merge a partial fetched object over defaults. Empty strings, null,
 * undefined, and empty arrays in the fetched data fall back to defaults.
 */
function mergeNonEmpty<T extends Record<string, unknown>>(
  defaults: T,
  fetched: Partial<T> | null | undefined
): T {
  if (!fetched) return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const v = fetched[key];
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    result[key] = v as T[keyof T];
  }
  return result;
}

/** Substitute {legalName} and {complianceEmail} placeholders in a string. */
export function substitutePlaceholders(
  text: string,
  ctx: { legalName: string; complianceEmail: string }
): string {
  return text
    .replace(/\{legalName\}/g, ctx.legalName)
    .replace(/\{complianceEmail\}/g, ctx.complianceEmail);
}
