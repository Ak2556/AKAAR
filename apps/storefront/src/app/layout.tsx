import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Syne } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { LazyCartDrawer } from "@/components/cart/LazyCartDrawer";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { SettingsProvider } from "@/context/SettingsContext";
import { SettingsInitializer } from "@/components/SettingsInitializer";
import { RuntimeCapabilitiesProvider } from "@/context/RuntimeCapabilitiesContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BottomNav } from "@/components/layout/BottomNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LazyAIChatWidget } from "@/components/layout/LazyAIChatWidget";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { DevelopmentSetupBanner } from "@/components/layout/DevelopmentSetupBanner";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";
const defaultOgImage = `${siteUrl}/og`;

export const metadata: Metadata = {
  title: "AKAAR 3D | Giving AKAAR to Ideas | 3D Printing Services in Jaipur",
  description: "AKAAR 3D gives shape to your ideas. From CAD to physical part in days. Professional 3D printing services in Jaipur, Rajasthan. PLA, PETG, ABS materials. Reviewed quote requests for engineers and hardware startups.",
  keywords: ["3D printing", "3D printing Jaipur", "rapid prototyping", "FDM printing", "PLA printing", "PETG printing", "ABS printing", "CAD to part", "quote request", "hardware startups", "AKAAR 3D", "3D printing India", "custom 3D prints"],
  openGraph: {
    type: "website",
    siteName: "AKAAR 3D",
    title: "AKAAR 3D | Giving AKAAR to Ideas",
    description: "Professional 3D printing studio in Jaipur. Upload your CAD file, pick a material, and get a reviewed quote within 48 hours.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "AKAAR 3D Studio" }],
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AKAAR 3D | Giving AKAAR to Ideas",
    description: "Professional 3D printing studio in Jaipur. Upload your CAD file, pick a material, and get a reviewed quote within 48 hours.",
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtimeCapabilities = getRuntimeCapabilities();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "AKAAR 3D",
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        email: "akaar3d.printing@gmail.com",
        telephone: "+91-7300431301",
        sameAs: [
          "https://www.instagram.com/akaar3d/",
          "https://www.linkedin.com/company/akaar3d/",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: "AKAAR 3D",
        url: siteUrl,
        telephone: "+91-7300431301",
        email: "akaar3d.printing@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "9-B, 69, Block-B, Ring Road, Boorthal",
          addressLocality: "Jaipur",
          addressRegion: "Rajasthan",
          postalCode: "303012",
          addressCountry: "IN",
        },
        openingHours: "Mo-Sa 10:00-19:00",
        priceRange: "₹₹",
        description: "Professional 3D printing studio in Jaipur offering FDM printing in PLA, ABS, TPU, and PETG. Custom geometries, rapid prototyping, and product parts shipped across India.",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
        <SettingsInitializer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className={`${manrope.variable} ${syne.variable} ${ibmPlexMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200`}
      >
        {/* Skip-to-content — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <RuntimeCapabilitiesProvider capabilities={runtimeCapabilities}>
            <SupabaseProvider>
              <SettingsProvider>
                <AuthProvider enabled={runtimeCapabilities.authAvailable}>
                  <ToastProvider>
                    <WishlistProvider>
                      <RecentlyViewedProvider>
                      <CartProvider>
                        <ScrollProgress />
                        <Header />
                        <DevelopmentSetupBanner capabilities={runtimeCapabilities} />
                        <main id="main-content" className="min-h-screen pb-16 md:pb-0">{children}</main>
                        <Footer />
                        <BottomNav />
                        <WhatsAppButton />
                        <LazyAIChatWidget />
                        <LazyCartDrawer />
                      </CartProvider>
                      </RecentlyViewedProvider>
                    </WishlistProvider>
                  </ToastProvider>
                </AuthProvider>
              </SettingsProvider>
            </SupabaseProvider>
          </RuntimeCapabilitiesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
