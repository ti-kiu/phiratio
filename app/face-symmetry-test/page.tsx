import Link from "next/link";
import { pageMeta, siteUrl } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Symmetrical Face Test — What It Measures and How",
  description:
    "A symmetrical face means the two halves match in width and height. Take the free in-browser test, see the three mirror checks, and why exact matches are rare.",
  path: "/face-symmetry-test/",
});

const checks = [
  {
    name: "Eye width, left vs right",
    ratio: "1.0",
    text: "The horizontal span of each eye, measured from the inner corner to the outer corner, divided side by side.",
  },
  {
    name: "Brow height, left vs right",
    ratio: "1.0",
    text: "The vertical position of each brow at the same landmark, compared across the midline. Rotate the frame so the eye line is horizontal first.",
  },
  {
    name: "Mouth-corner height, left vs right",
    ratio: "1.0",
    text: "The vertical position of each corner of the mouth, compared across the midline. A one-sided smile is the most common flag here.",
  },
];

const faqs = [
  {
    q: "What is a perfectly symmetrical face?",
    a: "One where the left and right halves are mirror images: matching eye widths, brow heights, and mouth-corner positions, with a side-to-side ratio of exactly 1.0. Perfect symmetry is vanishingly rare in real faces.",
  },
  {
    q: "Is a slightly asymmetrical face normal?",
    a: "Yes. Every face shows some difference between the two sides, from chewing habits, sleeping position, or the way you smile. Small differences are ordinary and usually invisible to other people.",
  },
  {
    q: "Which side is left and which is right?",
    a: "In this test, left and right mean the side that appears on the left or right of the photo — not the subject's anatomical left or right. Mirrored selfies can flip the labels, so keep the convention in mind when comparing photos.",
  },
  {
    q: "Why does my face look more asymmetrical in some photos?",
    a: "Camera angle. Turning the head left or right makes the far side look shorter and the near side wider, even when the face itself is balanced. Face the camera squarely at eye level and avoid wide-angle selfie lenses.",
  },
  {
    q: "How do I test my face symmetry for free?",
    a: "Use the golden ratio face calculator on this site: load a straight-on photo, place the landmarks, and the three symmetry checks compute side-to-side ratios in your browser. The photo never leaves your device and there is no signup.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Face Symmetry Test — What It Measures and How",
      description:
        "A symmetrical face means the two halves match in width and height. The free in-browser test shows the three mirror checks and why most faces are not exact.",
      url: `${siteUrl}/face-symmetry-test/`,
      publisher: { "@type": "Organization", name: "PhiRatio", url: siteUrl },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function FaceSymmetryTestPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-12 min-[900px]:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-3xl">
        <h1 className="text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-ink">Face Symmetry Test</h1>
        <p className="mt-5 text-lg leading-8 text-ink">
          A symmetrical face is one whose two halves match: the same eye widths, brow heights, and mouth-corner
          positions on each side of the midline. The test below compares those three pairs in a photo and gives you a
          side-to-side ratio — 1.0 means an exact match.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Most real faces land close to 1.0 but not on it, and that is normal. What the measurement is good for is
          separating true facial asymmetry from camera effects — a turned head can fake a lopsided face.
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center bg-ink px-7 py-3.5 rounded-lg font-semibold text-paper hover:opacity-90 transition"
          href="/"
        >
          Run the free symmetry test &rarr;
        </Link>
        <p className="mt-3 text-sm text-muted">Works in your browser. No upload, no signup.</p>
      </section>

      {/* Diagram: mirrored landmarks on a constructed face outline */}
      <section className="mt-14" aria-hidden="false">
        <div className="checker rounded-2xl border border-line p-4 max-w-xl mx-auto">
          <svg viewBox="0 0 420 520" className="w-full h-auto" role="img" aria-label="Diagram of the three symmetry checks: eye width, brow height, and mouth-corner height compared across the face midline">
            <title>Three symmetry checks across the midline</title>
            <ellipse cx="210" cy="270" rx="150" ry="215" fill="none" stroke="#745812" strokeWidth="2.5" />
            <path d="M210 60 V470" stroke="#745812" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.55" />
            {/* eyes */}
            <path d="M115 220 h65 M240 220 h65" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            <path d="M147 214 v12 M273 214 v12" stroke="#1f2937" strokeWidth="2" />
            {/* brows */}
            <path d="M108 188 C135 175 165 174 186 182 M234 182 C255 174 285 175 312 188" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            {/* nose + mouth */}
            <path d="M210 232 v58" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            <path d="M168 342 Q210 366 252 342" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            {/* arrows */}
            <path d="M115 246 H180 M240 246 H305" stroke="#745812" strokeWidth="1.5" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <defs>
              <marker id="tick" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6">
                <path d="M3 0 v6" stroke="#745812" strokeWidth="1.2" />
              </marker>
            </defs>
            <text x="210" y="40" textAnchor="middle" fontSize="15" fill="#1f2937" fontFamily="inherit">midline</text>
            <text x="210" y="262" textAnchor="middle" fontSize="13" fill="#745812" fontFamily="inherit">1 · eye width L vs R</text>
            <text x="210" y="160" textAnchor="middle" fontSize="13" fill="#745812" fontFamily="inherit">2 · brow height L vs R</text>
            <text x="210" y="400" textAnchor="middle" fontSize="13" fill="#745812" fontFamily="inherit">3 · mouth-corner height L vs R</text>
          </svg>
        </div>
        <p className="mt-2 text-xs text-muted text-center max-w-xl mx-auto">
          Constructed reference diagram (not a photograph). Source: original PhiRatio artwork.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl text-ink">The three mirror checks</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          Left and right mean the side that appears on the left or right of the image, not the subject&rsquo;s
          anatomical left or right. Height checks are taken after rotating the measurement frame so the eye line is horizontal.
        </p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {checks.map((c) => (
            <li key={c.name} className="py-4 flex gap-5 items-baseline">
              <span className="tabular-nums text-2xl text-ink font-semibold shrink-0">{c.ratio}</span>
              <div>
                <h3 className="font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          These values are this site&rsquo;s design references, not a standard of appearance.
        </p>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl text-ink">What causes facial asymmetry</h2>
        <p className="mt-3 leading-7 text-muted">
          Before reading anything into your numbers, know that photos exaggerate. Real causes of small, stable
          differences between the two halves include:
        </p>
        <ul className="mt-4 space-y-3 leading-7 text-ink list-disc pl-5">
          <li><strong className="text-ink">Camera geometry</strong> — head turned, tilted, or shot on a wide-angle lens at arm&rsquo;s length. The single biggest source of fake asymmetry.</li>
          <li><strong className="text-ink">Expression habits</strong> — smiling or raising the brows more strongly on one side.</li>
          <li><strong className="text-ink">Chewing preference</strong> — regularly chewing on one side can build more muscle there over years.</li>
          <li><strong className="text-ink">Sleeping position</strong> — long-term side sleeping is a commonly cited soft-tissue factor.</li>
        </ul>
        <p className="mt-4 leading-7 text-muted">
          None of these is a beauty verdict. The tool measures geometry in one photo; it is a design reference, not a
          medical or beauty assessment.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl text-ink">Questions</h2>
        <dl className="mt-6 divide-y divide-line border-y border-line max-w-3xl">
          {faqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="text-lg font-semibold text-ink">{f.q}</dt>
              <dd className="mt-2 leading-7 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/golden-ratio-face-examples/">
          <h2 className="text-lg text-ink">Golden ratio face examples</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Where the golden ratio and its companion checks actually show up in a face — with honest limits.</p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/templates/">
          <h2 className="text-lg text-ink">Free face templates</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Transparent PNG and SVG grids to overlay in any editor.</p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/">
          <h2 className="text-lg text-ink">Golden ratio calculator</h2>
          <p className="mt-2 text-sm leading-6 text-muted">11 ratio and symmetry checks computed in your browser.</p>
        </Link>
      </section>
    </main>
  );
}
