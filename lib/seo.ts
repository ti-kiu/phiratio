import type { Metadata } from "next";

export const siteUrl = "https://phiratio.app";
export const supportEmail = "support@phiratio.app";

export const ogImage = {
  url: `${siteUrl}/og.png`,
  width: 1200,
  height: 630,
  alt: "PhiRatio golden ratio face grid, a design reference for measuring facial proportions.",
} as const;

type IndexPath =
  | "/"
  | "/templates/"
  | "/face-symmetry-test/"
  | "/golden-ratio-face-examples/"
  | "/pricing/"
  | "/privacy/"
  | "/terms/";

export function pageMeta(input: { title: string; description: string; path: IndexPath }): Metadata {
  const url = input.path === "/" ? `${siteUrl}/` : `${siteUrl}${input.path}`;
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: "PhiRatio",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage.url],
    },
  };
}
