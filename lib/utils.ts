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
  address: {
    line1: "9550 Satellite Blvd",
    city: "Orlando",
    state: "FL",
    zip: "32837",
    country: "USA",
  },
  established: 2024,
} as const;

export const CATEGORIES = [
  { slug: "grocery-snacks", name: "Grocery & Snacks" },
  { slug: "health-beauty", name: "Health & Beauty" },
  { slug: "household-essentials", name: "Household Essentials" },
  { slug: "beverages", name: "Beverages" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
