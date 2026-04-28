import { defineField, defineType } from "sanity";

export const credentialsPage = defineType({
  name: "credentialsPage",
  title: "Credentials Page",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero Section", options: { collapsible: true, collapsed: false } },
    { name: "footer", title: "Footer Disclaimer", options: { collapsible: true, collapsed: true } },
    { name: "seo", title: "SEO / Metadata", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", fieldset: "hero" }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      description: 'You can include {legalName} as a placeholder, e.g. "Verify {legalName} in 60 seconds."',
      fieldset: "hero",
    }),
    defineField({
      name: "heroIntro",
      title: "Hero Intro Paragraph",
      type: "text",
      rows: 5,
      fieldset: "hero",
    }),
    defineField({ name: "heroPrimaryCtaLabel", title: "Primary CTA Label", type: "string", fieldset: "hero" }),
    defineField({
      name: "heroPrimaryCtaSubject",
      title: "Primary CTA Email Subject",
      type: "string",
      description: 'Subject line for the mailto link (sends to compliance email).',
      fieldset: "hero",
    }),

    defineField({
      name: "footerDisclaimer",
      title: "Footer Disclaimer",
      type: "text",
      rows: 4,
      description: "Legal/compliance disclaimer at the bottom of the page.",
      fieldset: "footer",
    }),

    defineField({ name: "seoTitle", title: "Page Title (SEO)", type: "string", fieldset: "seo" }),
    defineField({ name: "seoDescription", title: "Meta Description", type: "text", rows: 2, fieldset: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Credentials Page Content" }) },
});
