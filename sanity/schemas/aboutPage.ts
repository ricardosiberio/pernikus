import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero Section", options: { collapsible: true, collapsed: false } },
    { name: "company", title: "Company Section (left text + right image)", options: { collapsible: true, collapsed: false } },
    { name: "operate", title: "How We Operate Section", options: { collapsible: true, collapsed: true } },
    { name: "cta", title: "Bottom CTA Card", options: { collapsible: true, collapsed: true } },
    { name: "seo", title: "SEO / Metadata", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // Hero
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", fieldset: "hero" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", fieldset: "hero", validation: (r) => r.max(140) }),

    // Company section
    defineField({ name: "companyEyebrow", title: "Section Eyebrow", type: "string", fieldset: "company" }),
    defineField({ name: "companyHeadline", title: "Section Headline", type: "string", fieldset: "company" }),
    defineField({
      name: "companyBody",
      title: "Body Paragraphs",
      type: "array",
      description: "Rich text — supports bold, italic, links. Each paragraph is one block.",
      fieldset: "company",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] }],
    }),
    defineField({
      name: "companyImageUrl",
      title: "Side Image URL",
      type: "url",
      description: "Full URL to image displayed beside the body text. Leave empty to hide image.",
      fieldset: "company",
    }),
    defineField({
      name: "companyImageAlt",
      title: "Side Image Alt Text",
      type: "string",
      fieldset: "company",
    }),

    // Operate section
    defineField({ name: "operateEyebrow", title: "Section Eyebrow", type: "string", fieldset: "operate" }),
    defineField({ name: "operateHeadline", title: "Section Headline", type: "string", fieldset: "operate" }),
    defineField({
      name: "operateCards",
      title: "Trade Partner Expectation Cards",
      type: "array",
      description: "Cards shown in a 3-column grid. Each has a title and short body.",
      fieldset: "operate",
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

    // CTA
    defineField({ name: "ctaHeadline", title: "CTA Headline", type: "string", fieldset: "cta" }),
    defineField({ name: "ctaBody", title: "CTA Body", type: "text", rows: 2, fieldset: "cta" }),
    defineField({ name: "ctaButtonLabel", title: "Button Label", type: "string", fieldset: "cta" }),
    defineField({
      name: "ctaButtonUrl",
      title: "Button URL",
      type: "string",
      description: 'Use mailto:compliance@... for email, or an internal path like "/contact"',
      fieldset: "cta",
    }),

    // SEO
    defineField({ name: "seoTitle", title: "Page Title (SEO)", type: "string", fieldset: "seo" }),
    defineField({ name: "seoDescription", title: "Meta Description", type: "text", rows: 2, fieldset: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About Page Content" }) },
});
