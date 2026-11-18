import { PHI, formatReference } from "@/lib/measurements";

export function Rulers() {
  const label = formatReference(PHI);
  return (
    <div aria-hidden="true" className="pointer-events-none hidden min-[900px]:block">
      <div className="fixed inset-y-0 left-3 z-10 flex w-6 flex-col items-center text-[11px] tracking-[0.18em] text-gold">
        <span className="h-16 w-px bg-gold/70" />
        <span className="my-3 [writing-mode:vertical-rl]">{label}</span>
        <span className="w-px flex-1 bg-gold/70" />
      </div>
      <div className="fixed inset-y-0 right-3 z-10 flex w-6 flex-col items-center text-[11px] tracking-[0.18em] text-gold">
        <span className="h-16 w-px bg-gold/70" />
        <span className="my-3 [writing-mode:vertical-rl]">{label}</span>
        <span className="w-px flex-1 bg-gold/70" />
      </div>
    </div>
  );
}
