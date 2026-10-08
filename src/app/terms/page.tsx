import type { Metadata } from "next";
import Link from "next/link";

import { type LegalSection, LegalPage } from "@/components/legal-page";
import { CONTACT_PHONE, QUOTE_EMAIL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to orders, services and use of the Balloora Events website.",
};

const UPDATED = "October 8, 2026";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: (
      <>
        <p>
          These Terms &amp; Conditions (the &ldquo;Terms&rdquo;) are a binding agreement between you and
          Balloora Events (&ldquo;Balloora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;).
          They apply to your use of this website and to every product order, service booking, quote and
          event we provide.
        </p>
        <p>
          By using the website, placing an order, paying a deposit or accepting a quote, you confirm
          that you have read, understood and agree to these Terms and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the website or
          our services.
        </p>
        <p>
          You must be at least 18 years old, or the age of majority where you live, to place an order
          or book a service.
        </p>
      </>
    ),
  },
  {
    id: "products-services",
    title: "Products, services and quotes",
    body: (
      <>
        <p>
          We sell ready-to-order products through the website (&ldquo;Products&rdquo;) and provide
          custom balloon installations, floral styling, event decor, packages and related services
          (&ldquo;Services&rdquo;).
        </p>
        <ul>
          <li>
            <strong>Images are for illustration.</strong> Photos show examples of past or sample work.
            Balloons, flowers and materials are handmade or natural, so colour, size, shape, finish and
            arrangement will vary and may not exactly match any image, screen or sample.
          </li>
          <li>
            <strong>Substitutions.</strong> If a colour, flower, material or item is unavailable, we may
            substitute something of similar style and equal or greater value without notice.
          </li>
          <li>
            <strong>&ldquo;Starting at&rdquo; prices</strong> are a guide only. Final pricing for Services
            depends on design, size, materials, location, timing, access and labour, and is confirmed
            only in a written quote.
          </li>
          <li>
            <strong>Quotes</strong> are valid for 7 days unless stated otherwise and are based on the
            information you give us. If event details change, we may revise the quote.
          </li>
          <li>
            <strong>A booking is confirmed only</strong> when we have received your payment or deposit
            and confirmed the booking in writing. Until then, dates are not held.
          </li>
          <li>
            We may decline any order or booking, at our sole discretion, for any lawful reason.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "pricing-payment",
    title: "Pricing and payment",
    body: (
      <>
        <ul>
          <li>
            Prices are shown in the currency displayed at checkout and exclude applicable taxes,
            delivery, setup, rush and after-hours fees unless stated otherwise.
          </li>
          <li>
            Online payments are processed securely by Stripe. We never see or store your full card
            details.
          </li>
          <li>
            <strong>Pricing errors.</strong> If a product or service is listed at an incorrect price
            because of a typographical or system error, we may cancel the order and refund any amount
            paid, even after it has been confirmed.
          </li>
          <li>
            <strong>Deposits.</strong> Services may require a deposit to reserve your date. Deposits
            are <strong>non-refundable</strong>, because we turn away other bookings, purchase
            materials and begin design work once your date is reserved.
          </li>
          <li>
            Any remaining balance for Services is due by the date stated on your quote or invoice, and
            no later than 7 days before the event. If it is not paid on time, we may cancel the booking
            and keep the deposit.
          </li>
          <li>
            You agree not to dispute or charge back a payment that is valid under these Terms. If you
            do, you are responsible for any fees and costs we incur in responding to it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery, pickup and setup",
    body: (
      <>
        <ul>
          <li>
            Delivery and setup times are estimates. We will make reasonable efforts to meet them but
            are not responsible for delays caused by traffic, weather, venue access, third parties or
            other circumstances outside our control.
          </li>
          <li>
            You must give us a complete and accurate address, contact name and phone number. Risk of
            loss and damage passes to you when an order is delivered, picked up or handed to a carrier.
          </li>
          <li>
            You are responsible for ensuring the venue is accessible at the agreed time, that we are
            permitted to install decor there, and for obtaining any venue approval or permit required.
          </li>
          <li>
            If we cannot deliver or install because the address is wrong, nobody is available, or we
            are refused access, the order is considered fulfilled. Any return trip or waiting time may
            be charged.
          </li>
          <li>
            Installation must be on a safe, suitable surface. We may refuse or modify an installation
            we consider unsafe, without refund.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cancellations-refunds",
    title: "Cancellations, changes and refunds",
    body: (
      <>
        <p>
          Our products and services are made to order for a specific date, so the following applies:
        </p>
        <ul>
          <li>
            <strong>Custom and personalised items</strong> (including engraved, printed, customised or
            made-to-order products) are <strong>final sale</strong> and cannot be cancelled, returned
            or refunded once production has started.
          </li>
          <li>
            <strong>Balloons and fresh flowers are perishable</strong> and cannot be returned.
          </li>
          <li>
            <strong>Service cancellations by you:</strong> deposits are non-refundable. If you cancel
            within 14 days of the event, 100% of the booking total is payable, as materials will have
            been purchased and your date reserved.
          </li>
          <li>
            <strong>Date changes</strong> are subject to availability and may incur a fee. A
            rescheduled booking may be moved only once, and any price difference applies.
          </li>
          <li>
            <strong>Damaged or incorrect orders</strong> must be reported to us with photos within 24
            hours of delivery or pickup. If we confirm the problem was caused by us, we will, at our
            option, repair, replace or provide a credit or partial refund. This is your sole remedy.
          </li>
          <li>
            <strong>If we must cancel</strong> for reasons within our control, we will refund the
            amounts you paid for the cancelled order or booking, which is our only liability.
          </li>
        </ul>
        <p>
          Nothing in this section limits any refund right you have that cannot be excluded under
          applicable consumer protection law.
        </p>
      </>
    ),
  },
  {
    id: "safety",
    title: "Balloon safety and your responsibilities",
    body: (
      <>
        <p>By ordering, you acknowledge and accept the following, and agree to inform your guests:</p>
        <ul>
          <li>
            <strong>Choking hazard.</strong> Uninflated or broken balloons can cause suffocation.
            Children under 8 must be supervised at all times around balloons, and broken pieces must be
            discarded immediately.
          </li>
          <li>
            <strong>Latex allergies.</strong> Our balloons may contain latex. It is your responsibility
            to tell us about any allergy before ordering and to inform guests.
          </li>
          <li>
            <strong>Natural wear.</strong> Balloons naturally deflate, oxidise, pop or change shape,
            especially in heat, sun, cold, wind, rain or air conditioning. Float time and lifespan are
            not guaranteed, and outdoor installations are entirely at your own risk.
          </li>
          <li>
            Keep balloons away from heat sources, sharp objects, open flames and power lines. Never
            inhale helium. Do not release balloons outdoors.
          </li>
          <li>
            You are responsible for supervising your guests, children and pets around any installation,
            and for any damage they cause.
          </li>
          <li>
            Flowers and plants may cause allergic reactions and some may be toxic if eaten by people or
            pets.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "equipment",
    title: "Rental equipment and venue",
    body: (
      <ul>
        <li>
          Stands, frames, backdrops, props, signage and other equipment we supply remain our property
          unless clearly sold to you. You must not move, alter or remove them.
        </li>
        <li>
          You are responsible for any loss of or damage to our equipment from the time it is installed
          until it is collected, and you agree to pay the cost of repair or replacement.
        </li>
        <li>
          You must allow us access to collect equipment at the agreed time. Delays may result in extra
          charges.
        </li>
        <li>
          We take reasonable care when installing, but we are not responsible for marks, residue or
          damage to walls, floors, ceilings or furnishings that result from normal installation, from
          venue conditions, or from instructions given by you or the venue.
        </li>
      </ul>
    ),
  },
  {
    id: "photos",
    title: "Photos and creative work",
    body: (
      <>
        <p>
          All designs, concepts, mock-ups, quotes and creative work we prepare remain our intellectual
          property. You may not share them with another vendor or reproduce them without our written
          permission.
        </p>
        <p>
          We may photograph or record our installations and use those images in our portfolio, website
          and social media. We will avoid featuring identifiable guests without consent. If you do not
          want your event photographed, tell us in writing before the event.
        </p>
        <p>
          If you send us photos, logos or other material, you confirm you have the right to use them
          and give us permission to use them to fulfil your order.
        </p>
      </>
    ),
  },
  {
    id: "website",
    title: "Use of the website",
    body: (
      <ul>
        <li>
          All website content, including text, images, logos and design, belongs to Balloora or its
          licensors and may not be copied or used without permission.
        </li>
        <li>
          You must not misuse the website, including attempting to gain unauthorised access, interfering
          with its operation, scraping it, or using it for any unlawful purpose.
        </li>
        <li>
          The website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not
          guarantee it will be uninterrupted, error-free or free of harmful components, and we may change
          or withdraw any part of it at any time.
        </li>
        <li>Links to third-party websites are provided for convenience; we are not responsible for them.</li>
      </ul>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>To the maximum extent permitted by law:</p>
        <ul>
          <li>
            Our products and services are provided without any warranty or condition, express or
            implied, including fitness for a particular purpose, except as expressly stated in these
            Terms.
          </li>
          <li>
            We are not liable for any indirect, incidental, special, consequential or punitive loss or
            damages, including loss of enjoyment, emotional distress, lost profits, or costs of other
            vendors, even if we were told they were possible.
          </li>
          <li>
            We are not liable for injury, illness, allergic reaction, loss or damage arising from the
            use, handling or misuse of balloons, flowers, decor or equipment, or from a failure to follow
            the safety guidance above, except where caused by our gross negligence or wilful misconduct.
          </li>
          <li>
            <strong>
              Our total liability for any claim relating to an order, booking or the website is limited
              to the amount you paid us for that specific order or booking.
            </strong>
          </li>
        </ul>
        <p>
          Some laws do not allow certain exclusions or limits, so some of the above may not apply to
          you. In that case our liability is limited to the smallest amount permitted.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <p>
        You agree to indemnify and hold harmless Balloora, its owners, staff and contractors from any
        claims, losses, damages, liabilities, costs and expenses (including reasonable legal fees)
        arising from your breach of these Terms, your event or venue, the acts or omissions of you or
        your guests, or information or materials you provided to us.
      </p>
    ),
  },
  {
    id: "force-majeure",
    title: "Events beyond our control",
    body: (
      <p>
        We are not responsible for any delay or failure to perform caused by circumstances beyond our
        reasonable control, including severe weather, natural disasters, illness, public health orders,
        supplier shortages, transportation problems, power outages, venue closures or government action.
        In that case we will work with you to reschedule or provide a credit for amounts paid, less
        costs already incurred.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada
          that apply there. You agree to the exclusive jurisdiction of the courts of Ontario.
        </p>
        <p>
          Before starting any claim, you agree to contact us first and give us 30 days to try to resolve
          the matter informally. Any claim must be brought individually, not as part of a class action,
          to the extent permitted by law.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <ul>
        <li>
          We may update these Terms at any time by posting a new version on this page. The version in
          effect when you place an order or accept a quote applies to that order or booking.
        </li>
        <li>
          If any part of these Terms is found unenforceable, it will be enforced to the maximum extent
          permitted and the rest will remain in full effect.
        </li>
        <li>
          Our failure to enforce any part of these Terms is not a waiver of our right to do so later.
        </li>
        <li>
          These Terms, together with any written quote or invoice we give you, are the entire agreement
          between us. If they conflict, the written quote or invoice applies.
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about these Terms? Email <a href={`mailto:${QUOTE_EMAIL}`}>{QUOTE_EMAIL}</a> or call{" "}
        <a href={`tel:${CONTACT_PHONE.tel}`}>{CONTACT_PHONE.display}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated={UPDATED}
      intro={
        <p>
          Please read these Terms carefully. They explain how orders, bookings, payments, cancellations
          and refunds work, and they limit our liability.
        </p>
      }
      sections={sections}
    />
  );
}
