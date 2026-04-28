import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/sanity-content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const displayName = site.displayName || site.legalName;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${displayName} — Wholesale CPG Distribution & Retail`,
      template: `%s | ${displayName}`,
    },
    description: `${displayName} is a Florida-based wholesale distributor and multi-channel retailer of consumer packaged goods across grocery, household essentials, beverages, and health & beauty.`,
    openGraph: {
      type: "website",
      siteName: displayName,
      locale: "en_US",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
