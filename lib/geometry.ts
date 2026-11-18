import { LM } from "./landmarks";
import {
  mouthEmptyCopy,
  measurements,
  referenceFor,
  windowById,
  type CatalogRow,
  type WindowId,
} from "./measurements";

export type Point = { x: number; y: number };

export type LandmarkMap = Partial<Record<string, Point>>;

export type MeasurementStatus = "value" | "empty";

export type MeasurementRow = {
  id: string;
  name: string;
  group: string;
  badge: string;
  number: number;
  status: MeasurementStatus;
  emptyText: string | null;
  value: number | null;
  reference: number | null;
  difference: number | null;
  interpretation: string | null;
  alsoDescribedAs: string | null;
  barHalfSpan: number;
};

export type RollFrame = {
  ready: boolean;
  origin: Point;
  roll: number;
  corrected: LandmarkMap;
};

const INCOMPLETE = "Place the remaining points to measure this.";
const BAR_HALF_SPAN = 0.4;

function hypot(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

export function rollFrame(landmarks: LandmarkMap): RollFrame {
  const left = landmarks[LM.endocanthionLeft];
  const right = landmarks[LM.endocanthionRight];
  if (!left || !right) {
    return { ready: false, origin: { x: 0, y: 0 }, roll: 0, corrected: { ...landmarks } };
  }
  const roll = Math.atan2(right.y - left.y, right.x - left.x);
  const origin = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
  const corrected: LandmarkMap = {};
  for (const [id, point] of Object.entries(landmarks)) {
    if (!point) continue;
    corrected[id] = rotatePoint(point, origin, -roll);
  }
  return { ready: true, origin, roll, corrected };
}

function at(landmarks: LandmarkMap, frame: RollFrame, id: string, corrected: boolean): Point | null {
  const source = corrected && frame.ready ? frame.corrected : landmarks;
  return source[id] ?? null;
}

function span(a: Point | null, b: Point | null): number | null {
  if (!a || !b) return null;
  const length = hypot(a, b);
  return length > 0 ? length : null;
}

function vertical(a: Point | null, b: Point | null): number | null {
  if (!a || !b) return null;
  const length = Math.abs(b.y - a.y);
  return length > 0 ? length : null;
}

function meanEye(landmarks: LandmarkMap): number | null {
  const left = span(landmarks[LM.exocanthionLeft] ?? null, landmarks[LM.endocanthionLeft] ?? null);
  const right = span(landmarks[LM.exocanthionRight] ?? null, landmarks[LM.endocanthionRight] ?? null);
  if (left === null || right === null) return null;
  return (left + right) / 2;
}

function faceWidth(landmarks: LandmarkMap): number | null {
  return span(landmarks[LM.zygionLeft] ?? null, landmarks[LM.zygionRight] ?? null);
}

function needs(landmarks: LandmarkMap, ids: string[]): boolean {
  return ids.every((id) => Boolean(landmarks[id]));
}

function valueFor(row: CatalogRow, landmarks: LandmarkMap, frame: RollFrame, windowId: WindowId): number | null {
  const useCorrected = frame.ready;
  const topId = windowById(windowId).topLandmark;
  const top = at(landmarks, frame, topId, useCorrected);
  const menton = at(landmarks, frame, LM.menton, useCorrected);
  const subnasale = at(landmarks, frame, LM.subnasale, useCorrected);
  const stomion = at(landmarks, frame, LM.stomion, useCorrected);
  const browLeft = at(landmarks, frame, LM.browLeft, true);
  const browRight = at(landmarks, frame, LM.browRight, true);
  const eyeY = frame.ready
    ? ((frame.corrected[LM.endocanthionLeft]?.y ?? 0) + (frame.corrected[LM.endocanthionRight]?.y ?? 0)) / 2
    : null;

  switch (row.id) {
    case "face-length-over-width": {
      const width = faceWidth(landmarks);
      const length = vertical(top, menton);
      if (length === null || width === null) return null;
      return length / width;
    }
    case "upper-face-over-lower-face": {
      const upper = vertical(top, subnasale);
      const lower = vertical(subnasale, menton);
      if (upper === null || lower === null) return null;
      return upper / lower;
    }
    case "mouth-width-over-nose-width": {
      const mouth = span(landmarks[LM.cheilionLeft] ?? null, landmarks[LM.cheilionRight] ?? null);
      const nose = span(landmarks[LM.alareLeft] ?? null, landmarks[LM.alareRight] ?? null);
      if (mouth === null || nose === null) return null;
      return mouth / nose;
    }
    case "inter-eye-distance-over-eye-width": {
      const gap = span(landmarks[LM.endocanthionLeft] ?? null, landmarks[LM.endocanthionRight] ?? null);
      const eye = meanEye(landmarks);
      if (gap === null || eye === null) return null;
      return gap / eye;
    }
    case "chin-length-over-nose-to-mouth": {
      const chin = vertical(stomion, menton);
      const noseToMouth = vertical(subnasale, stomion);
      if (chin === null || noseToMouth === null) return null;
      return chin / noseToMouth;
    }
    case "mid-face-over-lower-face": {
      if (!frame.ready || !browLeft || !browRight || !subnasale || !menton) return null;
      const browLine = { x: (browLeft.x + browRight.x) / 2, y: (browLeft.y + browRight.y) / 2 };
      const mid = vertical(browLine, subnasale);
      const lower = vertical(subnasale, menton);
      if (mid === null || lower === null) return null;
      return mid / lower;
    }
    case "face-width-over-five-eye-width": {
      const width = faceWidth(landmarks);
      const eye = meanEye(landmarks);
      if (width === null || eye === null) return null;
      return width / (5 * eye);
    }
    case "outer-eye-width-over-face-width": {
      const outer = span(landmarks[LM.exocanthionLeft] ?? null, landmarks[LM.exocanthionRight] ?? null);
      const width = faceWidth(landmarks);
      if (outer === null || width === null) return null;
      return outer / width;
    }
    case "photo-left-over-photo-right-eye-width": {
      const left = span(landmarks[LM.exocanthionLeft] ?? null, landmarks[LM.endocanthionLeft] ?? null);
      const right = span(landmarks[LM.exocanthionRight] ?? null, landmarks[LM.endocanthionRight] ?? null);
      if (left === null || right === null) return null;
      return left / right;
    }
    case "photo-left-over-photo-right-brow-height": {
      if (eyeY === null || !browLeft || !browRight) return null;
      const left = Math.abs(eyeY - browLeft.y);
      const right = Math.abs(eyeY - browRight.y);
      if (left <= 0 || right <= 0) return null;
      return left / right;
    }
    case "photo-left-over-photo-right-mouth-corner-height": {
      const leftCorner = at(landmarks, frame, LM.cheilionLeft, true);
      const rightCorner = at(landmarks, frame, LM.cheilionRight, true);
      if (eyeY === null || !leftCorner || !rightCorner) return null;
      const left = Math.abs(leftCorner.y - eyeY);
      const right = Math.abs(rightCorner.y - eyeY);
      if (left <= 0 || right <= 0) return null;
      return left / right;
    }
    default:
      return null;
  }
}

function ready(row: CatalogRow, landmarks: LandmarkMap, frame: RollFrame, windowId: WindowId): boolean {
  const common: Record<string, string[]> = {
    "face-length-over-width": [windowById(windowId).topLandmark, LM.menton, LM.zygionLeft, LM.zygionRight],
    "upper-face-over-lower-face": [windowById(windowId).topLandmark, LM.subnasale, LM.menton],
    "mouth-width-over-nose-width": [LM.cheilionLeft, LM.cheilionRight, LM.alareLeft, LM.alareRight],
    "inter-eye-distance-over-eye-width": [
      LM.endocanthionLeft,
      LM.endocanthionRight,
      LM.exocanthionLeft,
      LM.exocanthionRight,
    ],
    "chin-length-over-nose-to-mouth": [LM.stomion, LM.menton, LM.subnasale],
    "mid-face-over-lower-face": [LM.browLeft, LM.browRight, LM.subnasale, LM.menton, LM.endocanthionLeft, LM.endocanthionRight],
    "face-width-over-five-eye-width": [
      LM.zygionLeft,
      LM.zygionRight,
      LM.exocanthionLeft,
      LM.endocanthionLeft,
      LM.exocanthionRight,
      LM.endocanthionRight,
    ],
    "outer-eye-width-over-face-width": [LM.exocanthionLeft, LM.exocanthionRight, LM.zygionLeft, LM.zygionRight],
    "photo-left-over-photo-right-eye-width": [
      LM.exocanthionLeft,
      LM.endocanthionLeft,
      LM.exocanthionRight,
      LM.endocanthionRight,
    ],
    "photo-left-over-photo-right-brow-height": [LM.browLeft, LM.browRight, LM.endocanthionLeft, LM.endocanthionRight],
    "photo-left-over-photo-right-mouth-corner-height": [
      LM.cheilionLeft,
      LM.cheilionRight,
      LM.endocanthionLeft,
      LM.endocanthionRight,
    ],
  };
  if (row.requiresRollCorrection && !frame.ready) return false;
  return needs(landmarks, common[row.id] ?? []);
}

function blank(row: CatalogRow, windowId: WindowId, text: string): MeasurementRow {
  const entry = row.references.independent ?? row.references[windowId];
  return {
    id: row.id,
    name: row.name,
    group: row.group,
    badge: entry?.label ?? "",
    number: row.number,
    status: "empty",
    emptyText: text,
    value: null,
    reference: entry?.value ?? null,
    difference: null,
    interpretation: null,
    alsoDescribedAs: entry?.alsoDescribedAs ?? null,
    barHalfSpan: BAR_HALF_SPAN,
  };
}

export function measureAll(landmarks: LandmarkMap, windowId: WindowId, mouthOpen: boolean): MeasurementRow[] {
  const frame = rollFrame(landmarks);
  return measurements.rows.map((row) => {
    if (row.id === "chin-length-over-nose-to-mouth" && (mouthOpen || !landmarks[LM.stomion])) {
      return blank(row, windowId, mouthEmptyCopy());
    }
    if (!ready(row, landmarks, frame, windowId)) {
      return blank(row, windowId, INCOMPLETE);
    }
    const value = valueFor(row, landmarks, frame, windowId);
    if (value === null || !Number.isFinite(value)) {
      return blank(row, windowId, row.emptyState?.copy ?? INCOMPLETE);
    }
    const entry = referenceFor(row, windowId);
    const difference = value - entry.value;
    const interpretation =
      row.interpretationWhenAboveReference && value > entry.value ? row.interpretationWhenAboveReference.copy : null;
    return {
      id: row.id,
      name: row.name,
      group: row.group,
      badge: entry.label,
      number: row.number,
      status: "value",
      emptyText: null,
      value,
      reference: entry.value,
      difference,
      interpretation,
      alsoDescribedAs: entry.alsoDescribedAs ?? null,
      barHalfSpan: BAR_HALF_SPAN,
    };
  });
}

export type GridLine = { x1: number; y1: number; x2: number; y2: number };

export function referenceGrid(landmarks: LandmarkMap, windowId: WindowId): GridLine[] {
  const frame = rollFrame(landmarks);
  const source = frame.ready ? frame.corrected : landmarks;
  const window = windowById(windowId);
  const top = source[window.topLandmark];
  const chin = source[LM.menton];
  const left = source[LM.zygionLeft];
  const right = source[LM.zygionRight];
  if (!top || !chin || !left || !right) return [];
  const y0 = Math.min(top.y, chin.y);
  const y1 = Math.max(top.y, chin.y);
  const x0 = Math.min(left.x, right.x);
  const x1 = Math.max(left.x, right.x);
  const lines: GridLine[] = [];
  for (const step of [1, 2]) {
    const y = y0 + ((y1 - y0) * step) / 3;
    lines.push({ x1: x0, y1: y, x2: x1, y2: y });
  }
  for (const step of [1, 2, 3, 4]) {
    const x = x0 + ((x1 - x0) * step) / 5;
    lines.push({ x1: x, y1: y0, x2: x, y2: y1 });
  }
  if (!frame.ready) return lines;
  return lines.map((line) => {
    const a = rotatePoint({ x: line.x1, y: line.y1 }, frame.origin, frame.roll);
    const b = rotatePoint({ x: line.x2, y: line.y2 }, frame.origin, frame.roll);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });
}

export function barPositions(value: number, reference: number, halfSpan: number) {
  const min = reference * (1 - halfSpan);
  const max = reference * (1 + halfSpan);
  const span = max - min || 1;
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return {
    reference: clamp((reference - min) / span),
    measured: clamp((value - min) / span),
  };
}
