import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { SettingsProvider } from "@/context/SettingsContext";
import { SettingsInitializer } from "@/components/SettingsInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akaar.in"),
  title: "Akaar | We Give AKAAR to Ideas",
  description: "We give AKAAR to ideas. From CAD to physical part in days. Automated algorithmic quoting, instant pricing, and production-ready 3D printing for engineers and hardware startups.",
  keywords: ["3D printing", "rapid prototyping", "FDM", "SLA", "manufacturing", "CAD to part", "instant quote", "hardware startups", "Akaar"],
  openGraph: {
    title: "Akaar | We Give AKAAR to Ideas",
    description: "From CAD to physical part in days. Automated quoting, instant pricing, and production-ready 3D printing.",
    url: "https://akaar.in",
    siteName: "Akaar",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akaar — 3D Printing & Manufacturing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akaar | We Give AKAAR to Ideas",
    description: "From CAD to physical part in days. Automated quoting and production-ready 3D printing.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
        <SettingsInitializer />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200`}
      >
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <ToastProvider>
                <WishlistProvider>
                  <CartProvider>
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                    <CartDrawer />
                  </CartProvider>
                </WishlistProvider>
              </ToastProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
