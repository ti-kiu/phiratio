import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import sample from "../data/sample-face.json";
import { measureAll, referenceGrid, rotatePoint, rollFrame } from "../lib/geometry";
import { getFaqItems } from "../lib/faq";
import {
  DEFAULT_WINDOW_ID,
  PHI,
  RATIO_COUNT,
  VFO,
  VISIBLE_LENGTH_OVER_WIDTH_FORMULA,
  VISIBLE_UPPER_OVER_LOWER_FORMULA,
  measurements,
  mouthEmptyCopy,
  referenceFor,
  rowById,
} from "../lib/measurements";

const root = path.resolve(import.meta.dirname, "..");

describe("locked catalog", () => {
  it("exposes the locked eleven rows in three groups", () => {
    assert.equal(measurements.status, "locked");
    assert.equal(RATIO_COUNT, 11);
    assert.equal(measurements.overlay.isRatioRow, false);
    assert.deepEqual(
      measurements.groups.map((group) => group.name),
      ["Golden ratio", "Thirds and fifths", "Symmetry"],
    );
    assert.deepEqual(
      measurements.rows.map((row) => row.name),
      [
        "Face length / face width",
        "Upper face / lower face",
        "Mouth width / nose width",
        "Inter-eye distance / eye width",
        "Chin length / nose-to-mouth",
        "Mid-face height / lower-face height",
        "Face width / five-eye width",
        "Outer-eye width / face width",
        "Photo left / photo right eye width",
        "Photo left / photo right brow height",
        "Photo left / photo right mouth-corner height",
      ],
    );
    assert.equal(measurements.rows.some((row) => row.id === "nose-over-intercanthal"), false);
    assert.equal(measurements.rows.some((row) => row.name === "Chin length / lower face"), false);
    assert.equal(measurements.rows.some((row) => row.name === "Eye width / face fifth"), false);
  });

  it("keeps the locked constants and the visible-window formulas", () => {
    assert.equal(VFO, measurements.constants.vfo.value);
    assert.equal(PHI, measurements.constants.phi.value);
    assert.equal(VISIBLE_LENGTH_OVER_WIDTH_FORMULA, "phi - vfo");
    assert.equal(VISIBLE_UPPER_OVER_LOWER_FORMULA, "(1 - vfo) / (phi - 1)");
    const length = Math.round((PHI - VFO) * 1000) / 1000;
    const upper = Math.round(((1 - VFO) / (PHI - 1)) * 1000) / 1000;
    assert.equal(measurements.formulas.computed.visibleLengthOverWidthReference, length);
    assert.equal(measurements.formulas.computed.visibleUpperOverLowerReference, upper);
    assert.equal(mouthEmptyCopy(), "Can't measure this on the current photo.");
  });

  it("imports the JSON from one module", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".next" || entry === "data" || entry === "tests") continue;
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx|mjs|js)$/.test(entry)) continue;
        const text = readFileSync(full, "utf8");
        if (text.includes("measurements.v1.json")) hits.push(path.relative(root, full));
      }
    };
    walk(root);
    assert.deepEqual(hits, ["lib/measurements.ts"]);
  });
});

describe("sample face", () => {
  it("computes window and segment ratios from placed landmarks", () => {
    const rows = measureAll(sample.landmarks, DEFAULT_WINDOW_ID, false);
    const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
    assert.equal(rows.filter((row) => row.status === "value").length, 11);
    const face = byId["face-length-over-width"];
    const faceRow = rowById("face-length-over-width");
    assert.equal(face.status, "value");
    assert.ok(face.value !== null && Math.abs(face.value - 1.351) < 0.001);
    assert.equal(face.reference, faceRow ? referenceFor(faceRow, DEFAULT_WINDOW_ID).value : null);
    const upper = byId["upper-face-over-lower-face"];
    assert.ok(upper.value !== null && Math.abs(upper.value - 1.048) < 0.001);
    const mouth = byId["mouth-width-over-nose-width"];
    assert.ok(mouth.value !== null && Math.abs(mouth.value - 1.54) < 0.001);
    const marks = sample.landmarks as Record<string, { x: number; y: number }>;
    const distance = (a: string, b: string) => Math.hypot(marks[b].x - marks[a].x, marks[b].y - marks[a].y);
    const width = distance("zygion-photo-left", "zygion-photo-right");
    const meanEye =
      (distance("exocanthion-photo-left", "endocanthion-photo-left") +
        distance("exocanthion-photo-right", "endocanthion-photo-right")) /
      2;
    const five = byId["face-width-over-five-eye-width"];
    assert.ok(five.value !== null && Math.abs(five.value - width / (5 * meanEye)) < 1e-6);
    assert.ok(Math.abs(five.value - meanEye / (width / 5)) > 0.2);
    const outer = byId["outer-eye-width-over-face-width"];
    assert.ok(outer.value !== null && Math.abs(outer.value - distance("exocanthion-photo-left", "exocanthion-photo-right") / width) < 1e-6);
    const chin = byId["chin-length-over-nose-to-mouth"];
    assert.equal(chin.status, "value");
    assert.ok(chin.value !== null && chin.value > (chin.reference ?? 0));
    assert.match(chin.interpretation ?? "", /thirds-style split/);
    assert.match(chin.interpretation ?? "", /not a deviation/);
  });

  it("refuses a number when the mouth is open or stomion is missing", () => {
    const open = measureAll(sample.landmarks, DEFAULT_WINDOW_ID, true);
    const chin = open.find((row) => row.id === "chin-length-over-nose-to-mouth");
    assert.equal(chin?.status, "empty");
    assert.equal(chin?.value, null);
    assert.equal(chin?.emptyText, mouthEmptyCopy());
    const landmarks: Record<string, { x: number; y: number }> = { ...sample.landmarks };
    delete landmarks.stomion;
    const missing = measureAll(landmarks, DEFAULT_WINDOW_ID, false).find((row) => row.id === "chin-length-over-nose-to-mouth");
    assert.equal(missing?.emptyText, mouthEmptyCopy());
    assert.equal(missing?.value, null);
  });

  it("uses photo-left divided by photo-right after roll correction", () => {
    const landmarks = sample.landmarks;
    const frame = rollFrame(landmarks);
    assert.equal(frame.ready, true);
    const tilted = Object.fromEntries(
      Object.entries(landmarks).map(([id, point]) => [id, rotatePoint(point, frame.origin, 0.35)]),
    );
    const level = measureAll(landmarks, DEFAULT_WINDOW_ID, false).find((row) => row.id === "photo-left-over-photo-right-brow-height");
    const rolled = measureAll(tilted, DEFAULT_WINDOW_ID, false).find((row) => row.id === "photo-left-over-photo-right-brow-height");
    assert.equal(level?.status, "value");
    assert.equal(rolled?.status, "value");
    assert.ok(level?.value !== null && rolled?.value !== null);
    assert.ok(Math.abs((level?.value ?? 0) - (rolled?.value ?? 0)) < 0.01);
    const eyes = measureAll(landmarks, DEFAULT_WINDOW_ID, false).find((row) => row.id === "photo-left-over-photo-right-eye-width");
    assert.ok(eyes?.value !== null && Math.abs((eyes?.value ?? 0) - 1) < 0.001);
    const grid = referenceGrid(sample.landmarks, DEFAULT_WINDOW_ID);
    assert.equal(grid.length, 6);
  });
});

describe("copy guards", () => {
  it("keeps forbidden literals out of components and copy modules", () => {
    const forbidden = [/1\.38\b/, /1\.233\b/, /1\.618\b/, /0\.60\b/, /0\.238\b/];
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".next") continue;
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!/^app\/|^components\/|^lib\/faq\.ts$|^lib\/geometry\.ts$|^lib\/pricing\.ts$/.test(path.relative(root, full))) {
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry)) continue;
        files.push(full);
      }
    };
    walk(path.join(root, "app"));
    walk(path.join(root, "components"));
    const faq = path.join(root, "lib/faq.ts");
    files.push(faq);
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const pattern of forbidden) {
        assert.equal(pattern.test(text), false, `${path.relative(root, file)} contains ${pattern}`);
      }
    }
  });

  it("keeps signup, login, and account wording off pricing and FAQ 2-3", () => {
    const pricing = readFileSync(path.join(root, "components/pricing/PricingDesk.tsx"), "utf8");
    const pricingPage = readFileSync(path.join(root, "app/pricing/page.tsx"), "utf8");
    assert.doesNotMatch(`${pricing}\n${pricingPage}`, /sign[\s-]*up|log[\s-]*in|\baccount\b/i);
    assert.doesNotMatch(`${pricing}\n${pricingPage}`, /Stripe|according to|Marquardt/i);
    const items = getFaqItems();
    for (const item of [items[1], items[2]]) {
      const text = `${item.question} ${item.answer}`;
      assert.doesNotMatch(text, /sign[\s-]*up|log[\s-]*in|account/i);
    }
  });
});
