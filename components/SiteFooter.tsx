import Link from "next/link";
import { supportEmail } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-8 text-sm text-muted min-[900px]:px-12 sm:flex-row sm:items-end sm:justify-between">
        <p>
          PhiRatio
          <span className="mt-1 block">Payments are processed by Creem as the merchant of record.</span>
          <a className="mt-1 block text-link underline underline-offset-4" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </p>
        <nav aria-label="Guides" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/face-symmetry-test/" className="text-link underline underline-offset-4">
            Face Symmetry Test
          </Link>
          <Link href="/face-shape-guide/" className="text-link underline underline-offset-4">
            Face Shape Guide
          </Link>
          <Link href="/golden-ratio-face-examples/" className="text-link underline underline-offset-4">
            Golden Ratio Face Examples
          </Link>
        </nav>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/privacy/" className="text-link underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms/" className="text-link underline underline-offset-4">
            Terms
          </Link>
          <Link href="/pricing/" className="text-link underline underline-offset-4">
            Pricing
          </Link>
          <Link href="/terms/#refund" className="text-link underline underline-offset-4">
            Refund
          </Link>
        </nav>
      </div>
    </footer>
  );
}
