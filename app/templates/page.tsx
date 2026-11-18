import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Golden Ratio Face Templates — Free Transparent PNG & SVG",
  description:
    "Download free golden ratio face templates as transparent PNG and SVG. Front, side, and thirds-and-fifths grids for editing and design reference.",
  path: "/templates/",
});

const templates = [
  {
    png: "template-front-transparent.png",
    svg: "template-front.svg",
    title: "Front grid",
    text: "A front-view construction grid for overlaying a straight-on photo.",
    alt: "Transparent front-facing golden ratio face template",
  },
  {
    png: "template-side-transparent.png",
    svg: "template-side.svg",
    title: "Side grid",
    text: "A side-view construction grid. Measurement in this version still uses one front photo.",
    alt: "Transparent side-profile golden ratio face template",
  },
  {
    png: "template-thirds-transparent.png",
    svg: "template-thirds.svg",
    title: "Thirds and fifths grid",
    text: "Equal thirds across the height and fifths across the width.",
    alt: "Face proportions template showing the rule of thirds and fifths",
  },
];

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-12 min-[900px]:px-12">
      <h1 className="text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-ink">Golden Ratio Face Templates</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Free transparent PNGs. The area around each grid is empty, so a photo can show through. Place the grid in any editor you already use.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-ink">
        These are not official third-party templates (including Marquardt). They are a design aid, not a medical or beauty assessment.
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
            <a className="mt-4 text-link underline underline-offset-4" href={`/templates/${template.png}`} download={template.png}>
              Download {template.png}
            </a>
            <a className="mt-2 text-link underline underline-offset-4" href={`/templates/${template.svg}`} download={template.svg}>
              Download {template.svg}
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
