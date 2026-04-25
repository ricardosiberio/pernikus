import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Pernikus LLC",
  description:
    "Pernikus LLC is a Florida-based wholesale distributor and multi-channel retailer of consumer packaged goods, headquartered in Lake County.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            About {SITE.legalName}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A Florida operator built for the demands of national retail.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Our company
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            Distribution that moves at retail&rsquo;s pace.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
            <p>
              Pernikus LLC is a privately held wholesale distributor and multi-channel
              retailer based in Lake County, Florida. We specialize in consumer packaged
              goods (CPG) across grocery, beverages, household essentials, and health
              &amp; beauty &mdash; the consumable categories that move predictable volume
              for both regional retailers and national online channels.
            </p>
            <p>
              Our model pairs disciplined inventory management with vetted 3PL warehouse
              and pallet operations, allowing us to take in truckload-sized inbound
              shipments and break them down into the case quantities, mixed pallets, and
              parcel orders that today&rsquo;s buyers expect. The result is a supply
              chain that scales without sacrificing the documentation, turnaround, and
              traceability our trade partners rely on.
            </p>
            <p>
              We are an Employer Identification Number (EIN) verified U.S. business with
              an active Florida Annual Resale Certificate for Sales Tax. W-9s, resale
              certificates, certificates of liability insurance, and bank references are
              available on request through our wholesale onboarding workflow.
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
            alt="Warehouse pallet operations"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            How we operate
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            What our trade partners can expect
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Verified business standing",
                body: "U.S. registered LLC in good standing, EIN on file, and an active Florida resale certificate. Documentation packages are sent same-business-day on request.",
              },
              {
                title: "Multi-channel sell-through",
                body: "Active retail accounts across major online marketplaces, with category-managed catalogs, MAP-compliant pricing, and brand-approved listings where required.",
              },
              {
                title: "Predictable fulfillment",
                body: "3PL pallet warehousing with documented receiving SOPs, scheduled outbound LTL, and parcel-level tracking for every shipment we route.",
              },
              {
                title: "Honest documentation",
                body: "Clean PO and invoice data, GTIN-mapped catalogs, and proactive ASN notifications. We won't ship what we can't document.",
              },
              {
                title: "Tier-1 distributor ready",
                body: "Onboarding paperwork formatted to the standards of national distributors, including W-9, COI, and references on request.",
              },
              {
                title: "Long-term partnerships",
                body: "We build with the same accounts year over year. Reliability over volume spikes, every time.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded border border-slate-200 bg-white p-6"
              >
                <CheckCircle2 className="h-6 w-6 text-navy-900" />
                <h3 className="mt-3 text-base font-semibold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded border border-slate-200 bg-white p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">
              Need verification documents for an onboarding application?
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Our compliance team responds to wholesale verification requests within one
              business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Contact Compliance
          </Link>
        </div>
      </section>
    </>
  );
}
