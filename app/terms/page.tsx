import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSiteSettings } from "@/lib/sanity-content";

export const revalidate = 10;
export const metadata: Metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const site = await getSiteSettings();
  return (
    <LegalPage title="Terms of Service" effectiveDate="January 1, 2026">
      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to and use
        of the {site.legalName} website and the products and services offered
        through it. By using the website or placing an order, you agree to these
        Terms.
      </p>

      <h2>Eligibility &amp; Accounts</h2>
      <p>
        Use of the website is intended for users at least 18 years of age, or the age
        of majority in their jurisdiction. Wholesale and reseller accounts require
        completion of our onboarding process and verification of business
        documentation, including a valid Employer Identification Number (EIN) and, for
        applicable jurisdictions, a state resale or sales tax certificate.
      </p>

      <h2>Orders &amp; Pricing</h2>
      <p>
        All orders are subject to acceptance by {site.legalName}. We reserve the right
        to limit, refuse, or cancel any order, including orders that we suspect to be
        fraudulent or in violation of these Terms. Prices and product availability are
        subject to change without notice. Errors in pricing or product information may
        be corrected at any time, including after an order has been placed.
      </p>

      <h2>Payment</h2>
      <p>
        Payment is processed through Stripe. You represent that you are authorized to
        use the payment method submitted and authorize {site.legalName} (and its
        payment processor) to charge the full order amount, including applicable taxes
        and shipping fees.
      </p>

      <h2>Shipping, Title &amp; Risk of Loss</h2>
      <p>
        Title to products and risk of loss pass to the buyer upon delivery to the
        common carrier at our facility (FOB Origin), unless otherwise agreed in
        writing. Estimated delivery dates are estimates only and not guaranteed.
      </p>

      <h2>Returns</h2>
      <p>
        Returns are governed by our{" "}
        <a href="/shipping-returns">Shipping &amp; Returns Policy</a>, which is
        incorporated into these Terms by reference.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on the website &mdash; including text, graphics, logos, images,
        and software &mdash; is the property of {site.legalName} or its licensors and
        is protected by U.S. and international intellectual property laws. You may not
        reproduce, distribute, or create derivative works from any content without our
        prior written consent.
      </p>

      <h2>Acceptable Use</h2>
      <ul>
        <li>Do not use the website in any way that violates applicable law.</li>
        <li>Do not attempt to gain unauthorized access to the website or its systems.</li>
        <li>Do not interfere with or disrupt the integrity or performance of the website.</li>
        <li>Do not scrape, harvest, or collect information about other users.</li>
      </ul>

      <h2>Disclaimer of Warranties</h2>
      <p>
        The website and all products are provided on an &ldquo;as is&rdquo; and
        &ldquo;as available&rdquo; basis. To the fullest extent permitted by law,
        {" "}{site.legalName} disclaims all warranties, express or implied, including
        any implied warranties of merchantability, fitness for a particular purpose,
        and non-infringement.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, {site.legalName} and its officers,
        employees, and agents will not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of or related to your
        use of the website or any products purchased. Our aggregate liability for any
        claim arising under these Terms will not exceed the amount paid by you for
        the order giving rise to the claim.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Florida, without regard
        to its conflict of laws principles. Any dispute arising under these Terms will
        be brought exclusively in the state or federal courts located in Orlando,
        Florida, and the parties consent to the personal jurisdiction of those
        courts.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may modify these Terms from time to time. The &ldquo;Effective&rdquo; date
        at the top indicates the most recent revision. Continued use of the website
        constitutes acceptance of any modified Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${site.salesEmail}`}>{site.salesEmail}</a>.
      </p>
    </LegalPage>
  );
}
