const MAX_BYTES = 30 * 1024 * 1024;

export class PhotoReadError extends Error {
  constructor(
    readonly code: "too-large" | "type" | "heic" | "decode",
    message: string,
  ) {
    super(message);
  }
}

export type DecodedPhoto = {
  blob: Blob;
  width: number;
  height: number;
  hadAlpha: boolean;
  decoder: "native" | "wasm";
};

function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
}

function isAllowed(file: File): boolean {
  if (isHeic(file)) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/jpeg" ||
    type === "image/jpg" ||
    type === "image/png" ||
    type === "image/webp" ||
    /\.(jpe?g|png|webp)$/.test(name)
  );
}

async function bitmapFromBlob(blob: Blob): Promise<ImageBitmap> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(blob);
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas");
    context.drawImage(image, 0, 0);
    return createImageBitmap(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function detectAlpha(bitmap: ImageBitmap): Promise<boolean> {
  const canvas = document.createElement("canvas");
  const sample = 48;
  canvas.width = sample;
  canvas.height = sample;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return true;
  context.drawImage(bitmap, 0, 0, sample, sample);
  const data = context.getImageData(0, 0, sample, sample).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) return true;
  }
  return false;
}

export async function readPhotoFile(file: File): Promise<DecodedPhoto> {
  if (file.size > MAX_BYTES) {
    throw new PhotoReadError("too-large", "That file is over 30MB. Use a JPG, PNG, WebP, or HEIC up to 30MB.");
  }
  if (!isAllowed(file)) {
    throw new PhotoReadError("type", "Use a JPG, PNG, WebP, or HEIC photo.");
  }

  let blob: Blob = file;
  let decoder: DecodedPhoto["decoder"] = "native";

  if (isHeic(file)) {
    let native: ImageBitmap | null = null;
    try {
      native = await bitmapFromBlob(file);
    } catch {
      native = null;
    }
    if (!native || native.width < 2 || native.height < 2) {
      native?.close();
      try {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({ blob: file, toType: "image/png" });
        blob = Array.isArray(converted) ? converted[0] : converted;
        decoder = "wasm";
      } catch {
        throw new PhotoReadError(
          "heic",
          "This browser could not decode that HEIC photo. Nothing was uploaded. Try JPG, PNG, or WebP.",
        );
      }
    } else {
      native.close();
    }
  }

  try {
    const bitmap = await bitmapFromBlob(blob);
    const hadAlpha = decoder === "wasm" || file.type === "image/png" || file.type === "image/webp" ? await detectAlpha(bitmap) : false;
    const width = bitmap.width;
    const height = bitmap.height;
    bitmap.close();
    if (width < 2 || height < 2) {
      throw new PhotoReadError("decode", "That image could not be read.");
    }
    return { blob, width, height, hadAlpha, decoder };
  } catch (error) {
    if (error instanceof PhotoReadError) throw error;
    throw new PhotoReadError("decode", "That image could not be read.");
  }
}
