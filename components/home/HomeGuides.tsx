import Link from "next/link";
import { measurements } from "@/lib/measurements";
import { placementLandmarks } from "@/lib/landmarks";

const steps = [
  {
    title: "Place the landmarks",
    body: `After the auto-detect pass, confirm ${placementLandmarks.length} points on the photo — hairline, brows, eye corners, nose, mouth corners, chin. The tool levels head tilt before it measures anything.`,
  },
  {
    title: "Read the ratio table",
    body: `Every pair the catalog defines — ${measurements.rows.length} rows covering face length, width, thirds, eyes, nose, lips, and the left-right mirror checks — is classified as pass, near, miss, or not measurable.`,
  },
  {
    title: "See the grid on the photo",
    body: "Toggle the overlay and the same landmarks draw the reference lines directly on your image, so every passing number has a visible line behind it.",
  },
  {
    title: "Export when you want the record",
    body: "Results stay free on screen; the one-time unlock adds a high-resolution export and a PDF report with the full table.",
  },
];

const guides = [
  {
    href: "/face-symmetry-test/",
    h3: "Face symmetry test",
    body: "What the left-right mirror pairs actually measure, and why exact symmetry is rare.",
  },
  {
    href: "/golden-ratio-face-examples/",
    h3: "Golden ratio face examples",
    body: "Eleven worked proportion examples with the windows they depend on — and where the idea breaks down.",
  },
  {
    href: "/face-shape-guide/",
    h3: "Face shape guide",
    body: "Four measurements decide it: the tests that separate square, oval, diamond, round, and heart faces.",
  },
  {
    href: "/templates/",
    h3: "Free grid templates",
    body: "Transparent PNG and SVG overlays for Canva, Figma, and Photoshop.",
  },
];

export function HomeGuides() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-4 pb-14 pt-4 min-[900px]:px-12">
        <h2 className="text-3xl text-ink">How the calculator reads a face</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-line p-5 bg-white">
              <h3 className="text-lg text-ink">
                {`${i + 1}. ${s.title}`}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 pb-16 min-[900px]:px-12">
        <h2 className="text-3xl text-ink">Guides and tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g) => (
            <Link key={g.href} href={g.href} className="block rounded-2xl border border-line p-5 bg-white hover:border-ink transition">
              <h3 className="text-lg text-ink">{g.h3}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{g.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
