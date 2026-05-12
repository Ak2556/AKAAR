import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const metadata: Metadata = buildMetadata(
  "Contact AKAAR 3D | Jaipur Studio",
  "Get in touch with the AKAAR team for quotes, order questions, or technical support. We reply within one business day from our studio in Jaipur.",
  "/contact"
);

export default function ContactPage() {
  return <ContactClient />;
}
