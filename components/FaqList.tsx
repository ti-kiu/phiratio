import { getFaqItems } from "@/lib/faq";
import { measurements, windowTableRows } from "@/lib/measurements";

export function FaqList() {
  const items = getFaqItems();
  const rows = windowTableRows();
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 min-[900px]:px-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-4xl text-ink">
        Questions
      </h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.id} className="group py-4" open>
            <summary className="cursor-pointer text-lg font-semibold text-ink">{item.question}</summary>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{item.answer}</p>
            {item.id === "references" ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <caption className="mb-2 text-left text-muted">
                    Window references. {measurements.wording.footnote}
                  </caption>
                  <thead>
                    <tr className="border-b border-line text-ink">
                      <th className="py-2 pr-4 font-semibold">Window</th>
                      {rows[0]?.cells.map((cell) => (
                        <th key={cell.ratioId} className="py-2 pr-4 font-semibold">
                          {cell.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-line">
                        <th className="py-2 pr-4 font-medium text-ink">{row.about}</th>
                        {row.cells.map((cell) => (
                          <td key={cell.ratioId} className="py-2 pr-4 tabular-nums text-ink">
                            {cell.reference}
                            {cell.derived ? <span className="mt-1 block text-xs text-muted">{cell.label}</span> : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}
