import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero Section", options: { collapsible: true, collapsed: false } },
    { name: "valueProps", title: "Value Props Strip (3 cards under hero)", options: { collapsible: true, collapsed: true } },
    { name: "categories", title: "Categories Section", options: { collapsible: true, collapsed: true } },
    { name: "featured", title: "Featured Products Section", options: { collapsible: true, collapsed: true } },
    { name: "wholesaleCta", title: "Wholesale CTA Banner (bottom)", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ---------------- Hero ----------------
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow Text",
      type: "string",
      description: 'Small uppercase text above the headline.',
      fieldset: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      fieldset: "hero",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 3,
      fieldset: "hero",
      validation: (r) => r.max(400),
    }),
    defineField({
      name: "heroPrimaryCtaLabel",
      title: "Primary CTA Button Label",
      type: "string",
      fieldset: "hero",
    }),
    defineField({
      name: "heroPrimaryCtaUrl",
      title: "Primary CTA URL",
      type: "string",
      fieldset: "hero",
    }),
    defineField({
      name: "heroSecondaryCtaLabel",
      title: "Secondary CTA Button Label",
      type: "string",
      fieldset: "hero",
    }),
    defineField({
      name: "heroSecondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      fieldset: "hero",
    }),

    // ---------------- Value Props ----------------
    defineField({
      name: "valueProps",
      title: "Value Prop Cards",
      type: "array",
      description: "3 cards displayed in a row under the hero. Icons stay fixed in code.",
      fieldset: "valueProps",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "body",
              title: "Body Text",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
      validation: (r) => r.max(3),
    }),

    // ---------------- Categories Section ----------------
    defineField({
      name: "categoriesEyebrow",
      title: "Section Eyebrow",
      type: "string",
      description: 'Small uppercase text, e.g. "Categories"',
      fieldset: "categories",
    }),
    defineField({
      name: "categoriesHeadline",
      title: "Section Headline",
      type: "string",
      description: 'e.g. "Shop by category"',
      fieldset: "categories",
    }),

    // ---------------- Featured Products Section ----------------
    defineField({
      name: "featuredEyebrow",
      title: "Section Eyebrow",
      type: "string",
      fieldset: "featured",
    }),
    defineField({
      name: "featuredHeadline",
      title: "Section Headline",
      type: "string",
      fieldset: "featured",
    }),

    // ---------------- Wholesale CTA Banner ----------------
    defineField({
      name: "wholesaleCtaEyebrow",
      title: "Eyebrow",
      type: "string",
      fieldset: "wholesaleCta",
    }),
    defineField({
      name: "wholesaleCtaHeadline",
      title: "Headline",
      type: "string",
      fieldset: "wholesaleCta",
    }),
    defineField({
      name: "wholesaleCtaBody",
      title: "Body Text",
      type: "text",
      rows: 2,
      fieldset: "wholesaleCta",
    }),
    defineField({
      name: "wholesaleCtaButtonLabel",
      title: "Button Label",
      type: "string",
      fieldset: "wholesaleCta",
    }),
    defineField({
      name: "wholesaleCtaButtonUrl",
      title: "Button URL",
      type: "string",
      fieldset: "wholesaleCta",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Content" }),
  },
});
