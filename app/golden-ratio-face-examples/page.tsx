import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, siteUrl } from "@/lib/seo";
import {
  formatCatalogReference,
  formatReference,
  measurements,
  PHI,
  windowAboutLabel,
} from "@/lib/measurements";

export const metadata: Metadata = pageMeta({
  title: "Golden Ratio Face Examples — What to Look For",
  description:
    "See where the golden ratio shows up: 11 worked face examples with the measurements, how to check them in your own photo, and where the idea breaks down.",
  path: "/golden-ratio-face-examples/",
});

const PHI_TEXT = formatReference(PHI);

// Guidance keyed to the locked catalog row ids — numbers themselves come from the catalog at render.
const guidance: Record<string, { how: string; note: string }> = {
  "face-length-over-width": {
    how: "Measure the face from the top of the visible forehead (or the hairline) to the chin tip, then the widest cheek-to-cheek span. Divide length by width.",
    note: "Which window you pick changes the number: a photo measured at the visible forehead reads lower than one measured hairline-to-chin. State the window, not just the ratio.",
  },
  "upper-face-over-lower-face": {
    how: "Split the face at the eye line: the part above the eyes over the part below. The reference depends on whether the visible forehead is included.",
    note: "Forehead visibility is a hairline accident, not a facial feature — the same face can pass or fail this one depending on the photo.",
  },
  "mouth-width-over-nose-width": {
    how: "Measure the mouth at its widest corners, the nose at its alae (outer edges of the nostrils). Divide mouth by nose.",
    note: "One of the more stable ratios because both landmarks sit on soft tissue with fixed anchors.",
  },
  "inter-eye-distance-over-eye-width": {
    how: "The gap between the inner corners of the eyes compared to the width of a single eye.",
    note: "This is the classical 'fifths' check: the gap between the eyes should fit roughly one eye-width.",
  },
  "chin-length-over-nose-to-mouth": {
    how: "From the midline mouth slit to the chin tip, divided by the distance from nose bottom to mouth.",
    note: "Uses the mouth slit line, not the lip edge — place landmarks consistently or the number drifts.",
  },
  "mid-face-over-lower-face": {
    how: "From eye line to nose bottom, compared with nose bottom to chin.",
    note: "Thirds and fifths is a drawing convention, not a golden ratio — it belongs on the same grid you'd overlay for construction.",
  },
  "face-width-over-five-eye-width": {
    how: "The full cheek-to-cheek width compared to five eye widths side by side.",
    note: "Hair, ears, and jaw contour add to face width but not to eye width — crop matters.",
  },
  "outer-eye-width-over-face-width": {
    how: "From the outer corner of one eye to the other, over face width.",
    note: "The two-fifths rule: the eyes occupy about the middle 60% of the face's width.",
  },
  "photo-left-over-photo-right-eye-width": {
    how: "Each eye measured inner-corner to outer-corner, then one side divided by the other.",
    note: "Left and right mean the sides of the photo, not the subject's anatomy.",
  },
  "photo-left-over-photo-right-brow-height": {
    how: "Both brows at the same landmark, compared across the midline, after rotating the frame so the eye line sits level.",
    note: "Without roll correction, a tilted head fakes a brow difference.",
  },
  "photo-left-over-photo-right-mouth-corner-height": {
    how: "The two mouth corners at the same vertical line, compared side to side.",
    note: "The most sensitive check to a one-sided smile — relax the face before the photo.",
  },
};

type Example = {
  n: number;
  name: string;
  reference: string;
  how: string;
  note: string;
};

const examples: Example[] = measurements.rows.map((row, i) => {
  const g = guidance[row.id];
  let reference: string;
  if (row.references.independent) {
    reference = formatCatalogReference(row.references.independent);
  } else {
    reference = measurements.windows
      .map((w) => `${windowAboutLabel(w.id)}: ${formatCatalogReference(row.references[w.id])}`)
      .join(" · ");
  }
  return { n: i + 1, name: row.name, reference, how: g?.how ?? "", note: g?.note ?? "" };
});

const faqs = [
  {
    q: "What does a golden ratio face look like?",
    a: `On paper: a face about ${PHI_TEXT} times longer than wide, with the mouth roughly ${PHI_TEXT} times the nose width and the eyes dividing the face into fifths. In reality, attractive faces miss these numbers often — the ratio is a construction grid artists use, not a checklist nature follows.`,
  },
  {
    q: "Who has a golden ratio face?",
    a: "You will see celebrity photos overlaid with grids claiming exactly that. Treat them as illustrations, not measurements: the overlays usually pick the window (hairline or forehead) that makes the number work. The honest answer is that no measurement protocol has crowned a universal winner.",
  },
  {
    q: "How do I check if my face fits the golden ratio?",
    a: "Load a straight-on, eye-level photo into the calculator on this site, place the landmarks, and all 11 examples above compute automatically, each with the window it uses. The photo stays in your browser.",
  },
  {
    q: "Are these numbers a beauty standard?",
    a: "No. They are this site's design references for drawing and checking proportion — a grid, like rule-of-thirds in photography. Studies of attractiveness repeatedly find faces judged beautiful both near and far from the golden ratio.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Golden Ratio Face Examples — What to Look For",
      description:
        "Eleven concrete golden ratio face examples with measurements, the windows they depend on, and where the idea breaks down.",
      url: `${siteUrl}/golden-ratio-face-examples/`,
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

export default function GoldenRatioFaceExamplesPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-12 min-[900px]:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-3xl">
        <h1 className="text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-ink">Golden Ratio Face Examples</h1>
        <p className="mt-5 text-lg leading-8 text-ink">
          &ldquo;Golden ratio face&rdquo; gets thrown around without anyone showing the arithmetic. Here are the 11
          concrete ratios people actually mean — each with the measurement, the window it depends on, and where it can
          mislead.
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center bg-ink px-7 py-3.5 rounded-lg font-semibold text-paper hover:opacity-90 transition"
          href="/"
        >
          Check these on your own photo →
        </Link>
        <p className="mt-3 text-sm text-muted">Free, in-browser calculator. No upload, no signup.</p>
      </section>

      <section className="mt-14">
        <h2 className="sr-only">The eleven ratio examples</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="mb-3 text-left text-muted">
              Ratios as this site computes them. These values are this site&rsquo;s design references, not a standard of
              appearance.
            </caption>
            <thead>
              <tr className="border-b border-line text-ink">
                <th className="py-3 pr-4 font-semibold w-10">#</th>
                <th className="py-3 pr-4 font-semibold">Example</th>
                <th className="py-3 pr-4 font-semibold">Reference</th>
                <th className="py-3 pr-4 font-semibold">How to check</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((e) => (
                <tr key={e.n} className="border-b border-line align-top">
                  <td className="py-4 pr-4 tabular-nums text-muted">{e.n}</td>
                  <td className="py-4 pr-4">
                    <span className="font-semibold text-ink">{e.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{e.note}</span>
                  </td>
                  <td className="py-4 pr-4 tabular-nums text-ink">{e.reference}</td>
                  <td className="py-4 pr-4 text-sm leading-6 text-muted">{e.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl text-ink">Where the golden ratio idea breaks down</h2>
        <ul className="mt-4 space-y-3 leading-7 list-disc pl-5 text-ink">
          <li>
            <strong>Window sensitivity.</strong> The claim that a face is &ldquo;{PHI_TEXT} times longer than
            wide&rdquo; depends on measuring hairline-to-chin. Measure only the visible forehead and the same face reads
            lower on the same scale. Both windows are legitimate — any single-number claim hides which one it picked.
          </li>
          <li>
            <strong>Camera geometry.</strong> Wide-angle lenses at arm&rsquo;s length enlarge the nose and narrow the
            face outline. A photo can fail every ratio while the face underneath is perfectly balanced.
          </li>
          <li>
            <strong>Asymmetry between the halves.</strong> The checks above compare mirrored landmarks. Measuring one
            side against the other adds noise before the ratio even starts.
          </li>
          <li>
            <strong>Survivorship in the overlays you see online.</strong> Grid images circulate because the grid was
            fitted after the photo was chosen. Fitted after, they always match.
          </li>
        </ul>
        <p className="mt-4 leading-7 text-muted">
          The grids are still genuinely useful — to artists, designers, and anyone learning to read proportion. That is
          exactly what PhiRatio is: a construction aid that shows you which numbers pass, which miss, and why, without
          dressing the geometry up as a verdict. If you want the broader read of what these proportions imply about
          overall outline, the{" "}
          <Link className="text-link underline underline-offset-4" href="/face-shape-guide/">face shape guide</Link>{" "}
          maps the same measurements to the seven standard shapes.
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
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/face-symmetry-test/">
          <h2 className="text-lg text-ink">Symmetrical face test</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Examples 9-11, expanded: the three mirror checks and what asymmetry really means.
          </p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/templates/">
          <h2 className="text-lg text-ink">Grid templates</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Download the front, side, and thirds-and-fifths grids as PNG and SVG.</p>
        </Link>
        <Link className="block rounded-2xl border border-line p-5 hover:border-ink transition" href="/">
          <h2 className="text-lg text-ink">Calculator</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Every example on this page, computed from one photo.</p>
        </Link>
      </section>
    </main>
  );
}
