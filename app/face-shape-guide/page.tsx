import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, siteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Face Shape Guide — Square, Oval, Diamond & How to Tell",
  description:
    "Find your face shape with four measurements: the exact tests that separate square, oval, diamond, round, and heart faces, from one straight-on photo.",
  path: "/face-shape-guide/",
});

type Shape = {
  id: string;
  name: string;
  aka?: string;
  markers: string[];
  widest: string;
  jaw: string;
  notes: string;
};

const shapes: Shape[] = [
  {
    id: "oval",
    name: "Oval",
    markers: [
      "Face length is noticeably greater than cheekbone width.",
      "Cheekbones are the widest point; the forehead is slightly wider than the jaw.",
      "The jawline is rounded, not angular.",
    ],
    widest: "Cheekbones",
    jaw: "Soft, rounded",
    notes:
      "The most common reference shape in grooming and eyewear guides — most other shapes are described by how they differ from this one. If your length-to-width ratio reads high and your angles are soft, you are likely here.",
  },
  {
    id: "square",
    name: "Square",
    markers: [
      "Face length and cheekbone width are close to each other.",
      "Forehead, cheekbones, and jaw share nearly the same width.",
      "The jaw has strong, defined angles.",
    ],
    widest: "Even — forehead to jaw",
    jaw: "Angular, wide",
    notes:
      "The giveaway versus oval is the combination of short length and hard corners: measure the jaw angle against the hairline-to-chin line in a straight-on photo and the width will not taper. Round faces also measure close to even, but without the corner.",
  },
  {
    id: "diamond",
    name: "Diamond",
    markers: [
      "Cheekbones are clearly the widest point of the face.",
      "The forehead is narrow relative to the cheekbones.",
      "The chin is pointed and the jawline tapers steeply.",
    ],
    widest: "High cheekbones",
    jaw: "Narrow, tapering to a point",
    notes:
      "The rarest shape in most surveys and the one most often confused with oval. The test: compare forehead width to cheekbone width. Oval keeps a gentle taper top to bottom; diamond has a distinct pinch at the temples with wide, high cheekbones.",
  },
  {
    id: "round",
    name: "Round",
    markers: [
      "Face length and width are close, like a square face.",
      "Cheekbones are the widest point, but softly.",
      "No sharp jaw corners — the outline is curved.",
    ],
    widest: "Cheekbones",
    jaw: "Curved, no corner",
    notes:
      "Square and round measure almost identically on length-versus-width. The separator is angularity: look at the back corners of the jaw in a straight-on photo. Full cheeks and a shorter chin reinforce the read.",
  },
  {
    id: "oblong",
    name: "Oblong (rectangular)",
    aka: "rectangle, oblong face shape",
    markers: [
      "Face length is clearly the largest number, greater than oval.",
      "Forehead, cheekbones, and jaw are about equal in width.",
      "The sides of the face run straight down.",
    ],
    widest: "Even — straight sides",
    jaw: "Can be angular or soft, but never wide",
    notes:
      "Think square stretched vertically: even widths all the way down, but a long window. Hairline and chin position matter here — a high hairline can make any face read oblong in a photo, so measure from the actual hairline, not the visible forehead.",
  },
  {
    id: "heart",
    name: "Heart",
    aka: "triangle-inverted, widow's peak",
    markers: [
      "The forehead and temples are the widest part.",
      "The face narrows steadily toward the chin.",
      "The chin is pointed; a widow's peak hairline is common.",
    ],
    widest: "Forehead / temples",
    jaw: "Narrow, pointed chin",
    notes:
      "The mirror image of a triangle face: widest at the top. Diamond is the confusable cousin — diamond also has a narrow forehead and pointed chin, so check the cheekbones: heart peaks at the temples, diamond peaks lower at the cheekbone arch.",
  },
  {
    id: "triangle",
    name: "Triangle (pear)",
    markers: [
      "The jaw is the widest part of the face.",
      "Width decreases going up: jaw wider than cheekbones, cheekbones wider than forehead.",
      "The chin is broad rather than pointed.",
    ],
    widest: "Jaw",
    jaw: "Broad, full",
    notes:
      "Least frequently reported shape. The forehead-to-jaw widening is the whole test — a square face is even from forehead to jaw, so if your jaw measures wider than your temples you are outside square.",
  },
];

const faqs = [
  {
    q: "What is my face shape?",
    a: "Take four measurements in a straight-on photo: face length (hairline to chin), cheekbone width, forehead width (temple to temple), and jaw width (ear to chin tip). Your shape is decided by which of those is largest and how angular your jaw corner is. The guide above maps every combination to one of the seven standard shapes.",
  },
  {
    q: "How do I find my face shape in one photo?",
    a: "Face the camera squarely at eye level, hair pulled back, neutral expression. One straight-on photo gives all four measurements: length runs down the midline from hairline to chin tip, and the three widths run across the forehead, cheekbone, and jaw lines. A turned head or wide-angle selfie distorts the widths, which is the most common reason people misclassify themselves.",
  },
  {
    q: "What is the difference between a square face and a round face?",
    a: "Both measure short — length and width close together. The difference is the jaw: a square face has visible hard corners at the back of the jaw, a round face has a continuous curve. If you cannot tell from a photo, look at the shadow line under the ear — a corner creates an angle, a curve does not.",
  },
  {
    q: "Is oval face shape actually the most common?",
    a: "It is the most common label people self-report and the one most guides treat as the baseline, partly because the category is generous: faces only need a moderate length advantage and a soft jaw to qualify. Strict measurement moves some reported oval faces into oblong or heart territory.",
  },
  {
    q: "Does face shape change with age or weight?",
    a: "The bone measurements — length, widths, jaw angle — stay fixed, but soft tissue shifts the read. Cheek and jaw fullness from weight change can push a measured oval into round-adjacent territory, and age-related volume loss in the face can make a previously full mid-face read more diamond or oblong. Bone structure decides the shape; the photo reads the current soft-tissue version of it.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Face Shape Guide — Square, Oval, Diamond & How to Tell",
      description:
        "The four measurements that separate the seven standard face shapes, with per-shape identification markers and a free in-browser photo check.",
      url: `${siteUrl}/face-shape-guide/`,
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

export default function FaceShapeGuidePage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-12 min-[900px]:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="max-w-3xl">
        <h1 className="text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-ink">Face Shape Guide</h1>
        <p className="mt-5 text-lg leading-8 text-ink">
          There are only four numbers you need: face length, cheekbone width, forehead width, and jaw width. Which one
          is largest — and whether your jaw is angular or soft — decides your shape. This guide maps all seven standard
          shapes to those measurements and shows where the look-alikes get confused.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Most shape quizzes judge by eye and get it wrong on the look-alike pairs (square/round, oval/diamond,
          heart/diamond). Measuring from one straight-on photo settles them, and the free calculator below does exactly
          that — no upload, no signup.
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center bg-ink px-7 py-3.5 rounded-lg font-semibold text-paper hover:opacity-90 transition"
          href="/"
        >
          Measure your face from a photo &rarr;
        </Link>
      </section>

      {/* The four measurements */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl text-ink">The four measurements</h2>
        <p className="mt-3 leading-7 text-muted">
          All of these come from one straight-on, eye-level photo. The calculator places landmarks on the photo and
          reads each line.
        </p>
        <ol className="mt-5 space-y-3 leading-7 list-decimal pl-5 text-ink">
          <li>
            <strong>Face length</strong> — down the midline from the hairline to the tip of the chin.
          </li>
          <li>
            <strong>Cheekbone width</strong> — the widest point of the mid-face, usually just under the outer corners of
            the eyes.
          </li>
          <li>
            <strong>Forehead width</strong> — temple to temple across the widest part of the forehead.
          </li>
          <li>
            <strong>Jaw width</strong> — corner to corner, the widest point of the lower third.
          </li>
        </ol>
        <p className="mt-5 leading-7 text-muted">
          Then one visual check: is the back corner of the jaw an angle (square) or a curve (everything else)? Four
          numbers plus that one answer cover all seven shapes.
        </p>
      </section>

      {/* Per-shape sections */}
      <section className="mt-16">
        <h2 className="text-3xl text-ink">The seven face shapes</h2>
        <div className="mt-6 space-y-10">
          {shapes.map((s) => (
            <article key={s.id} id={s.id} className="rounded-2xl border border-line p-6 md:p-8 bg-white">
              <h3 className="text-2xl text-ink">
                {s.name}
                {s.aka ? <span className="ml-2 text-base font-normal text-muted">({s.aka})</span> : null}
              </h3>
              <div className="mt-4 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <ul className="space-y-2 leading-7 text-ink list-disc pl-5">
                  {s.markers.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-muted uppercase tracking-wider text-xs">Widest point</dt>
                    <dd className="mt-1 text-ink">{s.widest}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-muted uppercase tracking-wider text-xs">Jawline</dt>
                    <dd className="mt-1 text-ink">{s.jaw}</dd>
                  </div>
                </dl>
              </div>
              <p className="mt-5 leading-7 text-muted">{s.notes}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Confusion table */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl text-ink">The three look-alike pairs</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-ink">
                <th className="py-3 pr-4 font-semibold">Pair</th>
                <th className="py-3 pr-4 font-semibold">The single test that separates them</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pair: "Square vs round", test: "Jaw corner: angle = square, curve = round. The measurements are otherwise nearly identical." },
                { pair: "Oval vs diamond", test: "Forehead width: oval stays fairly full at the temples, diamond pinches narrow. Both have a soft jaw." },
                { pair: "Heart vs diamond", test: "Where the widest point sits: temples = heart, cheekbone arch = diamond. Both taper to a pointed chin." },
              ].map((row) => (
                <tr key={row.pair} className="border-b border-line align-top">
                  <td className="py-3 pr-4 font-semibold text-ink whitespace-nowrap">{row.pair}</td>
                  <td className="py-3 pr-4 leading-7 text-muted">{row.test}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/">
          <h2 className="text-lg text-ink">Face calculator</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Place landmarks on one photo and get all four measurements plus eleven ratio checks.</p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/golden-ratio-face-examples/">
          <h2 className="text-lg text-ink">Golden ratio face examples</h2>
          <p className="mt-2 text-sm leading-6 text-muted">The proportion grid behind shape analysis — worked examples with honest limits.</p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/face-symmetry-test/">
          <h2 className="text-lg text-ink">Symmetry test</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Shape reads assume the two halves match — check the mirror pairs first.</p>
        </Link>
      </section>

      <p className="mt-12 text-sm leading-6 text-muted max-w-3xl">
        PhiRatio&rsquo;s shape guidance is a design and styling reference, not a medical or beauty assessment. Shape
        categories are conventions — any face is one photo and four measurements away from its label.
      </p>
    </main>
  );
}
