import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileText,
  Handshake,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale & Brand Partners",
  description:
    "Pernikus LLC is a Florida-based multi-channel retailer actively seeking authorized reseller relationships with consumer brands and their primary distribution partners.",
};

export default function WholesalePage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            For Brand Partners &amp; Distributors
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A reliable U.S. retail and wholesale partner for consumer brands.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            {SITE.legalName} is a Florida-based multi-channel retailer and small-format
            wholesaler. We sell consumer packaged goods to U.S. customers through
            Amazon, our own website, and direct B2B relationships, and we are
            actively building authorized reseller and distribution accounts with
            consumer brands and their primary distribution partners.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-100"
            >
              Open an account with us
            </Link>
            <a
              href={`mailto:${SITE.email}?subject=Brand%20Partner%20Inquiry`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Email our buying team
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Who we are
        </p>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-navy-950">
          A small, professionally run retailer&mdash;not a diverter, not a marketplace
          flipper.
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-slate-700">
          <p>
            We were founded in {SITE.established} and operate from Orlando, Florida.
            Our business is intentionally focused: we move proven, brand-name CPG
            products to end consumers and small B2B accounts in the United States.
            We do not engage in unauthorized cross-border diversion, gray-market
            sourcing, or the resale of products outside their intended distribution
            channel.
          </p>
          <p>
            Today, the majority of our volume runs through our Amazon storefront,
            and we are expanding the share of inventory sourced through brand-direct
            and authorized-distributor relationships. The goal is simple: clean
            chain of custody, accurate listings, and a partner brands are comfortable
            being represented by online.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Why partner with us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
            What we bring to a brand relationship.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <ValueCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Authorized-channel discipline"
              body="We respect MAP policies, advertising guidelines, and channel restrictions. Listings are kept accurate, on-policy, and brand-safe across every storefront we operate."
            />
            <ValueCard
              icon={<Building2 className="h-6 w-6" />}
              title="U.S. registered, fully documented"
              body="Florida LLC in good standing. EIN, FL Annual Resale Certificate, W-9, and Certificate of Insurance available on request. D-U-N-S available for vendor onboarding."
            />
            <ValueCard
              icon={<Handshake className="h-6 w-6" />}
              title="Direct, responsive ownership"
              body="No layers of middlemen. Brand reps and distributor account managers reach a decision-maker on the first email. We respond within one business day."
            />
            <ValueCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Multi-channel reach"
              body="A hybrid sell-through model: an Amazon FBA storefront with sustained order velocity, our direct e-commerce site, and regional B2B accounts. We grow shelf presence for the brands we carry instead of cannibalizing their existing channels."
            />
            <ValueCard
              icon={<FileText className="h-6 w-6" />}
              title="Clean paperwork"
              body="W-9, COI, resale certificate, banking and trade references, and signed reseller agreements turned around quickly. We are easy to onboard."
            />
            <ValueCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Long-term orientation"
              body="We are building a durable retail business, not chasing one-off arbitrage. We commit to consistent reorder cadence and protect the brands we represent."
            />
            <ValueCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Brand builders, not box movers"
              body="We invest in our listings: professional product photography, optimized titles and bullet copy, A+ content where supported, and SEO-driven category placement. Our goal is for your brand to look better in our channels than in most of the unauthorized ones."
            />
            <ValueCard
              icon={<FileText className="h-6 w-6" />}
              title="Reporting on request"
              body="Sell-through summaries, sales velocity, and channel-level reporting available to brand managers and category buyers. Quarterly business reviews supported for established accounts."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Categories we focus on
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950">
          Where we&rsquo;re actively adding brand partners.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          We concentrate on consumable, replenishment-driven CPG categories with
          predictable demand and clean shelf-life profiles. If your brand operates
          in any of the following, we&rsquo;d like to talk.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Grocery & Snacks",
            "Beverages",
            "Household Essentials",
            "Health & Beauty",
            "Personal Care",
            "Baby & Kids (non-food)",
            "Pet Care",
            "Home Fragrance",
          ].map((c) => (
            <li
              key={c}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy-950"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Open an account with {SITE.legalName}.
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Brand managers, distributor account reps, and authorized-reseller program
            administrators &mdash; reach our buying team directly. We&rsquo;ll respond
            with whatever documentation your onboarding process requires.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-slate-100"
            >
              Send a message
            </Link>
            <Link
              href="/credentials"
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              View credentials &amp; compliance
            </Link>
            <a
              href={`mailto:${SITE.email}?subject=Brand%20Partner%20Inquiry`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-navy-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
