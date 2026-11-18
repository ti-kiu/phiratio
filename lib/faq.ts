import { price } from "./pricing";
import {
  DESIGN_REFERENCE_SENTENCE,
  VFO,
  VISIBLE_LENGTH_OVER_WIDTH_FORMULA,
  VISIBLE_UPPER_OVER_LOWER_FORMULA,
  formatCatalogReference,
  formatReference,
  measurements,
  mouthEmptyCopy,
  referenceFor,
  rowById,
  windowAboutLabel,
  type WindowId,
} from "./measurements";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

function windowReference(rowId: string, windowId: WindowId): string {
  const row = rowById(rowId);
  if (!row) return "";
  return formatCatalogReference(referenceFor(row, windowId));
}

export function getFaqItems(): FaqItem[] {
  const visible = measurements.windows[0]?.id ?? "";
  const hairline = measurements.windows[1]?.id ?? "";
  const visibleLength = windowReference("face-length-over-width", visible);
  const hairlineLength = windowReference("face-length-over-width", hairline);
  const visibleUpper = windowReference("upper-face-over-lower-face", visible);
  const hairlineUpper = windowReference("upper-face-over-lower-face", hairline);
  const chin = rowById("chin-length-over-nose-to-mouth");
  const chinReference = chin ? formatCatalogReference(referenceFor(chin, visible)) : "";
  const outer = rowById("outer-eye-width-over-face-width");
  const outerReference = outer ? formatCatalogReference(referenceFor(outer, visible)) : "";

  const windowAnswer = [
    `${windowAboutLabel(visible)}: face length / face width ${visibleLength}; upper face / lower face ${visibleUpper}.`,
    `${windowAboutLabel(hairline)}: face length / face width ${hairlineLength}; upper face / lower face ${hairlineUpper}.`,
    `Visible length / width follows ${VISIBLE_LENGTH_OVER_WIDTH_FORMULA}. Visible upper face / lower face follows ${VISIBLE_UPPER_OVER_LOWER_FORMULA}. Both use VFO ${formatReference(VFO)} and are derived design references.`,
    `Outer-eye width / face width uses ${outerReference}, a fifths guide.`,
    DESIGN_REFERENCE_SENTENCE,
  ].join(" ");

  return [
    {
      id: "measure",
      question: "What does PhiRatio measure?",
      answer:
        "PhiRatio measures facial proportions from landmarks you place on one front-facing photo. It lines each proportion up with a design reference and shows the numeric difference. It does not produce an attractiveness score, rank, percentile, or overall verdict.",
    },
    {
      id: "photo",
      question: "Where does my photo go?",
      answer:
        "Your photo stays in this browser. Placing landmarks, the ratios, the watermarked preview, the high-resolution PNG, and the PDF report all run on your device. The photo is not sent to a server. You can confirm that in your browser's Network panel.",
    },
    {
      id: "free",
      question: "What can I do without paying?",
      answer:
        "Every ratio, both measuring windows, the thirds-and-fifths grid, a watermarked PNG preview, and the free transparent PNG grids and SVG templates are free. The one-time unlock adds a high-resolution PNG without a watermark at your original photo resolution, and a PDF report generated in your browser. There is no subscription and no higher tier.",
    },
    {
      id: "references",
      question: "What do the reference numbers mean?",
      answer: `${DESIGN_REFERENCE_SENTENCE} A visible-forehead window and a hairline window do not cover the same vertical span, so the window rows use different references. ${windowAnswer}`,
    },
    {
      id: "empty",
      question: "Why does a row stay empty?",
      answer: `Chin length / nose-to-mouth needs a closed mouth and a stomion point. Its design reference is ${chinReference}. If the mouth is slightly open, the person is laughing, or stomion cannot be placed, the row stays empty and reads: ${mouthEmptyCopy()} Other rows stay empty until the points they need are placed.`,
    },
    {
      id: "age",
      question: "Who is this for?",
      answer:
        "This tool is for people 18 or older. The page says so, and the tool asks you to confirm that before a photo is measured.",
    },
    {
      id: "refund",
      question: "How do refunds work?",
      answer:
        `You can ask for a refund within ${price.refundDays} days, and you do not need to give a reason. Write to support@phiratio.app from the email used at checkout, or reply to your purchase receipt. We process refund requests within 3 business days. Refunds are issued to the original payment method by Creem. If we do not respond within 3 business days, Creem may issue a refund on our behalf.`,
    },
  ];
}
