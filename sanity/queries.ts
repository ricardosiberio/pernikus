import { groq } from "next-sanity";

export const allProductsQuery = groq`*[_type == "product"] | order(featured desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  priceCents,
  compareAtPriceCents,
  inStock,
  featured,
  caseSize,
  sku,
  image,
  "category": category->{ name, "slug": slug.current }
}`;

export const featuredProductsQuery = groq`*[_type == "product" && featured == true] | order(title asc)[0...6] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  priceCents,
  compareAtPriceCents,
  image,
  "category": category->{ name, "slug": slug.current }
}`;

export const productsByCategoryQuery = groq`*[_type == "product" && category->slug.current == $slug] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  priceCents,
  compareAtPriceCents,
  inStock,
  caseSize,
  image,
  "category": category->{ name, "slug": slug.current }
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  description,
  priceCents,
  compareAtPriceCents,
  inStock,
  featured,
  caseSize,
  sku,
  upc,
  image,
  "category": category->{ name, "slug": slug.current }
}`;

export const allCategoriesQuery = groq`*[_type == "category"] | order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  description
}`;

export type SanityProduct = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: unknown;
  priceCents?: number;
  compareAtPriceCents?: number;
  inStock?: boolean;
  featured?: boolean;
  caseSize?: string;
  sku?: string;
  upc?: string;
  image?: { asset: { _ref: string }; alt?: string };
  category?: { name: string; slug: string };
};

export type SanityCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};
