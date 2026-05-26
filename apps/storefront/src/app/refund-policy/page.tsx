import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  "Refund & Returns Policy | AKAAR 3D",
  "AKAAR 3D's refund, replacement, and cancellation policy — what's eligible, what's not, the 7-day window for catalog items, and how to start a return.",
  "/refund-policy"
);

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen animate-fade-in pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Refund &amp; Returns Policy
          </h1>
          <p className="text-[var(--text-muted)] mb-12">Last updated: May 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <Section title="1. Summary">
              <p>
                AKAAR 3D handcrafts every order in our Jaipur studio. Because most
                items are made to order, we follow a clearly scoped return policy:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Catalog items damaged in transit are replaced free of charge.</li>
                <li>Catalog items received in unused condition can be returned within 7 days.</li>
                <li>Custom and quote-based builds are non-returnable once production has started.</li>
                <li>Order cancellations are accepted up to the point of dispatch.</li>
              </ul>
              <p>The detailed terms below govern each case.</p>
            </Section>

            <Section title="2. Damaged or Defective on Arrival">
              <p>
                If your item arrives damaged, broken, or with a manufacturing
                defect, email{" "}
                <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                  hello@akaar3d.in
                </a>{" "}
                within <strong>48 hours of delivery</strong> with:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Your order number</li>
                <li>Photographs of the outer packaging</li>
                <li>Photographs of the damaged item from at least three angles</li>
                <li>A photo of the courier AWB / shipping label</li>
              </ul>
              <p>
                We will reprint and reship the item at no cost, or offer a full
                refund, at your option. You do not need to ship the damaged item
                back unless we explicitly request it.
              </p>
            </Section>

            <Section title="3. Returns for Unused Catalog Items">
              <p>
                For items purchased from the public catalog (not custom builds),
                you may request a return within <strong>7 days of delivery</strong>{" "}
                if the item is unused, in original condition, and in the original
                packaging.
              </p>
              <p>To start a return:</p>
              <ol className="list-decimal list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>
                  Email{" "}
                  <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                    hello@akaar3d.in
                  </a>{" "}
                  within the 7-day window with your order number and reason for
                  return.
                </li>
                <li>We will share the return shipping address and a return reference.</li>
                <li>Ship the item back using a courier of your choice — return shipping costs are borne by the customer for non-defective returns.</li>
                <li>Once we receive and inspect the item, we will refund the item value (excluding original and return shipping) within 7 working days.</li>
              </ol>
            </Section>

            <Section title="4. Items Not Eligible for Return">
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Custom or quote-based builds once production has started</li>
                <li>Personalised items (e.g. engraved or color-matched on request)</li>
                <li>Items returned without prior return reference</li>
                <li>Items returned after the 7-day window</li>
                <li>Items showing signs of use, assembly, painting, or modification</li>
              </ul>
            </Section>

            <Section title="5. Order Cancellation">
              <p>
                You may cancel an order any time before it is{" "}
                <strong>marked as Shipped</strong> in your account. To cancel,
                visit{" "}
                <Link href="/account/orders" className="text-[var(--accent)] hover:underline">
                  My Account → Orders
                </Link>{" "}
                or email{" "}
                <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                  hello@akaar3d.in
                </a>
                . A full refund will be initiated to the original payment method
                within 5–7 working days.
              </p>
              <p>
                Once an order is dispatched, the cancellation window closes and
                the returns process above applies.
              </p>
            </Section>

            <Section title="6. Refund Method and Timeline">
              <p>
                Refunds are processed to the original payment method used at
                checkout via Razorpay. Once initiated, refunds typically reflect
                in your account within:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>UPI: 1–3 working days</li>
                <li>Net Banking, Debit Card: 3–5 working days</li>
                <li>Credit Card: 5–7 working days</li>
                <li>Wallets: 1–3 working days</li>
              </ul>
              <p>
                If a refund is delayed beyond these windows, contact us with your
                refund reference ID.
              </p>
            </Section>

            <Section title="7. Quote-Based and Custom Builds">
              <p>
                Quote-based orders (where pricing was confirmed via the{" "}
                <Link href="/quote" className="text-[var(--accent)] hover:underline">
                  custom build request
                </Link>{" "}
                flow) are{" "}
                <strong>non-cancellable and non-returnable</strong> once
                production has started. We will confirm a production start date
                with you in writing; cancellation requests received before that
                date are honored with a full refund.
              </p>
            </Section>

            <Section title="8. Replacement vs Refund">
              <p>
                Wherever a damaged or defective item qualifies, we will offer
                both options:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li><strong>Replacement</strong> — reprinted and reshipped at our cost</li>
                <li><strong>Refund</strong> — full item value refunded to the original payment method</li>
              </ul>
              <p>You may choose either.</p>
            </Section>

            <Section title="9. Contact">
              <p>
                All return, refund, and cancellation requests:
              </p>
              <p>
                Email:{" "}
                <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                  hello@akaar3d.in
                </a>
                <br />
                Hours: Mon–Sat · 10:00 to 19:00 IST
                <br />
                We respond within one working day.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">{title}</h2>
      <div className="text-[var(--text-secondary)] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
