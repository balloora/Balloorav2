import type { Metadata } from "next";
import Link from "next/link";

import { type LegalSection, LegalPage } from "@/components/legal-page";
import { CONTACT_PHONE, QUOTE_EMAIL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Balloora Events collects, uses and protects your personal information.",
};

const UPDATED = "October 8, 2026";

const sections: LegalSection[] = [
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect only what we need to run our business and serve you:</p>
        <ul>
          <li>
            <strong>Contact details</strong>: your name, email address and phone number, when you place
            an order, request a quote or contact us.
          </li>
          <li>
            <strong>Delivery details</strong>: your shipping or event address, collected at checkout.
          </li>
          <li>
            <strong>Order and event details</strong>: what you ordered, amounts paid, event date, guest
            count, venue, preferences and anything else you choose to share with us.
          </li>
          <li>
            <strong>Payment information</strong>: payments are handled by Stripe. Your card details go
            directly to Stripe; we never receive or store your full card number.
          </li>
          <li>
            <strong>Technical information</strong>: basic information your browser sends (such as IP
            address, browser type and pages visited), which our hosting and service providers may log
            for security and reliability.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use your information",
    body: (
      <>
        <p>We use your personal information to:</p>
        <ul>
          <li>process, deliver and support your orders and bookings;</li>
          <li>prepare quotes and communicate with you about your event;</li>
          <li>send receipts, confirmations and service messages;</li>
          <li>prevent fraud, secure our website and enforce our <Link href="/terms">Terms</Link>;</li>
          <li>keep business, tax and accounting records required by law; and</li>
          <li>improve our products, services and website.</li>
        </ul>
        <p>
          We will only send you marketing messages if you have agreed to receive them, and you can
          unsubscribe at any time.
        </p>
      </>
    ),
  },
  {
    id: "share",
    title: "How we share your information",
    body: (
      <>
        <p>
          <strong>We do not sell or rent your personal information.</strong> We share it only with
          trusted providers who help us operate, and only as needed for them to do so:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong>, to process payments and collect delivery details at checkout;
          </li>
          <li>
            <strong>Supabase</strong>, which hosts our database;
          </li>
          <li>our website hosting and email providers; and</li>
          <li>delivery partners, when needed to deliver your order.</li>
        </ul>
        <p>
          We may also disclose information if required by law, to protect our rights, property or safety
          or that of others, or as part of a sale or transfer of our business.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>We use only what is necessary for the website to work:</p>
        <ul>
          <li>
            <strong>Your cart</strong> is saved in your own browser (local storage) so it is still there
            when you come back. It is not sent to us until you check out.
          </li>
          <li>Stripe may set its own cookies during checkout to prevent fraud.</li>
        </ul>
        <p>
          We do not use advertising or cross-site tracking cookies. You can clear cookies and site data
          in your browser settings at any time; this will empty your cart.
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Where your information is stored",
    body: (
      <p>
        Our service providers may store and process information outside your province or country,
        including in the United States. When that happens, your information is subject to the laws of
        that country and may be accessible to its authorities. We choose providers that use recognised
        security safeguards.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep personal information only as long as needed for the purposes described above, including
        to meet legal, tax and accounting requirements (generally up to 7 years for order and payment
        records). After that, we delete or anonymise it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We use reasonable administrative, technical and physical safeguards, including encrypted
        connections (HTTPS), restricted access to our systems, and trusted providers. However, no method
        of transmission or storage is completely secure, and we cannot guarantee absolute security. You
        share information with us at your own risk.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your choices and rights",
    body: (
      <>
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>ask to access the personal information we hold about you;</li>
          <li>ask us to correct information that is inaccurate;</li>
          <li>
            withdraw your consent or ask us to delete your information, unless we must keep it for legal
            or business record purposes; and
          </li>
          <li>unsubscribe from marketing messages at any time.</li>
        </ul>
        <p>
          To make a request, contact us using the details below. We may need to verify your identity
          first, and we will respond within the time required by law. If you are not satisfied with our
          response, you may contact the Office of the Privacy Commissioner of Canada.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our website and services are intended for adults. We do not knowingly collect personal
        information from children under 16. If you believe a child has given us personal information,
        contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. The updated version will be posted on this
        page with a new &ldquo;Last updated&rdquo; date, and takes effect when posted. Continuing to use
        our website or services after a change means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        For privacy questions or requests, email <a href={`mailto:${QUOTE_EMAIL}`}>{QUOTE_EMAIL}</a> or
        call <a href={`tel:${CONTACT_PHONE.tel}`}>{CONTACT_PHONE.display}</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <p>
          Balloora Events (&ldquo;Balloora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
          privacy. This policy explains what personal information we collect through our website,
          orders and services, how we use it, and the choices you have. By using our website or services,
          you agree to this policy.
        </p>
      }
      sections={sections}
    />
  );
}
