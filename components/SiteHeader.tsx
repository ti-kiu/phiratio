"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Measure" },
  { href: "/templates/", label: "Templates" },
  { href: "/pricing/", label: "Pricing" },
];

function normalize(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function SiteHeader() {
  const pathname = normalize(usePathname() || "/");
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 min-[900px]:px-12">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <span className="grid h-7 w-7 grid-cols-2 gap-px rounded-[5px] border border-ink p-[3px]" aria-hidden="true">
            <span className="bg-ink/80" />
            <span className="bg-ink/80" />
            <span className="bg-ink/80" />
            <span className="bg-ink/80" />
          </span>
          PhiRatio
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-sm text-[#3f392f] sm:gap-8">
          {links.map((link) => {
            const active = normalize(link.href) === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? "border-b-2 border-gold pb-1 font-semibold text-ink" : "pb-1 hover:text-ink"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
