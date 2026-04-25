import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "1-2 sentences shown on product cards.",
      validation: (r) => r.max(220),
    }),
    defineField({
      name: "description",
      title: "Long Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
    defineField({
      name: "upc",
      title: "UPC / GTIN",
      type: "string",
    }),
    defineField({
      name: "priceCents",
      title: "Price (in cents)",
      type: "number",
      description: "Retail price in cents. e.g. 1299 for $12.99.",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "compareAtPriceCents",
      title: "Compare-at Price (in cents)",
      type: "number",
      description: "Optional MSRP for showing a strikethrough.",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured on Home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "caseSize",
      title: "Case / Pack Size",
      type: "string",
      description: 'e.g. "Case of 24"',
    }),
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "category.name" },
  },
});
