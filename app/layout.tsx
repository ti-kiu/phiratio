import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Rulers } from "@/components/Rulers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PhiRatio",
    template: "%s | PhiRatio",
  },
  description: "Measure facial proportions in the browser. Photos are not uploaded.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Rulers />
        <SiteHeader />
        <div id="content" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
