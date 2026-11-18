import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function canonicalPath(pathname: string) {
  if (pathname.startsWith("/_next/") || pathname.includes(".")) return pathname;
  const lower = pathname.toLowerCase();
  if (lower.length > 1 && !lower.endsWith("/")) return `${lower}/`;
  return lower;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const current = new URL(request.url);
  const nextPath = canonicalPath(current.pathname);
  const www = host === "www.phiratio.app";
  if (!www && nextPath === current.pathname) return NextResponse.next();
  const url = new URL(current.toString());
  if (www) {
    url.protocol = "https:";
    url.hostname = "phiratio.app";
    url.port = "";
  }
  url.pathname = nextPath;
  return NextResponse.redirect(url.toString(), 308);
}
