import type { Metadata } from "next";
import { CheckCircle2, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import {
  getCredentialsPageContent,
  getSiteSettings,
  substitutePlaceholders,
} from "@/lib/sanity-content";

export const revalidate = 10;

const ON_REQUEST = "Available on request";
const IN_ISSUANCE = "In issuance — available on request";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCredentialsPageContent();
  return {
    title: content.seoTitle,
    description: content.seoDescription,
  };
}

export default async function CredentialsPage() {
  const [content, site] = await Promise.all([
    getCredentialsPageContent(),
    getSiteSettings(),
  ]);

  const ctx = {
    legalName: site.legalName,
    complianceEmail: site.complianceEmail,
  };

  const sunbizUrl = site.sunbizDocumentNumber
    ? `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=DocumentNumber&directionType=Initial&searchNameOrder=&aggregateId=&searchTerm=${encodeURIComponent(
        site.sunbizDocumentNumber
      )}`
    : "https://search.sunbiz.org/";

  const flResaleStatusLabel =
    site.flResaleCertificate === "active"
      ? "Active — Number on file"
      : site.flResaleCertificate === "in-progress"
        ? "Application in progress"
        : ON_REQUEST;

  const heroHeadline = substitutePlaceholders(content.heroHeadline, ctx);
  const footerDisclaimer = substitutePlaceholders(content.footerDisclaimer, ctx);

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {heroHeadline}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            {content.heroIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.complianceEmail}?subject=${encodeURIComponent(
                content.heroPrimaryCtaSubject
              )}`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-100"
            >
              <FileText className="h-4 w-4" />
              {content.heroPrimaryCtaLabel}
            </a>
            <a
              href={`mailto:${site.complianceEmail}`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {site.complianceEmail}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <CredentialBlock
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Legal Entity"
          rows={[
            { label: "Legal name", value: site.legalName },
            { label: "Entity type", value: site.entityType },
            { label: "Jurisdiction", value: site.jurisdiction },
            { label: "Established", value: String(site.establishedYear) },
            {
              label: "Florida Sunbiz",
              value: site.sunbizDocumentNumber || ON_REQUEST,
              href: sunbizUrl,
              hrefLabel: site.sunbizDocumentNumber ? "View on Sunbiz" : "Search Sunbiz",
            },
            {
              label: "Registered address",
              value: `${site.addressLine1}${site.addressLine2 ? `, ${site.addressLine2}` : ""}, ${site.addressCity}, ${site.addressState} ${site.addressZip}`,
            },
          ]}
        />

        <CredentialBlock
          icon={<FileText className="h-5 w-5" />}
          title="Tax & Vendor Registration"
          rows={[
            {
              label: "EIN (Employer Identification Number)",
              value: site.einLast4
                ? `XX-XXX${site.einLast4} (full on request)`
                : ON_REQUEST,
            },
            {
              label: "FL Annual Resale Certificate (DR-13)",
              value: flResaleStatusLabel,
            },
            {
              label: "D-U-N-S Number",
              value: site.dunsNumber || IN_ISSUANCE,
            },
            {
              label: "W-9 (signed)",
              value: "Available same business day",
            },
          ]}
        />

        <CredentialBlock
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Insurance"
          rows={[
            {
              label: "Carrier",
              value: site.insuranceInsurer || IN_ISSUANCE,
            },
            {
              label: "General Liability",
              value:
                site.insuranceInsurer && site.insuranceGeneralLiability
                  ? site.insuranceGeneralLiability
                  : "Pending placement",
            },
            {
              label: "Product Liability",
              value:
                site.insuranceInsurer && site.insuranceProductLiability
                  ? site.insuranceProductLiability
                  : "Pending placement",
            },
            {
              label: "Certificate of Insurance",
              value: site.insuranceInsurer
                ? site.insuranceCoiOnRequest
                  ? "Available on request, addressed to your specific certificate holder"
                  : "On file"
                : "Available once policy is active",
            },
          ]}
        />

        <CredentialBlock
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Channels & References"
          rows={[
            {
              label: "Direct e-commerce",
              value: "pernikuswholesale.com",
              href: "https://pernikuswholesale.com",
              hrefLabel: "Visit",
            },
            {
              label: "Amazon storefront",
              value: site.amazonStorefrontUrl
                ? "Active U.S. marketplace storefront"
                : ON_REQUEST,
              href: site.amazonStorefrontUrl || undefined,
              hrefLabel: site.amazonStorefrontUrl ? "View on Amazon" : undefined,
            },
            {
              label: "Bank reference",
              value: site.bankReferenceOnRequest
                ? "Available on request, on bank letterhead"
                : "On file",
            },
            {
              label: "Trade references",
              value: site.tradeReferencesOnRequest
                ? "Available on request"
                : "On file",
            },
          ]}
        />

        <CredentialBlock
          icon={<FileText className="h-5 w-5" />}
          title="Compliance Contact"
          rows={[
            {
              label: "Compliance email",
              value: site.complianceEmail,
              href: `mailto:${site.complianceEmail}`,
              hrefLabel: "Email",
            },
            {
              label: "Phone",
              value: site.phoneDisplay,
              href: `tel:${site.phoneRaw}`,
              hrefLabel: "Call",
            },
            {
              label: "Response window",
              value: "One business day for documentation requests",
            },
          ]}
        />

        <p className="mt-12 max-w-3xl text-xs leading-6 text-slate-500">
          {footerDisclaimer}
        </p>
      </section>
    </>
  );
}

function CredentialBlock({
  icon,
  title,
  rows,
}: {
  icon: React.ReactNode;
  title: string;
  rows: {
    label: string;
    value: string;
    href?: string;
    hrefLabel?: string;
  }[];
}) {
  return (
    <div className="mb-10 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-navy-950">{title}</h2>
      </div>
      <dl className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-3 sm:gap-6"
          >
            <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
            <dd className="text-sm text-navy-950 sm:col-span-2">
              <span className="font-medium">{row.value}</span>
              {row.href && row.hrefLabel && (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-navy-900"
                >
                  {row.hrefLabel}
                  {row.href.startsWith("http") && (
                    <ExternalLink className="h-3 w-3" />
                  )}
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
