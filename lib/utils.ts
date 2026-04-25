import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export const SITE = {
  name: "Pernikus LLC",
  legalName: "Pernikus LLC",
  phone: "(407) 881-7996",
  phoneRaw: "+14078817996",
  email: "sales@pernikuswholesale.com",
  complianceEmail: "compliance@pernikuswholesale.com",
  address: {
    line1: "9550 Satellite Blvd",
    city: "Orlando",
    state: "FL",
    zip: "32837",
    country: "USA",
  },
  established: 2023,
  credentials: {
    legalEntity: "Pernikus LLC",
    entityType: "Limited Liability Company",
    jurisdiction: "State of Florida, USA",
    establishedYear: 2023,
    einLast4: "" as string, // e.g. "1234" once issued; empty = "Available on request"
    sunbizDocumentNumber: "" as string, // FL Sunbiz filing number, e.g. L23000XXXXXX
    flResaleCertificate: "active" as "active" | "in-progress" | "",
    dunsNumber: "" as string, // 9-digit, format with dashes when set: "123-456-789"
    amazonStorefrontUrl: "" as string, // full URL to Amazon storefront
    insurance: {
      insurer: "" as string, // e.g. "Hiscox" or "Next Insurance" — empty hides specific coverage amounts
      generalLiability: "" as string, // e.g. "$1M / $2M aggregate"
      productLiability: "" as string, // e.g. "$1M"
      coiOnRequest: true,
    },
    bankReferenceOnRequest: true,
    tradeReferencesOnRequest: true,
  },
} as const;

export const CATEGORIES = [
  { slug: "grocery-snacks", name: "Grocery & Snacks" },
  { slug: "health-beauty", name: "Health & Beauty" },
  { slug: "household-essentials", name: "Household Essentials" },
  { slug: "beverages", name: "Beverages" },
  { slug: "toys-games", name: "Toys & Games" },
  { slug: "apparel", name: "Apparel" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
