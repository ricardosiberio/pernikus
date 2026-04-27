import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one instance ever exists
  fieldsets: [
    { name: "identity", title: "Business Identity", options: { collapsible: true, collapsed: false } },
    { name: "contact", title: "Contact Information", options: { collapsible: true, collapsed: false } },
    { name: "address", title: "Mailing / Operations Address", options: { collapsible: true, collapsed: true } },
    { name: "credentials", title: "Credentials & Compliance", options: { collapsible: true, collapsed: false } },
    { name: "insurance", title: "Insurance", options: { collapsible: true, collapsed: true } },
    { name: "channels", title: "Sales Channels", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ---------------- Identity ----------------
    defineField({
      name: "legalName",
      title: "Legal Business Name",
      type: "string",
      fieldset: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      description: "Shown in headers, footers, and titles. Usually same as legal name.",
      fieldset: "identity",
    }),
    defineField({
      name: "entityType",
      title: "Entity Type",
      type: "string",
      description: 'e.g. "Limited Liability Company"',
      fieldset: "identity",
    }),
    defineField({
      name: "jurisdiction",
      title: "Jurisdiction",
      type: "string",
      description: 'e.g. "State of Florida, USA"',
      fieldset: "identity",
    }),
    defineField({
      name: "establishedYear",
      title: "Established Year",
      type: "number",
      fieldset: "identity",
      validation: (r) => r.min(1900).max(new Date().getFullYear()),
    }),

    // ---------------- Contact ----------------
    defineField({
      name: "salesEmail",
      title: "Sales Email",
      type: "string",
      fieldset: "contact",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "complianceEmail",
      title: "Compliance Email",
      type: "string",
      fieldset: "contact",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "supportEmail",
      title: "Support / General Email",
      type: "string",
      fieldset: "contact",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Phone (display format)",
      type: "string",
      description: 'e.g. "(407) 881-7996"',
      fieldset: "contact",
    }),
    defineField({
      name: "phoneRaw",
      title: "Phone (E.164 format for tel: links)",
      type: "string",
      description: 'e.g. "+14078817996"',
      fieldset: "contact",
    }),

    // ---------------- Address ----------------
    defineField({
      name: "addressLine1",
      title: "Street Address",
      type: "string",
      fieldset: "address",
    }),
    defineField({
      name: "addressLine2",
      title: "Suite / Unit",
      type: "string",
      fieldset: "address",
    }),
    defineField({
      name: "addressCity",
      title: "City",
      type: "string",
      fieldset: "address",
    }),
    defineField({
      name: "addressState",
      title: "State",
      type: "string",
      fieldset: "address",
    }),
    defineField({
      name: "addressZip",
      title: "ZIP Code",
      type: "string",
      fieldset: "address",
    }),
    defineField({
      name: "addressCountry",
      title: "Country",
      type: "string",
      initialValue: "USA",
      fieldset: "address",
    }),

    // ---------------- Credentials ----------------
    defineField({
      name: "einLast4",
      title: "EIN — Last 4 Digits",
      type: "string",
      description: 'Leave empty to display "Available on request". Otherwise enter last 4 only (e.g. "1234").',
      fieldset: "credentials",
      validation: (r) => r.max(4),
    }),
    defineField({
      name: "sunbizDocumentNumber",
      title: "FL Sunbiz Document Number",
      type: "string",
      description: 'Florida Department of State filing number, e.g. "L23000XXXXXX"',
      fieldset: "credentials",
    }),
    defineField({
      name: "flResaleCertificate",
      title: "FL Annual Resale Certificate Status",
      type: "string",
      fieldset: "credentials",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Application In Progress", value: "in-progress" },
          { title: "Not Applicable / Hide", value: "" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      name: "dunsNumber",
      title: "D-U-N-S Number",
      type: "string",
      description: 'Format with dashes, e.g. "041-702-526". Leave empty to display "In issuance".',
      fieldset: "credentials",
    }),
    defineField({
      name: "bankReferenceOnRequest",
      title: "Bank Reference Available on Request",
      type: "boolean",
      fieldset: "credentials",
      initialValue: true,
    }),
    defineField({
      name: "tradeReferencesOnRequest",
      title: "Trade References Available on Request",
      type: "boolean",
      fieldset: "credentials",
      initialValue: true,
    }),

    // ---------------- Insurance ----------------
    defineField({
      name: "insuranceInsurer",
      title: "Insurance Carrier",
      type: "string",
      description: 'e.g. "Hiscox" or "Next Insurance". Leave empty if no policy is bound yet — page will show "Pending placement".',
      fieldset: "insurance",
    }),
    defineField({
      name: "insuranceGeneralLiability",
      title: "General Liability Coverage",
      type: "string",
      description: 'e.g. "$1M / $2M aggregate"',
      fieldset: "insurance",
    }),
    defineField({
      name: "insuranceProductLiability",
      title: "Product Liability Coverage",
      type: "string",
      description: 'e.g. "$1M"',
      fieldset: "insurance",
    }),
    defineField({
      name: "insuranceCoiOnRequest",
      title: "COI Available on Request",
      type: "boolean",
      fieldset: "insurance",
      initialValue: true,
    }),

    // ---------------- Channels ----------------
    defineField({
      name: "amazonStorefrontUrl",
      title: "Amazon Storefront URL",
      type: "url",
      description: "Full URL to your Amazon storefront. Leave empty to hide.",
      fieldset: "channels",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
