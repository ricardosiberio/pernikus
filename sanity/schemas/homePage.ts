import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  // Singleton — only one instance ever exists
  fieldsets: [
    { name: "hero", title: "Hero Section", options: { collapsible: true, collapsed: false } },
    { name: "trust", title: "Trust Signals Strip", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ---------------- Hero ----------------
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow Text",
      type: "string",
      description: 'Small uppercase text above the headline, e.g. "Florida-based multi-channel retailer"',
      fieldset: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: "Main page title — short and punchy.",
      fieldset: "hero",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 3,
      description: "1-2 sentence supporting paragraph below the headline.",
      fieldset: "hero",
      validation: (r) => r.max(400),
    }),
    defineField({
      name: "heroPrimaryCtaLabel",
      title: "Primary CTA Button Label",
      type: "string",
      description: 'e.g. "Shop the catalog"',
      fieldset: "hero",
    }),
    defineField({
      name: "heroPrimaryCtaUrl",
      title: "Primary CTA URL",
      type: "string",
      description: 'Internal path like "/shop" or full URL.',
      fieldset: "hero",
    }),
    defineField({
      name: "heroSecondaryCtaLabel",
      title: "Secondary CTA Button Label",
      type: "string",
      description: 'e.g. "Wholesale inquiries"',
      fieldset: "hero",
    }),
    defineField({
      name: "heroSecondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      fieldset: "hero",
    }),

    // ---------------- Trust Signals ----------------
    defineField({
      name: "trustSignals",
      title: "Trust Signal Items",
      type: "array",
      description: "Short credibility points displayed in a row across the homepage.",
      fieldset: "trust",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "EIN-verified Florida LLC"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "sublabel",
              title: "Sublabel (optional)",
              type: "string",
              description: 'e.g. "Established 2023"',
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "sublabel" },
          },
        },
      ],
      validation: (r) => r.max(6),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage Content" }),
  },
});
