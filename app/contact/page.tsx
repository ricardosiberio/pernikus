import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/sanity-content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach our team for wholesale onboarding, compliance documentation, or general inquiries.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-200">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get in touch with our team.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Wholesale onboarding, compliance verification, and general inquiries. We
            respond within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-6 lg:col-span-1">
          <ContactItem
            icon={<MapPin className="h-5 w-5" />}
            label="Operations Address"
            lines={[
              site.addressLine1,
              `${site.addressCity}, ${site.addressState}`,
              site.addressCountry,
            ]}
          />
          <ContactItem
            icon={<Phone className="h-5 w-5" />}
            label="Business Phone"
            lines={[site.phoneDisplay]}
            href={`tel:${site.phoneRaw}`}
          />
          <ContactItem
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            lines={[site.salesEmail]}
            href={`mailto:${site.salesEmail}`}
          />
          <div className="rounded border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-navy-950">Verification documents</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              W-9, EIN letter, Florida resale certificate, and certificate of liability
              insurance available on request &mdash; please specify in your message.
            </p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded border border-slate-200 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  lines,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  lines: string[];
  href?: string;
}) {
  const body = (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <div className="mt-1 space-y-0.5 text-sm text-navy-950">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-navy-50 text-navy-900">
        {icon}
      </div>
      {href ? (
        <a href={href} className="hover:text-navy-700">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}
