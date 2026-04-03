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
  title: "AKAAR 3D | Giving AKAAR to Ideas | 3D Printing Services in Jaipur",
  description: "AKAAR 3D gives shape to your ideas. From CAD to physical part in days. Professional 3D printing services in Jaipur, Rajasthan. PLA, PETG, ABS materials. Instant quoting for engineers and hardware startups.",
  keywords: ["3D printing", "3D printing Jaipur", "rapid prototyping", "FDM printing", "PLA printing", "PETG printing", "ABS printing", "CAD to part", "instant quote", "hardware startups", "AKAAR 3D", "3D printing India", "custom 3D prints"],
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
