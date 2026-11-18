import { FaqList } from "@/components/FaqList";
import { MeasureApp } from "@/components/measure/MeasureApp";
import { HOME_META_DESCRIPTION, HOME_META_TITLE } from "@/lib/copy";
import { getFaqItems } from "@/lib/faq";
import { price } from "@/lib/pricing";
import { pageMeta, siteUrl } from "@/lib/seo";

export const metadata = pageMeta({
  title: HOME_META_TITLE,
  description: HOME_META_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const faq = getFaqItems();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "PhiRatio",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/`,
        description: "A golden ratio face calculator that measures facial proportions and overlays a reference grid in the browser.",
        offers: {
          "@type": "Offer",
          price: price.amount.toFixed(2),
          priceCurrency: price.currency,
          description: "One-time unlock for high-resolution export and a PDF report.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main>
      <MeasureApp />
      <FaqList />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
