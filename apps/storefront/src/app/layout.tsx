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
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { DevelopmentSetupBanner } from "@/components/layout/DevelopmentSetupBanner";

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

export const metadata: Metadata = {
  title: "AKAAR 3D | Giving AKAAR to Ideas | 3D Printing Services in Jaipur",
  description: "AKAAR 3D gives shape to your ideas. From CAD to physical part in days. Professional 3D printing services in Jaipur, Rajasthan. PLA, PETG, ABS materials. Reviewed quote requests for engineers and hardware startups.",
  keywords: ["3D printing", "3D printing Jaipur", "rapid prototyping", "FDM printing", "PLA printing", "PETG printing", "ABS printing", "CAD to part", "quote request", "hardware startups", "AKAAR 3D", "3D printing India", "custom 3D prints"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtimeCapabilities = getRuntimeCapabilities();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
        <SettingsInitializer />
      </head>
      <body
        className={`${manrope.variable} ${syne.variable} ${ibmPlexMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200`}
      >
        <ThemeProvider>
          <RuntimeCapabilitiesProvider capabilities={runtimeCapabilities}>
            <SupabaseProvider>
              <SettingsProvider>
                <AuthProvider enabled={runtimeCapabilities.authAvailable}>
                  <ToastProvider>
                    <WishlistProvider>
                      <CartProvider>
                        <ScrollProgress />
                        <Header />
                        <DevelopmentSetupBanner capabilities={runtimeCapabilities} />
                        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
                        <Footer />
                        <BottomNav />
                        <WhatsAppButton />
                        <LazyCartDrawer />
                      </CartProvider>
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
