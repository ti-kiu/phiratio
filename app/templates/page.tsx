import Link from "next/link";
import { pageMeta, siteUrl } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Golden Ratio Face Templates — Free Transparent PNG & SVG",
  description:
    "Download free golden ratio face templates as transparent PNG and SVG grids, plus how to overlay them on a photo in Canva, Figma, or Photoshop in under a minute.",
  path: "/templates/",
});

const templates = [
  {
    png: "template-front-transparent.png",
    svg: "template-front.svg",
    title: "Front grid",
    text: "A front-view construction grid for overlaying a straight-on photo. Golden-section verticals and horizontal divisions mark where the eye, nose, and mouth lines should fall.",
    alt: "Transparent front-facing golden ratio face template",
    useFor: "Checking face length / width, thirds-and-fifths placement, and eye-line position on head-on photos.",
  },
  {
    png: "template-side-transparent.png",
    svg: "template-side.svg",
    title: "Side grid",
    text: "A side-view construction grid. Measurement in this version still uses one front photo; the side grid is a drawing and layout reference.",
    alt: "Transparent side-profile golden ratio face template",
    useFor: "Profile drawing, ear and eye placement, dividing a side view in golden sections.",
  },
  {
    png: "template-thirds-transparent.png",
    svg: "template-thirds.svg",
    title: "Thirds and fifths grid",
    text: "Equal thirds across the height and fifths across the width — the classical drawing convention that pairs with the golden grid.",
    alt: "Face proportions template showing the rule of thirds and fifths",
    useFor: "Quick placement while sketching, and as a sanity check next to the golden grid.",
  },
];

const steps = [
  {
    tool: "Canva",
    how: [
      "Place your photo on the canvas and crop it square-ish around the head.",
      "Upload the transparent PNG, drop it on top, and stretch it to the photo's face height.",
      "Set the overlay image transparency to about 50% so landmarks stay visible underneath.",
      "Align the grid's center line with the nose and the horizontal guides with the eye, nose, and mouth lines.",
    ],
  },
  {
    tool: "Figma",
    how: [
      "Drop the SVG onto the frame — it stays crisp at any size.",
      "Put the photo in a frame behind it and lock the photo layer.",
      "Use Figma's opacity slider (right side) on the grid layer to dim it.",
      "Smart guides snap the grid's center line to the philtrum automatically while you drag.",
    ],
  },
  {
    tool: "Photoshop",
    how: [
      "Open the photo, then File → Place Embedded and choose the PNG or SVG.",
      "Set the grid layer's blend mode to Normal and opacity to around 50%.",
      "Free-transform (Cmd/Ctrl+T) so the top and bottom of the grid meet the hairline or visible forehead and the chin.",
      "Toggle the grid layer's eye icon to flip between the plain photo and the checked version.",
    ],
  },
];

const faqs = [
  {
    q: "Are these Marquardt templates?",
    a: "No. These are original PhiRatio construction grids drawn from golden-section and thirds-and-fifths geometry. They are a design aid, not a medical or beauty assessment, and they are not official third-party templates including Marquardt.",
  },
  {
    q: "What is the difference between PNG and SVG?",
    a: "PNG is a transparent bitmap that works in any editor, phone, or slide app. SVG is the same drawing as vector paths, so it stays sharp at print sizes and recolors easily in design tools.",
  },
  {
    q: "Which template should I start with?",
    a: "The front grid, with a straight-on photo taken at eye level. Head-on photos are the only ones where vertical ratios and left-right symmetry are readable without correction.",
  },
  {
    q: "How do I align the grid to my face?",
    a: "Two anchors are enough: the vertical center line on the nose's midline, and the horizontal guide that claims to sit at the eye line placed on the actual eyes. The rest of the grid follows from those two.",
  },
  {
    q: "Can I use these for drawing?",
    a: "Yes — that is what they are made for. Artists use the front grid to place features in golden sections and the thirds-and-fifths grid as the classical quick construction. Lower the opacity when inking over them.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Golden Ratio Face Templates — Free Transparent PNG & SVG",
      description:
        "Free transparent golden ratio face templates as PNG and SVG, with overlay instructions for Canva, Figma, and Photoshop.",
      url: `${siteUrl}/templates/`,
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

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-12 min-[900px]:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-ink">Golden Ratio Face Templates</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Free transparent PNGs. The area around each grid is empty, so a photo can show through. Place the grid in any
        editor you already use.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-ink">
        These are not official third-party templates (including Marquardt). They are a design aid, not a medical or
        beauty assessment.
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {templates.map((template) => (
          <article key={template.png} className="flex flex-col">
            <div className="checker rounded-2xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/templates/${template.png}`} alt={template.alt} width={900} height={1200} className="mx-auto h-auto w-full" />
            </div>
            <h2 className="mt-4 text-3xl text-ink">{template.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{template.text}</p>
            <p className="mt-2 text-sm leading-6 text-ink">{template.useFor}</p>
            <a className="mt-4 text-link underline underline-offset-4" href={`/templates/${template.png}`} download={template.png}>
              Download {template.png}
            </a>
            <a className="mt-2 text-link underline underline-offset-4" href={`/templates/${template.svg}`} download={template.svg}>
              Download {template.svg}
            </a>
          </article>
        ))}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl text-ink">How to overlay a template on a photo</h2>
        <p className="mt-3 leading-7 text-muted">
          Every method below needs one transparent PNG and whatever app you already have. No installation, no upload —
          the work happens on your own device.
        </p>
        {steps.map((s) => (
          <div key={s.tool} className="mt-8">
            <h3 className="text-xl text-ink">{s.tool}</h3>
            <ol className="mt-3 space-y-2 leading-7 list-decimal pl-5 text-ink">
              {s.how.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>
        ))}
        <p className="mt-8 leading-7 text-muted">
          Want the measurements instead of a manual overlay? The{" "}
          <Link className="text-link underline underline-offset-4" href="/">golden ratio face calculator</Link> computes 11
          ratio and symmetry checks from landmark points — same grid logic, no editor needed. The{" "}
          <Link className="text-link underline underline-offset-4" href="/golden-ratio-face-examples/">
            golden ratio face examples
          </Link>{" "}
          page explains what each number means.
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
    </main>
  );
}
