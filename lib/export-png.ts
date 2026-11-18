import { referenceGrid, type LandmarkMap } from "./geometry";
import type { WindowId } from "./measurements";

export type ExportOverlay = {
  landmarks: LandmarkMap;
  windowId: WindowId;
  showGrid: boolean;
  watermark: boolean;
  maxEdge: number | null;
};

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = url;
  });
}

export async function renderMeasurementPng(url: string, overlay: ExportOverlay): Promise<Blob> {
  const image = await loadImage(url);
  const scale = overlay.maxEdge
    ? Math.min(1, overlay.maxEdge / Math.max(image.naturalWidth, image.naturalHeight))
    : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("canvas");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const sx = width / image.naturalWidth;
  const sy = height / image.naturalHeight;

  if (overlay.showGrid) {
    context.save();
    context.strokeStyle = "rgba(116, 88, 18, 0.85)";
    context.lineWidth = Math.max(1, width / 600);
    for (const line of referenceGrid(overlay.landmarks, overlay.windowId)) {
      context.beginPath();
      context.moveTo(line.x1 * sx, line.y1 * sy);
      context.lineTo(line.x2 * sx, line.y2 * sy);
      context.stroke();
    }
    context.restore();
  }

  for (const point of Object.values(overlay.landmarks)) {
    if (!point) continue;
    context.beginPath();
    context.fillStyle = "#FFFDF8";
    context.strokeStyle = "#241F18";
    context.lineWidth = Math.max(1, width / 500);
    context.arc(point.x * sx, point.y * sy, Math.max(4, width / 180), 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  if (overlay.watermark) {
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(-0.45);
    context.globalAlpha = 0.28;
    context.fillStyle = "#745812";
    context.font = `600 ${Math.round(width / 14)}px sans-serif`;
    context.textAlign = "center";
    for (let y = -height; y <= height; y += height / 4) {
      context.fillText("PhiRatio", 0, y);
    }
    context.restore();
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("png");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
