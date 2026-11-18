import { barPositions, type MeasurementRow } from "@/lib/geometry";
import {
  DESIGN_REFERENCE_SENTENCE,
  formatCatalogReference,
  formatSigned,
  formatValue,
  groupsWithRows,
  measurements,
  referenceFor,
  rowById,
  windowAboutLabel,
  type WindowId,
} from "@/lib/measurements";

function IntervalBar({ value, reference, halfSpan }: { value: number; reference: number; halfSpan: number }) {
  const pos = barPositions(value, reference, halfSpan);
  return (
    <div className="relative mt-3 h-4" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#ddd6c8]" />
      <div className="absolute top-0 h-4 w-px bg-ink" style={{ left: `${pos.reference * 100}%` }} />
      <div
        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ left: `${pos.measured * 100}%` }}
      />
    </div>
  );
}

export function ResultsPanel({
  rows,
  windowId,
  onWindow,
  mouthOpen,
  onMouth,
}: {
  rows: MeasurementRow[];
  windowId: WindowId;
  onWindow: (id: WindowId) => void;
  mouthOpen: boolean;
  onMouth: (open: boolean) => void;
}) {
  const grouped = groupsWithRows();
  return (
    <div>
      <label className="text-xs font-semibold tracking-[0.14em] text-muted" htmlFor="measuring-window">
        MEASURING WINDOW
      </label>
      <select
        id="measuring-window"
        className="mt-2 h-12 w-full rounded-lg border border-[#c9c2b4] bg-white px-3 text-ink"
        value={windowId}
        onChange={(event) => onWindow(event.target.value as WindowId)}
      >
        {measurements.windows.map((window) => (
          <option key={window.id} value={window.id}>
            {windowAboutLabel(window.id)}
          </option>
        ))}
      </select>

      <h2 className="mt-6 text-xs font-semibold tracking-[0.14em] text-muted">MEASUREMENTS</h2>
      <p className="mt-2 text-sm leading-6 text-ink">{DESIGN_REFERENCE_SENTENCE}</p>
      <label className="mt-4 flex items-start gap-2 text-sm leading-6 text-ink">
        <input
          type="checkbox"
          className="mt-1"
          checked={mouthOpen}
          onChange={(event) => onMouth(event.target.checked)}
        />
        Mouth is slightly open, or the person is laughing
      </label>

      <div className="mt-4">
        {grouped.map((group) => (
          <section key={group.id} className="mt-5" aria-label={group.name}>
            <h3 className="font-sans text-sm font-semibold text-ink">{group.name}</h3>
            {group.rows.map((definition) => {
              const row = rows.find((item) => item.id === definition.id);
              if (!row) return null;
              const entry = rowById(row.id);
              const shown = entry ? formatCatalogReference(referenceFor(entry, windowId)) : formatValue(row.reference ?? 0);
              return (
                <article key={row.id} data-measurement={row.id} className="border-b border-line py-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-sans text-[15px] font-semibold leading-6 text-ink">{row.name}</h4>
                    <span className="shrink-0 text-right text-[11px] font-semibold tracking-wide text-muted">{row.badge}</span>
                  </div>
                  {row.status === "empty" ? (
                    <p className="mt-3 text-sm text-ink">{row.emptyText}</p>
                  ) : (
                    <>
                      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <dt className="text-muted">Value</dt>
                          <dd className="font-semibold tabular-nums text-ink">{formatValue(row.value ?? 0)}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Reference</dt>
                          <dd className="font-semibold tabular-nums text-ink">
                            {shown}
                            {row.alsoDescribedAs ? <span className="mt-1 block text-xs font-normal text-muted">{row.alsoDescribedAs}</span> : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted">Difference</dt>
                          <dd className="font-semibold tabular-nums text-ink">{formatSigned(row.difference ?? 0)}</dd>
                        </div>
                      </dl>
                      {row.value !== null && row.reference !== null ? (
                        <IntervalBar value={row.value} reference={row.reference} halfSpan={row.barHalfSpan} />
                      ) : null}
                      {row.interpretation ? <p className="mt-3 text-sm leading-6 text-ink">{row.interpretation}</p> : null}
                    </>
                  )}
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
