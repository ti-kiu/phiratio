import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 min-[900px]:px-12">
      <h1 className="text-5xl text-ink">Page not found</h1>
      <p className="mt-4 leading-7 text-muted">That address is not on PhiRatio.</p>
      <p className="mt-6">
        <Link href="/" className="text-link underline underline-offset-4">
          Back to the measure page
        </Link>
      </p>
    </main>
  );
}
