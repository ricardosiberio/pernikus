import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="January 1, 2026">
      <p>
        This Privacy Policy describes how {SITE.legalName} (&ldquo;Pernikus,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and
        shares information about you when you visit our website, communicate with us,
        or transact with us. By using our website, you agree to the practices described
        below.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly to us &mdash; for example, when you
        complete our contact form, request wholesale documentation, or place an order.
        This may include your name, business name, email address, phone number,
        shipping address, billing address, and any other information you choose to
        provide.
      </p>
      <p>
        We also collect limited information automatically when you visit the site,
        including IP address, browser type, device identifiers, referring URLs, and
        pages viewed. We use cookies and similar technologies to operate the site,
        remember your preferences, and analyze traffic.
      </p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To respond to inquiries and provide the products or services you request.</li>
        <li>To process and fulfill orders, including shipping, billing, and customer service.</li>
        <li>To verify business eligibility and complete wholesale onboarding.</li>
        <li>To maintain the security and integrity of our website and operations.</li>
        <li>To comply with legal, tax, and regulatory obligations.</li>
        <li>To improve our website, products, and customer experience.</li>
      </ul>

      <h2>Payment Processing</h2>
      <p>
        Online payments are processed by Stripe, Inc. We do not collect or store full
        payment card numbers on our servers. Stripe&rsquo;s privacy practices are
        governed by Stripe&rsquo;s own privacy policy, available at stripe.com/privacy.
      </p>

      <h2>How We Share Information</h2>
      <p>
        We share information with service providers that help us operate our business
        &mdash; including payment processors, third-party logistics (3PL) and
        warehousing partners, shipping carriers, and email and analytics providers
        &mdash; under contractual confidentiality obligations. We may also disclose
        information when required by law, in response to a lawful request, or to
        protect the rights, property, or safety of {SITE.legalName} or others.
      </p>
      <p>We do not sell personal information.</p>

      <h2>Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide our services,
        comply with legal obligations (including tax recordkeeping), resolve disputes,
        and enforce our agreements.
      </p>

      <h2>Your Choices</h2>
      <p>
        You may unsubscribe from marketing emails at any time by following the
        unsubscribe link in any such email. You may request access, correction, or
        deletion of personal information we hold about you by emailing{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will respond consistent
        with applicable law.
      </p>

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        Our website is intended for business and adult consumer use and is not
        directed to children under 13. We do not knowingly collect personal
        information from children under 13.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Effective&rdquo;
        date at the top of this page indicates when the policy was last revised.
        Continued use of the website after a change constitutes acceptance of the
        revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this Privacy Policy can be sent to{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or by mail to{" "}
        {SITE.legalName}, {SITE.address.city}, {SITE.address.state}, {SITE.address.country}.
      </p>
    </LegalPage>
  );
}
