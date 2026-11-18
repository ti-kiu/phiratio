import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const paths = ["/", "/templates/", "/pricing/", "/privacy/", "/terms/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-18");
  return paths.map((path) => ({
    url: path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`,
    lastModified,
  }));
}
