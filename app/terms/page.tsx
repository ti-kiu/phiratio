import { price } from "@/lib/pricing";
import { pageMeta, supportEmail } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Use and Refund Policy — PhiRatio",
  description:
    "Terms for using PhiRatio, including the USD 7.99 one-time export license, 7-day refund, and payments processed by Creem as the merchant of record.",
  path: "/terms/",
});

function Mail() {
  return (
    <a className="text-link underline underline-offset-4" href={`mailto:${supportEmail}`}>
      {supportEmail}
    </a>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[760px] px-4 py-12 min-[900px]:px-12">
      <h1 className="text-5xl text-ink">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: 18 November 2026</p>
      <div className="mt-6 space-y-4 leading-7 text-ink">
        <h2 className="pt-2 text-3xl text-ink">1. Service Description</h2>
        <p>
          PhiRatio is a measurement and design tool at{" "}
          <a className="text-link underline underline-offset-4" href="https://phiratio.app/">
            https://phiratio.app/
          </a>
          . You can upload or capture a photo in your browser, place or adjust landmarks, view a reference grid, read proportion measurements, and export results.
        </p>
        <p>
          Disclaimer: PhiRatio is a design aid. It is not a medical device, medical advice, a beauty assessment, or a rating of appearance. Reference values are design references, not a standard of attractiveness. We do not award a beauty score, rank, or percentile.
        </p>
        <p>
          The service does not swap, morph, beautify, or otherwise manipulate a face into a different face, generate deepfakes, or provide a clinical, surgical, or cosmetic recommendation. Exports may overlay a grid or measurements on your photo. That overlay is a reference, not a change to the underlying face.
        </p>

        <h2 className="pt-4 text-3xl text-ink">2. Eligibility</h2>
        <p>You must be 18 years of age or older to use PhiRatio.</p>

        <h2 className="pt-4 text-3xl text-ink">3. Photos</h2>
        <p>
          Photos and landmarks are processed in your browser and are not uploaded to our servers. You are responsible for only using photos you have the right to use, and for any files you choose to save on your device. You retain whatever rights you already have in those photos. You grant us no license to those photos, because we do not receive them.
        </p>

        <h2 className="pt-4 text-3xl text-ink">4. Payments</h2>
        <p>The free features include measurements, grid overlay, and a low-resolution watermarked export, as described on the site.</p>
        <p>
          A one-time purchase of <strong>{price.label}</strong> unlocks the paid deliverables listed on the pricing page, currently a high-resolution export without watermark (PNG, including transparency where offered) and a PDF report generated in your browser. The purchase is a one-time license to use those export features. It is not a subscription. It does not sell a better measurement result or a more favorable conclusion.
        </p>
        <p>
          Paid unlocks are billed through our merchant of record, Creem. When you complete a purchase, you are buying from Creem. Creem handles payment processing, invoicing, and applicable taxes. Your purchase is also subject to{" "}
          <a className="text-link underline underline-offset-4" href="https://www.creem.io/buyer-terms">
            Creem&apos;s Buyer Terms
          </a>{" "}
          and{" "}
          <a className="text-link underline underline-offset-4" href="https://www.creem.io/privacy">
            Privacy Notice
          </a>
          .
        </p>
        <p>We do not create user accounts. Access to paid export features is granted with a license key stored in your browser. You can restore access on a new device with the email used at checkout.</p>

        <h2 className="pt-4 text-3xl text-ink">5. Refunds</h2>
        <p>
          We offer a {price.refundDays}-day full refund on the one-time purchase, no questions asked. If you are not satisfied within the first {price.refundDays} days, contact us at <Mail /> from the email used at checkout, or reply to your purchase receipt. We process refund requests within 3 business days. Refunds are issued to the original payment method by our payment provider Creem.
        </p>
        <p>See the Refund Policy below for full terms.</p>

        <h2 className="pt-4 text-3xl text-ink">6. Prohibited Uses</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use the service for unlawful purposes, or to harass, defame, or exploit anyone</li>
          <li>use the service to create face-swap, deepfake, or appearance-manipulation outputs</li>
          <li>attempt to disrupt the service</li>
          <li>misrepresent measurements as medical, official, or guaranteed findings</li>
          <li>post fake reviews or fabricated user counts about the service</li>
        </ul>

        <h2 className="pt-4 text-3xl text-ink">7. Intellectual Property</h2>
        <p>
          The site, our original grids, text, and software are owned by us or our licensors. Our grids are drawn from golden-ratio geometry and are not official third-party templates. You may download the free templates we provide for your own design and reference use, subject to any license note on the templates page.
        </p>

        <h2 className="pt-4 text-3xl text-ink">8. Limitation of Liability</h2>
        <p>
          PhiRatio is provided &quot;as is&quot; without warranties. Measurements depend on photo quality, camera angle, lighting, and the placement of landmarks. We do not warrant that results are accurate, complete, or suitable for any professional, medical, or cosmetic decision. We are not liable for decisions made based on the measurements. Nothing in these terms limits liability that cannot be limited under applicable law.
        </p>

        <h2 className="pt-4 text-3xl text-ink">9. Changes</h2>
        <p>We may update these terms from time to time. Continued use of PhiRatio after changes constitutes acceptance of the new terms.</p>

        <h2 className="pt-4 text-3xl text-ink">10. Contact</h2>
        <p>
          Questions can be sent to <Mail />.
        </p>

        <h2 id="refund" className="scroll-mt-6 pt-8 text-3xl text-ink">
          Refund Policy
        </h2>
        <p>
          We offer a {price.refundDays}-day full refund on the one-time {price.label} purchase. If you are not satisfied within the first {price.refundDays} days, contact us at <Mail /> with your checkout email, or reply to your purchase receipt. No questions asked.
        </p>
        <p>We process refund requests within 3 business days. Refunds are issued to the original payment method by our payment provider Creem.</p>
        <p>
          If we do not respond within 3 business days, Creem may issue a refund on our behalf. Creem also reserves the right to issue a refund within 60 days of purchase to help prevent chargebacks. Your purchase is also subject to{" "}
          <a className="text-link underline underline-offset-4" href="https://www.creem.io/buyer-terms">
            Creem&apos;s Buyer Terms
          </a>
          .
        </p>
        <p>After a refund, the paid license may be revoked. Files you have already saved on your device stay on your device.</p>
      </div>
    </main>
  );
}
