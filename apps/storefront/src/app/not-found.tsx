import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: "404 — Page Not Found | AKAAR 3D",
  robots: { index: false, follow: false },
};

export default NotFoundClient;
