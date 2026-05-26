import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  "Shipping Policy | AKAAR 3D",
  "How AKAAR 3D ships orders across India — dispatch windows, courier partners, delivery times, and what happens if your package is delayed or damaged.",
  "/shipping-policy"
);

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen animate-fade-in pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Shipping Policy</h1>
          <p className="text-[var(--text-muted)] mb-12">Last updated: May 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <Section title="1. Dispatch Window">
              <p>
                Orders for in-stock catalog items are dispatched within{" "}
                <strong>48 hours of payment confirmation</strong> from our studio in
                Jaipur, Rajasthan. Quote-based and custom orders ship within the
                window quoted at approval — typically 5–10 working days from print
                start. Working days exclude Sundays and Indian public holidays.
              </p>
              <p>
                If a dispatch will be delayed by more than 24 hours beyond the
                quoted window, we will email you with the revised estimate.
              </p>
            </Section>

            <Section title="2. Delivery Areas">
              <p>
                AKAAR 3D ships to all serviceable PIN codes within India. Standard
                delivery typically reaches:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad): 3–5 working days</li>
                <li>Other Tier-1 and Tier-2 cities: 4–6 working days</li>
                <li>Tier-3 cities and rural PIN codes: 5–8 working days</li>
                <li>North-East states, Jammu &amp; Kashmir, Ladakh, Andaman &amp; Nicobar: 7–10 working days</li>
              </ul>
              <p>
                International shipping is currently <strong>not available</strong>{" "}
                through the storefront. For export enquiries please contact us via
                the{" "}
                <Link href="/quote" className="text-[var(--accent)] hover:underline">
                  custom build request
                </Link>{" "}
                form.
              </p>
            </Section>

            <Section title="3. Shipping Charges">
              <p>
                Shipping prices shown at checkout already include applicable taxes
                (GST). The three speeds available are:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li><strong>Standard Shipping</strong> — Free of charge · 5–7 working days</li>
                <li><strong>Express Shipping</strong> — ₹149 · 2–3 working days</li>
                <li><strong>Priority Shipping</strong> — ₹299 · 1–2 working days (metros only)</li>
              </ul>
              <p>
                For oversized or fragile builds we may contact you to upgrade to
                a courier-of-choice service at additional cost — never without
                your written consent.
              </p>
            </Section>

            <Section title="4. Courier Partners">
              <p>
                We use a rotating set of trusted Indian courier partners
                including Delhivery, Shiprocket, Bluedart, DTDC and India Post,
                routed by destination PIN code and parcel weight.
              </p>
            </Section>

            <Section title="5. Tracking">
              <p>
                Once dispatched, you will receive an email with the AWB / tracking
                number and a courier-specific tracking link. The same details are
                always available in{" "}
                <Link href="/account/orders" className="text-[var(--accent)] hover:underline">
                  My Account → Orders
                </Link>
                .
              </p>
            </Section>

            <Section title="6. Packaging">
              <p>
                Every figurine ships in protective foam inside a corrugated outer
                carton. Multi-piece items (like the Ganesha Temple Mandap) are
                bagged separately so they arrive in assembly order.
              </p>
            </Section>

            <Section title="7. Failed Delivery, RTO, and Lost Parcels">
              <p>
                If our courier partner is unable to deliver after three attempts
                or due to an incorrect address, the parcel will be{" "}
                <strong>returned to origin (RTO)</strong>. We will contact you to
                arrange a re-ship — re-shipping charges apply.
              </p>
              <p>
                If your parcel is declared lost by the courier (typically after 21
                days from dispatch with no scans), we will reprint and reship at
                no additional cost.
              </p>
            </Section>

            <Section title="8. Damaged on Arrival">
              <p>
                Open and inspect your parcel within 48 hours of delivery. If any
                item arrives damaged, email{" "}
                <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                  hello@akaar3d.in
                </a>{" "}
                with photos of the package, the damaged item, and the AWB sticker
                within those 48 hours. We will arrange a replacement at our cost
                — see our{" "}
                <Link href="/refund-policy" className="text-[var(--accent)] hover:underline">
                  Refund &amp; Returns Policy
                </Link>{" "}
                for the full process.
              </p>
            </Section>

            <Section title="9. Contact">
              <p>
                Questions about shipping? Reach us at{" "}
                <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                  hello@akaar3d.in
                </a>{" "}
                or via{" "}
                <Link href="/contact" className="text-[var(--accent)] hover:underline">
                  the contact form
                </Link>
                . We respond within one working day.
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
