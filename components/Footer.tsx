import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getAllCategories } from "@/lib/sanity-content";

export async function Footer() {
  const [site, categories] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
  ]);
  const year = new Date().getFullYear();
  const displayName = site.displayName || site.legalName;

  return (
    <footer className="mt-16 border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="inline-block rounded-lg bg-white p-3">
            <Image
              src="/logo.png"
              alt={site.legalName}
              width={560}
              height={420}
              className="h-16 w-auto"
            />
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Florida-based wholesale distributor and multi-channel retailer of consumer
            packaged goods. Reliable supply chain, transparent operations, professional
            partnerships.
          </p>
          <p className="mt-6 text-sm font-medium text-white">
            {site.phoneDisplay}
            <span className="mx-2 text-slate-600">•</span>
            <a href={`mailto:${site.salesEmail}`} className="hover:text-white">
              {site.salesEmail}
            </a>
          </p>
          <p className="mt-4 text-sm text-slate-400">
            {site.addressLine1}
            {site.addressLine2 ? (
              <>
                <br />
                {site.addressLine2}
              </>
            ) : null}
            <br />
            {site.addressCity}, {site.addressState} {site.addressZip}
            <br />
            {site.addressCountry}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className="text-slate-400 hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="text-slate-400 hover:text-white">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-slate-400 hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/wholesale" className="text-slate-400 hover:text-white">
                Wholesale &amp; Brand Partners
              </Link>
            </li>
            <li>
              <Link href="/credentials" className="text-slate-400 hover:text-white">
                Credentials &amp; Compliance
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-400 hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-slate-400 hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-400 hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="text-slate-400 hover:text-white">
                Shipping &amp; Returns
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            &copy; {year} {displayName} &middot; Florida Registered &middot; EIN on File
          </p>
          <p>
            Established {site.establishedYear} &middot; {site.addressCity}, {site.addressState}, {site.addressCountry}
          </p>
        </div>
      </div>
    </footer>
  );
}
