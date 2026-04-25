import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & Returns Policy" effectiveDate="January 1, 2026">
      <p>
        This Shipping &amp; Returns Policy applies to all orders placed with{" "}
        {SITE.legalName} through this website. Wholesale orders placed under separate
        purchase orders or trade contracts are governed by those agreements.
      </p>

      <h2>Order Processing</h2>
      <p>
        Orders are typically processed within one to two business days of payment
        confirmation. Orders placed on weekends or U.S. federal holidays are processed
        on the next business day. We will email a confirmation when your order ships.
      </p>

      <h2>Shipping Methods &amp; Carriers</h2>
      <p>
        Domestic parcel orders are shipped via UPS, FedEx, or USPS, depending on
        weight, dimensions, and destination. Pallet and LTL freight orders ship via
        contracted regional and national carriers. Carrier selection is at our
        discretion unless otherwise agreed.
      </p>

      <h2>Estimated Transit Times</h2>
      <ul>
        <li>Standard parcel: 3 &ndash; 7 business days within the contiguous United States.</li>
        <li>LTL freight: 5 &ndash; 10 business days, subject to dock availability.</li>
        <li>Alaska, Hawaii, and U.S. territories: additional transit time may apply.</li>
      </ul>
      <p>
        Estimates begin when the carrier picks up the shipment, not when the order is
        placed. Transit times are estimates and are not guaranteed.
      </p>

      <h2>Shipping Costs</h2>
      <p>
        Shipping costs are calculated at checkout based on the destination, package
        weight and dimensions, and selected service level. Wholesale freight terms
        (FOB Origin, prepaid-and-add, collect, etc.) may be agreed in writing for
        contracted accounts.
      </p>

      <h2>Damaged or Lost Shipments</h2>
      <p>
        Inspect all shipments upon receipt. Note any visible damage on the carrier
        proof of delivery and contact us within 48 hours of delivery at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. For lost shipments, please
        notify us within 14 days of the carrier&rsquo;s last tracking update so we can
        open a claim.
      </p>

      <h2>Returns</h2>
      <p>
        Eligible products may be returned within 30 days of delivery, in original
        unopened packaging, for a refund of the product price. Return shipping is the
        responsibility of the buyer unless the return is due to our error or a
        verified product defect. The following items are not eligible for return:
      </p>
      <ul>
        <li>Opened consumable products (food, beverages, personal care).</li>
        <li>Items marked &ldquo;final sale&rdquo; or &ldquo;non-returnable.&rdquo;</li>
        <li>Custom or special-order items.</li>
        <li>Wholesale and bulk orders, unless otherwise agreed in writing.</li>
      </ul>

      <h2>How to Initiate a Return</h2>
      <p>
        Contact <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your order
        number, the item(s) you wish to return, and the reason for return. We will
        respond with a return authorization (RA) number and instructions. Returns
        without an RA may be refused or delayed.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds are issued to the original payment method within 5 &ndash; 10 business
        days of our receipt and inspection of the returned items. Original shipping
        charges are non-refundable except where the return is due to our error.
      </p>

      <h2>International Shipping</h2>
      <p>
        We currently ship to addresses within the United States. International orders
        may be available by quote on a case-by-case basis &mdash; please contact us
        for details.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about shipping or returns can be sent to{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or by phone at {SITE.phone}.
      </p>
    </LegalPage>
  );
}
