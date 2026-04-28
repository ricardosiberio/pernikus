import { defineField, defineType } from "sanity";

export const wholesalePage = defineType({
  name: "wholesalePage",
  title: "Wholesale Page",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero Section", options: { collapsible: true, collapsed: false } },
    { name: "whoWeAre", title: "Who We Are Section", options: { collapsible: true, collapsed: false } },
    { name: "whyPartner", title: "Why Partner With Us — Value Cards", options: { collapsible: true, collapsed: true } },
    { name: "categories", title: "Categories We Focus On", options: { collapsible: true, collapsed: true } },
    { name: "finalCta", title: "Bottom CTA Banner", options: { collapsible: true, collapsed: true } },
    { name: "seo", title: "SEO / Metadata", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // Hero
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", fieldset: "hero" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", fieldset: "hero" }),
    defineField({ name: "heroIntro", title: "Hero Intro Paragraph", type: "text", rows: 4, fieldset: "hero" }),
    defineField({ name: "heroPrimaryCtaLabel", title: "Primary CTA Label", type: "string", fieldset: "hero" }),
    defineField({ name: "heroPrimaryCtaUrl", title: "Primary CTA URL", type: "string", fieldset: "hero" }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Secondary CTA Label", type: "string", fieldset: "hero" }),
    defineField({
      name: "heroSecondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      description: "Use mailto:... for email links",
      fieldset: "hero",
    }),

    // Who we are
    defineField({ name: "whoWeAreEyebrow", title: "Section Eyebrow", type: "string", fieldset: "whoWeAre" }),
    defineField({ name: "whoWeAreHeadline", title: "Section Headline", type: "string", fieldset: "whoWeAre" }),
    defineField({
      name: "whoWeAreBody",
      title: "Body Paragraphs",
      type: "array",
      description: "Rich text — bold, italic, links supported.",
      fieldset: "whoWeAre",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] }],
    }),

    // Why partner
    defineField({ name: "whyPartnerEyebrow", title: "Section Eyebrow", type: "string", fieldset: "whyPartner" }),
    defineField({ name: "whyPartnerHeadline", title: "Section Headline", type: "string", fieldset: "whyPartner" }),
    defineField({
      name: "whyPartnerCards",
      title: "Value Cards",
      type: "array",
      description: "Cards shown in a 3-column grid. Each has title + body.",
      fieldset: "whyPartner",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
    }),

    // Categories
    defineField({ name: "categoriesEyebrow", title: "Section Eyebrow", type: "string", fieldset: "categories" }),
    defineField({ name: "categoriesHeadline", title: "Section Headline", type: "string", fieldset: "categories" }),
    defineField({ name: "categoriesIntro", title: "Section Intro", type: "text", rows: 3, fieldset: "categories" }),
    defineField({
      name: "categoriesList",
      title: "Category Names",
      type: "array",
      description: "Plain text list of category names. Order matters.",
      fieldset: "categories",
      of: [{ type: "string" }],
    }),

    // Final CTA
    defineField({ name: "finalCtaHeadline", title: "Headline", type: "string", fieldset: "finalCta" }),
    defineField({ name: "finalCtaBody", title: "Body", type: "text", rows: 3, fieldset: "finalCta" }),
    defineField({ name: "finalCtaPrimaryLabel", title: "Primary Button Label", type: "string", fieldset: "finalCta" }),
    defineField({ name: "finalCtaPrimaryUrl", title: "Primary Button URL", type: "string", fieldset: "finalCta" }),
    defineField({ name: "finalCtaSecondaryLabel", title: "Secondary Button Label", type: "string", fieldset: "finalCta" }),
    defineField({ name: "finalCtaSecondaryUrl", title: "Secondary Button URL", type: "string", fieldset: "finalCta" }),

    // SEO
    defineField({ name: "seoTitle", title: "Page Title (SEO)", type: "string", fieldset: "seo" }),
    defineField({ name: "seoDescription", title: "Meta Description", type: "text", rows: 2, fieldset: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Wholesale Page Content" }) },
});
