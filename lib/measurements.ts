import rawCatalog from "../data/measurements.v1.json";

export type ReferenceEntry = {
  value: number;
  label: string;
  derivedFrom?: string;
  display?: string;
  alsoDescribedAs?: string;
  exact?: string;
};

export type CatalogRow = {
  id: string;
  number: number;
  name: string;
  group: string;
  windowDependent: boolean;
  numerator: string;
  denominator: string;
  laterality?: string;
  requiresRollCorrection?: boolean;
  numeratorNote?: string;
  references: Record<string, ReferenceEntry>;
  classicThirdsComparison?: number;
  emptyState?: { when: string; copy: string; doNotInventANumber?: boolean };
  interpretationWhenAboveReference?: { copy: string; doNotCallItADeviation?: boolean };
};

export type CatalogWindow = {
  id: string;
  name: string;
  uiLabel: string;
  default: boolean;
  topLandmark: string;
  bottomLandmark: string;
  lengthOverWidthReference: number;
  derivedFrom: string;
};

export type Catalog = {
  version: string;
  status: string;
  note: string;
  wording: {
    footnote: string;
    notAStandardShort: string;
    differenceRule: string;
    differenceDecimals: number;
    intervalBar: string;
    noNormalRangeBand: boolean;
  };
  constants: {
    phi: { id: string; symbol: string; value: number; description: string };
    vfo: { id: string; name: string; value: number; unit: string; definition: string; caveat: string };
  };
  formulas: {
    visibleLengthOverWidthReference: string;
    visibleUpperOverLowerReference: string;
    computed: {
      visibleLengthOverWidthReference: number;
      visibleUpperOverLowerReference: number;
    };
  };
  windows: CatalogWindow[];
  groups: { id: string; name: string }[];
  rows: CatalogRow[];
  overlay: { id: string; number: number; name: string; isRatioRow: boolean; description: string };
};

const catalog = rawCatalog as unknown as Catalog;

export const measurements = catalog;

export type WindowId = CatalogWindow["id"];

export const PHI = catalog.constants.phi.value;

export const VFO = catalog.constants.vfo.value;

export const DESIGN_REFERENCE_SENTENCE = catalog.wording.footnote;

export const RATIO_COUNT = catalog.rows.length;

export const DEFAULT_WINDOW_ID: WindowId =
  catalog.windows.find((window) => window.default)?.id ?? catalog.windows[0].id;

/**
 * Visible upper-face / lower-face reference, as stored in the locked catalog:
 * (1 - vfo) / (phi - 1).
 */
export const VISIBLE_UPPER_OVER_LOWER_FORMULA = catalog.formulas.visibleUpperOverLowerReference;

export const VISIBLE_LENGTH_OVER_WIDTH_FORMULA = catalog.formulas.visibleLengthOverWidthReference;

export function formatReference(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  const trimmed = rounded.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  if (!trimmed.includes(".")) return `${trimmed}.00`;
  const places = trimmed.split(".")[1]?.length ?? 0;
  return places < 2 ? rounded.toFixed(2) : trimmed;
}

export function formatCatalogReference(entry: ReferenceEntry): string {
  return entry.display ?? formatReference(entry.value);
}

export function formatValue(value: number): string {
  return value.toFixed(catalog.wording.differenceDecimals);
}

export function formatSigned(value: number): string {
  const abs = Math.abs(value).toFixed(catalog.wording.differenceDecimals);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return Number(0).toFixed(catalog.wording.differenceDecimals);
}

export function windowById(id: WindowId): CatalogWindow {
  const found = catalog.windows.find((window) => window.id === id);
  if (!found) throw new Error(`Unknown window ${id}`);
  return found;
}

export function rowById(id: string): CatalogRow | undefined {
  return catalog.rows.find((row) => row.id === id);
}

export function referenceFor(row: CatalogRow, windowId: WindowId): ReferenceEntry {
  if (row.references.independent) return row.references.independent;
  const entry = row.references[windowId];
  if (!entry) throw new Error(`Missing reference for ${row.id} / ${windowId}`);
  return entry;
}

export function windowAboutLabel(windowId: WindowId): string {
  return windowById(windowId).uiLabel;
}

export function groupsWithRows() {
  return catalog.groups.map((group) => ({
    ...group,
    rows: catalog.rows.filter((row) => row.group === group.id),
  }));
}

export function windowTableRows() {
  return catalog.windows.map((window) => ({
    id: window.id,
    label: window.name,
    about: window.uiLabel,
    cells: catalog.rows
      .filter((row) => row.windowDependent)
      .map((row) => {
        const entry = referenceFor(row, window.id);
        return {
          ratioId: row.id,
          name: row.name,
          reference: formatCatalogReference(entry),
          label: entry.label,
          derived: entry.label.toLowerCase().includes("derived"),
          alsoDescribedAs: entry.alsoDescribedAs ?? null,
        };
      }),
  }));
}

export function mouthEmptyCopy(): string {
  return rowById("chin-length-over-nose-to-mouth")?.emptyState?.copy ?? "";
}
