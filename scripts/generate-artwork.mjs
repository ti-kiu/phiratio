import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";

const root = path.resolve(import.meta.dirname, "..");

function create(width, height) {
  const png = new PNG({ width, height, colorType: 6 });
  return png;
}

function blend(png, x, y, r, g, b, a) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= png.width || y >= png.height || a <= 0) return;
  const i = (png.width * y + x) << 2;
  const sa = a / 255;
  const da = png.data[i + 3] / 255;
  const out = sa + da * (1 - sa);
  if (out <= 0) return;
  png.data[i] = Math.round((r * sa + png.data[i] * da * (1 - sa)) / out);
  png.data[i + 1] = Math.round((g * sa + png.data[i + 1] * da * (1 - sa)) / out);
  png.data[i + 2] = Math.round((b * sa + png.data[i + 2] * da * (1 - sa)) / out);
  png.data[i + 3] = Math.round(out * 255);
}

function stroke(png, x0, y0, x1, y1, color, width) {
  const [r, g, b, a] = color;
  const length = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(1, Math.ceil(length * 2));
  const radius = width / 2;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        if (ox * ox + oy * oy <= radius * radius + 0.2) blend(png, x + ox, y + oy, r, g, b, a);
      }
    }
  }
}

function poly(png, points, color, width, close = false) {
  for (let i = 0; i < points.length - 1; i += 1) {
    stroke(png, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], color, width);
  }
  if (close && points.length > 2) {
    const last = points[points.length - 1];
    stroke(png, last[0], last[1], points[0][0], points[0][1], color, width);
  }
}

function ellipse(png, cx, cy, rx, ry, color, width) {
  const steps = Math.max(48, Math.ceil(Math.max(rx, ry) * 2));
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    points.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  poly(png, points, color, width);
}

function fillEllipse(png, cx, cy, rx, ry, color) {
  const [r, g, b, a] = color;
  const x0 = Math.max(0, Math.floor(cx - rx));
  const x1 = Math.min(png.width - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry));
  const y1 = Math.min(png.height - 1, Math.ceil(cy + ry));
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1) blend(png, x, y, r, g, b, a);
    }
  }
}

function rect(png, x, y, w, h, color, strokeWidth) {
  poly(
    png,
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    color,
    strokeWidth,
    true,
  );
}

const ink = [207, 207, 207, 235];
const faceFill = [232, 220, 200, 255];
const faceLine = [120, 108, 92, 255];
const guide = [168, 148, 112, 180];

function frontTemplate() {
  const png = create(900, 1200);
  const x = 120;
  const y = 80;
  const w = 660;
  const h = 1040;
  rect(png, x, y, w, h, ink, 2);
  const phi = (Math.sqrt(5) - 1) / 2;
  const inner = w * (1 - phi);
  rect(png, x + (w - inner) / 2, y + 70, inner, h - 140, ink, 2);
  for (const t of [0.22, 0.4, 0.62, 0.8]) {
    stroke(png, x, y + h * t, x + w, y + h * t, ink, 2);
  }
  stroke(png, x + w / 2, y, x + w / 2, y + h, ink, 2);
  return png;
}

function sideTemplate() {
  const png = create(900, 1200);
  const x = 150;
  const y = 80;
  const w = 600;
  const h = 1040;
  rect(png, x, y, w, h, ink, 2);
  stroke(png, x + w * 0.72, y, x + w * 0.72, y + h, ink, 2);
  stroke(png, x + w * 0.38, y + h * 0.18, x + w * 0.38, y + h * 0.86, ink, 2);
  for (const t of [0.18, 0.36, 0.5, 0.66, 0.84]) {
    stroke(png, x, y + h * t, x + w, y + h * t, ink, 2);
  }
  return png;
}

function thirdsTemplate() {
  const png = create(900, 1200);
  const x = 110;
  const y = 90;
  const w = 680;
  const h = 1020;
  rect(png, x, y, w, h, ink, 2);
  for (const step of [1, 2, 3, 4]) {
    stroke(png, x + (w * step) / 5, y, x + (w * step) / 5, y + h, ink, 2);
  }
  for (const step of [1, 2]) {
    stroke(png, x, y + (h * step) / 3, x + w, y + (h * step) / 3, ink, 2);
  }
  return png;
}

function sampleFace() {
  const width = 1000;
  const height = 1100;
  const png = create(width, height);
  const faceWidth = 440;
  const faceLength = 1.351 * faceWidth;
  const upperRatio = 1.048;
  const upper = (upperRatio / (1 + upperRatio)) * faceLength;
  const lower = faceLength - upper;
  const chinRatio = 1.85;
  const noseToMouth = lower / (1 + chinRatio);
  const top = 180;
  const cx = 500;
  const forehead = { x: cx, y: top };
  const menton = { x: cx, y: top + faceLength };
  const subnasale = { x: cx, y: top + upper };
  const stomion = { x: cx, y: subnasale.y + noseToMouth };
  const zyY = (forehead.y + menton.y) / 2;
  const zygionL = { x: cx - faceWidth / 2, y: zyY };
  const zygionR = { x: cx + faceWidth / 2, y: zyY };
  const eyeY = 390;
  const eyeLOuter = { x: 340, y: eyeY };
  const eyeLInner = { x: 450, y: eyeY };
  const eyeRInner = { x: 550, y: eyeY };
  const eyeROuter = { x: 660, y: eyeY };
  const noseHalf = (138.6 / 1.54) / 2;
  const alarL = { x: cx - noseHalf, y: subnasale.y - 16 };
  const alarR = { x: cx + noseHalf, y: subnasale.y - 16 };
  const mouthHalf = 138.6 / 2;
  const mouthL = { x: cx - mouthHalf, y: stomion.y + 8 };
  const mouthR = { x: cx + mouthHalf, y: stomion.y + 8 };
  const browL = { x: 390, y: eyeY - 62 };
  const browR = { x: 620, y: eyeY - 54 };
  const trichion = { x: cx, y: 96 };

  const rx = faceWidth / 2;
  const ry = faceLength / 2;
  const cy = (forehead.y + menton.y) / 2;
  fillEllipse(png, cx, cy, rx, ry, faceFill);
  fillEllipse(png, cx, menton.y + 48, 120, 56, faceFill);
  ellipse(png, cx, cy, rx, ry, faceLine, 3);
  ellipse(png, cx, menton.y + 48, 120, 56, faceLine, 3);

  stroke(png, cx, forehead.y, cx, menton.y, guide, 2);
  stroke(png, zygionL.x, eyeY, zygionR.x, eyeY, guide, 2);
  stroke(png, zygionL.x, subnasale.y, zygionR.x, subnasale.y, guide, 2);
  stroke(png, mouthL.x - 20, stomion.y, mouthR.x + 20, stomion.y, guide, 2);
  stroke(png, zygionL.x, menton.y, zygionR.x, menton.y, guide, 2);

  const brow = (peak, dir) => [
    [peak.x - 70 * dir, peak.y + 18],
    [peak.x - 30 * dir, peak.y + 4],
    [peak.x, peak.y],
    [peak.x + 36 * dir, peak.y + 10],
  ];
  poly(png, brow(browL, 1), faceLine, 3);
  poly(png, brow(browR, -1), faceLine, 3);

  ellipse(png, (eyeLOuter.x + eyeLInner.x) / 2, eyeY, 58, 24, faceLine, 3);
  ellipse(png, (eyeROuter.x + eyeRInner.x) / 2, eyeY, 58, 24, faceLine, 3);
  ellipse(png, (eyeLOuter.x + eyeLInner.x) / 2, eyeY, 16, 16, faceLine, 2);
  ellipse(png, (eyeROuter.x + eyeRInner.x) / 2, eyeY, 16, 16, faceLine, 2);

  poly(
    png,
    [
      [cx, eyeY + 28],
      [alarL.x, alarL.y],
      [cx, subnasale.y],
      [alarR.x, alarR.y],
      [cx, eyeY + 28],
    ],
    faceLine,
    3,
  );

  ellipse(png, cx, stomion.y + 6, mouthHalf, 18, faceLine, 3);
  stroke(png, mouthL.x, stomion.y, mouthR.x, stomion.y, faceLine, 2);

  const landmarks = {
    "visible-forehead": forehead,
    hairline: trichion,
    "brow-peak-photo-left": browL,
    "brow-peak-photo-right": browR,
    "exocanthion-photo-left": eyeLOuter,
    "endocanthion-photo-left": eyeLInner,
    "endocanthion-photo-right": eyeRInner,
    "exocanthion-photo-right": eyeROuter,
    "zygion-photo-left": zygionL,
    "zygion-photo-right": zygionR,
    "alare-photo-left": alarL,
    "alare-photo-right": alarR,
    subnasale,
    "cheilion-photo-left": mouthL,
    "cheilion-photo-right": mouthR,
    stomion,
    menton,
  };

  return {
    png,
    meta: {
      src: "/sample/sample-face.png",
      width,
      height,
      landmarks,
    },
  };
}

async function writePng(file, png) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, PNG.sync.write(png));
}

const sample = sampleFace();
await writePng(path.join(root, "public/templates/template-front-transparent.png"), frontTemplate());
await writePng(path.join(root, "public/templates/template-side-transparent.png"), sideTemplate());
await writePng(path.join(root, "public/templates/template-thirds-transparent.png"), thirdsTemplate());
await writePng(path.join(root, "public/sample/sample-face.png"), sample.png);
await writeFile(
  path.join(root, "data/sample-face.json"),
  `${JSON.stringify(sample.meta, null, 2)}\n`,
);
console.log("artwork written", sample.meta.landmarks.menton);
