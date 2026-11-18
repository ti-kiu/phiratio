import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { MeasurementRow } from "./geometry";
import {
  DESIGN_REFERENCE_SENTENCE,
  formatCatalogReference,
  formatSigned,
  formatValue,
  measurements,
  mouthEmptyCopy,
  referenceFor,
  windowAboutLabel,
  type WindowId,
} from "./measurements";

export async function buildReportPdf(input: {
  windowId: WindowId;
  rows: MeasurementRow[];
  mouthOpen: boolean;
}): Promise<Blob> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([612, 792]);
  let y = 750;
  const margin = 48;
  const ink = rgb(0.14, 0.12, 0.09);

  const write = (text: string, size: number, face = font, gap = 16) => {
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (face.widthOfTextAtSize(next, size) > 516) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    for (const row of lines) {
      if (y < 64) {
        page = doc.addPage([612, 792]);
        y = 750;
      }
      page.drawText(row, { x: margin, y, size, font: face, color: ink });
      y -= gap;
    }
  };

  write("PhiRatio", 22, bold, 28);
  write("Measurement report", 14, bold, 20);
  write(`Measuring window: ${windowAboutLabel(input.windowId)}`, 11, font, 16);
  write(DESIGN_REFERENCE_SENTENCE, 11, font, 18);
  if (input.mouthOpen) {
    write(mouthEmptyCopy(), 11, font, 18);
  }

  for (const group of measurements.groups) {
    y -= 6;
    write(group.name, 13, bold, 18);
    for (const row of input.rows.filter((item) => item.group === group.id)) {
      if (row.status === "empty") {
        write(`${row.name}: ${row.emptyText ?? ""}`, 10, font, 14);
        continue;
      }
      const entry = measurements.rows.find((item) => item.id === row.id);
      const shown = entry ? formatCatalogReference(referenceFor(entry, input.windowId)) : formatValue(row.reference ?? 0);
      write(
        `${row.name}: value ${formatValue(row.value ?? 0)}, reference ${shown} (${row.badge}), difference ${formatSigned(row.difference ?? 0)}`,
        10,
        font,
        14,
      );
      if (row.interpretation) write(row.interpretation, 10, font, 14);
    }
  }

  y -= 8;
  write("Generated in this browser from landmarks placed on this device. The photo was not sent to a server.", 9, font, 12);
  write("No attractiveness score, rank, percentile, or overall verdict is part of this report.", 9, font, 12);

  const bytes = await doc.save();
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}
