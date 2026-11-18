import { pageMeta, supportEmail } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy — PhiRatio",
  description:
    "Photos and landmarks stay in your browser. PhiRatio does not create a user account. Payments are processed by Creem as the merchant of record.",
  path: "/privacy/",
});

function Mail() {
  return (
    <a className="text-link underline underline-offset-4" href={`mailto:${supportEmail}`}>
      {supportEmail}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[760px] px-4 py-12 min-[900px]:px-12">
      <h1 className="text-5xl text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: 18 November 2026</p>
      <div className="mt-6 space-y-4 leading-7 text-ink">
        <p>
          PhiRatio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides facial-proportion measurement tools at{" "}
          <a className="text-link underline underline-offset-4" href="https://phiratio.app/">
            https://phiratio.app/
          </a>
          . This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.
        </p>

        <h2 className="pt-4 text-3xl text-ink">2. Information We Collect</h2>
        <p className="font-semibold">Information You Provide</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Email address (when you purchase an export license), used to send a license-restore link and to look up your order if you write about a refund or access issue</li>
          <li>Billing information (name, email, country, and payment details) is collected and processed by our payment provider Creem, which acts as the merchant of record; we do not store or receive card numbers</li>
          <li>Support messages you send us, including any email address and content you include</li>
        </ul>
        <p className="font-semibold">Automatically Collected</p>
        <p>
          We do not currently use third-party analytics or advertising cookies. We use only technical storage in your browser that is needed for the tool to work, such as remembering a license key after a successful purchase.
        </p>

        <h2 className="pt-4 text-3xl text-ink">3. How We Use Your Information</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>To provide the measurement tool and paid export unlock</li>
          <li>To send a license-restore link and answer refund or access requests</li>
          <li>To prevent abuse and ensure security</li>
        </ul>

        <h2 className="pt-4 text-3xl text-ink">4. Photo Handling</h2>
        <p>
          Important: Photos you upload or capture, and the facial landmarks and measurements you create, are processed in your browser. We do not receive them, store them, or send them to a server. We do not use your photos for training. Closing the page clears this data from the session, unless you have saved a file yourself.
        </p>

        <h2 className="pt-4 text-3xl text-ink">5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Cloudflare — Hosting and delivery</li>
          <li>
            Creem — Merchant of record: payment processing, tax compliance, and invoicing (see{" "}
            <a className="text-link underline underline-offset-4" href="https://www.creem.io/privacy">
              Creem&apos;s Privacy Notice
            </a>{" "}
            and{" "}
            <a className="text-link underline underline-offset-4" href="https://www.creem.io/buyer-terms">
              Buyer Terms
            </a>
            )
          </li>
        </ul>
        <p>Checkout pages provided by Creem may use cookies or similar storage under Creem&apos;s own privacy notice; PhiRatio does not control those.</p>
        <p>We may use an email delivery service to send the license-restore message. We will name that provider here when it is chosen.</p>

        <h2 className="pt-4 text-3xl text-ink">6. Cookies</h2>
        <p>
          We use essential technical storage for the license state on this device. We do not currently set advertising or analytics cookies. If we add analytics later, we will update this policy before that service goes live. Event analytics, if added, will not include your photos or landmark coordinates.
        </p>

        <h2 className="pt-4 text-3xl text-ink">7. Data Retention</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Photos and landmarks: not stored by us</li>
          <li>Order email and license record: kept as long as needed to restore access, send a receipt, or process a refund, and as required for transaction records</li>
          <li>Support messages: kept as long as needed to handle your request</li>
        </ul>
        <p>
          If you want your order email and license record deleted, write to <Mail />. Deleting that record may prevent you from restoring a paid license by email. Files already saved on your device are under your control. Payment and invoice records held by Creem are governed by Creem&apos;s own policies.
        </p>

        <h2 className="pt-4 text-3xl text-ink">8. Your Rights</h2>
        <p>
          You can request access, correction, or deletion of personal information we hold by contacting us. For EU residents (GDPR), you have additional rights including the right to access, rectify, erase, restrict processing, and data portability.
        </p>

        <h2 className="pt-4 text-3xl text-ink">9. Age</h2>
        <p>
          This tool is intended for people 18 years of age or older. We do not knowingly collect personal information from children. If you believe a minor has provided us with an email address, contact us and we will delete it.
        </p>

        <h2 className="pt-4 text-3xl text-ink">10. Changes</h2>
        <p>We may update this policy from time to time. The date at the top will change when we do.</p>

        <h2 className="pt-4 text-3xl text-ink">11. Contact</h2>
        <p>
          For privacy inquiries, contact us at <Mail />.
        </p>
      </div>
    </main>
  );
}
