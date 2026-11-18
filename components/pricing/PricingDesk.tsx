"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { creem } from "@/lib/creem";
import { price, UNLOCK_NAME } from "@/lib/pricing";
import { supportEmail } from "@/lib/seo";

const EMAIL_MISSING = "Add the email where we should send your receipt and download link.";
const EMAIL_INVALID = "Check the email address and try again.";
const CHECKOUT_CLOSED = "Checkout is not open yet. You have not been charged.";

function settled(element: HTMLElement | null) {
  if (!element) return true;
  const rect = element.getBoundingClientRect();
  const bottom = window.innerHeight - 88;
  if (rect.height > bottom - 16) return rect.top >= 0 && rect.top < 72;
  return rect.top >= 0 && rect.bottom <= bottom + 1;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function PricingDesk() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [closed, setClosed] = useState(false);
  const seenGuide = useRef({ includes: false, refund: false });
  const [checkoutInView, setCheckoutInView] = useState(false);

  useEffect(() => {
    const button = document.getElementById("checkout-submit");
    if (!button) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setCheckoutInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.6 },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  function focusReceiptEmail() {
    const field = document.getElementById("receipt-email");
    if (!(field instanceof HTMLInputElement)) return;
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    field.focus({ preventScroll: true });
  }

  function rejectEmail() {
    if (!email.trim()) {
      setEmailError(EMAIL_MISSING);
      focusReceiptEmail();
      return true;
    }
    if (!validEmail(email)) {
      setEmailError(EMAIL_INVALID);
      focusReceiptEmail();
      return true;
    }
    setEmailError("");
    return false;
  }

  function showClosed() {
    setClosed(true);
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollGuide() {
    const includes = document.getElementById("includes");
    const refund = document.getElementById("refund");
    if (settled(includes)) seenGuide.current.includes = true;
    if (settled(refund)) seenGuide.current.refund = true;
    if (!seenGuide.current.includes) {
      includes?.scrollIntoView({ behavior: "smooth", block: "start" });
      seenGuide.current.includes = true;
      return;
    }
    if (!seenGuide.current.refund) {
      refund?.scrollIntoView({ behavior: "smooth", block: "start" });
      seenGuide.current.refund = true;
      return;
    }
    if (rejectEmail()) return;
    showClosed();
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (rejectEmail()) return;
    showClosed();
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-10 pb-28 min-[900px]:px-12 min-[900px]:pb-16">
      <h1 className="text-[clamp(2.6rem,6vw,3.6rem)] leading-none text-ink">{UNLOCK_NAME}</h1>
      <p className="mt-4 text-5xl text-ink">{price.label}</p>
      <p className="mt-4 max-w-xl text-lg leading-8 text-ink">One-time purchase, not a subscription. No higher tier.</p>
      <p className="mt-4 max-w-xl text-lg leading-8 text-ink">
        Unlock high-resolution export and a PDF report generated in your browser. Measurements and the grid stay available in the free version.
      </p>
      <p className="mt-5">
        <Link href="/" className="text-link underline underline-offset-4">
          Keep using the free version
        </Link>
      </p>

      <section id="includes" className="mt-10 scroll-mt-6">
        <h2 className="text-3xl text-ink">What the one-time purchase includes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink">
          <li>High-resolution export without a watermark (PNG)</li>
          <li>Exports keep your original photo resolution.</li>
          <li>A PDF report generated in your browser</li>
        </ul>
        <p className="mt-4 leading-7 text-ink">
          The purchase is a license to use those export deliverables. It does not sell a better measurement, a more favorable conclusion, or a different grid result.
        </p>
        <h3 className="mt-6 font-sans text-lg font-semibold text-ink">What stays free</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-ink">
          <li>Measurements and the difference from each reference</li>
          <li>Reference grid overlay</li>
          <li>Manual landmark placement and correction</li>
          <li>Low-resolution export with a watermark</li>
          <li>
            Free transparent PNG grids and SVG templates (front, side, and thirds-and-fifths) on the{" "}
            <Link href="/templates/" className="text-link underline underline-offset-4">
              templates page
            </Link>
          </li>
        </ul>
      </section>

      <section id="checkout" className="mt-10 w-full scroll-mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-3xl text-ink">How checkout works</h2>
        <form className="mt-5" onSubmit={onSubmit} noValidate>
          <label htmlFor="receipt-email" className="font-semibold text-ink">
            Email
          </label>
          <p className="mt-2 leading-7 text-ink">
            Creem, the merchant of record, uses this email to process the payment and send your receipt. PhiRatio uses the same address to send your download or restore link, as described in the{" "}
            <Link href="/privacy/" className="text-link underline underline-offset-4">
              Privacy Policy
            </Link>
            . We do not receive your photos.
          </p>
          <Input
            id="receipt-email"
            className="mt-3"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <p className="mt-2 text-sm text-muted">Enter the email where Creem should send your receipt. We will use the same address for your download link.</p>
          {emailError ? (
            <p className="mt-2 text-sm text-[#6e3a2a]" role="alert">
              {emailError}
            </p>
          ) : null}
          {closed ? (
            <p className="mt-4 leading-7 text-ink" role="status">
              {CHECKOUT_CLOSED}
            </p>
          ) : null}
          <p className="mt-4 leading-7 text-ink">
            Payments are processed by Creem as the merchant of record. When you pay, you are buying from Creem. Creem handles payment processing, invoicing, and applicable taxes. Your purchase is also subject to{" "}
            <a className="text-link underline underline-offset-4" href={creem.buyerTermsUrl}>
              Creem&apos;s Buyer Terms
            </a>{" "}
            and{" "}
            <a className="text-link underline underline-offset-4" href={creem.privacyNoticeUrl}>
              Creem&apos;s Privacy Notice
            </a>
            .
          </p>
          <p className="mt-3 leading-7 text-ink">Photos and landmarks stay in your browser. We do not receive them.</p>
          <p className="mt-3 text-sm leading-6 text-muted">Reports are generated in your browser. A reference grid is a design guide, not a medical or beauty assessment.</p>
          <Button id="checkout-submit" type="submit" className="mt-4 w-full">
            Continue to checkout
          </Button>
          <p className="mt-3 text-center text-sm leading-6 text-muted">{price.label}, one time</p>
        </form>
      </section>

      <section id="refund" className="mt-10 w-full scroll-mt-6">
        <h2 className="text-3xl text-ink">{price.refundDays}-day refund</h2>
        <div className="mt-3 space-y-3 leading-7 text-ink">
          <p>You can ask for a refund within {price.refundDays} days, and you do not need to give a reason.</p>
          <p>
            Write to{" "}
            <a className="text-link underline underline-offset-4" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>{" "}
            from the email used at checkout, or reply to your purchase receipt. We process refund requests within 3 business days. Refunds are issued to the original payment method by Creem. After a refund, the paid license may be revoked.
          </p>
          <p>
            Refunds of the payment are processed by Creem as the merchant of record. If we cannot resolve your request, you may contact Creem through the customer portal or the contact options on creem.io, as described in{" "}
            <a className="text-link underline underline-offset-4" href={creem.buyerTermsUrl}>
              Creem&apos;s Buyer Terms
            </a>
            .
          </p>
          <p>
            <Link href="/terms/#refund" className="text-link underline underline-offset-4">
              Read the full refund policy
            </Link>
          </p>
        </div>
      </section>

      <section id="restore" className="mt-10">
        <h2 className="text-3xl text-ink">Use this purchase on a new device</h2>
        <p className="mt-3 leading-7 text-ink">After payment, you receive a receipt and a link that restores access on a new device. Keep that email.</p>
        <p className="mt-3 leading-7 text-ink">Open the restore link in your receipt to enable the paid export on this device.</p>
      </section>

      <div
        className={
          checkoutInView
            ? "hidden"
            : "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur min-[900px]:hidden"
        }
      >
        <button type="button" onClick={scrollGuide} className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-gold px-4 text-[15px] font-semibold text-gold-ink">
          Continue to checkout
        </button>
      </div>
    </div>
  );
}
