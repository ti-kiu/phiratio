import { PricingDesk } from "@/components/pricing/PricingDesk";
import { price, UNLOCK_NAME } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Pricing — USD 7.99 One-Time Golden Ratio Face Export",
  description: "Unlock high-resolution export and a PDF report. USD 7.99 one-time, 7-day refund. Photos stay in your browser.",
  path: "/pricing/",
});

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: UNLOCK_NAME,
    price: price.amount.toFixed(2),
    priceCurrency: price.currency,
    description: "One-time purchase for a high-resolution PNG and a PDF report generated in the browser.",
  };
  return (
    <main>
      <PricingDesk />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
