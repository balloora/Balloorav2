// Browser-only: converts any image the admin picks (PNG, JPEG, HEIC, WebP, …)
// into a web-friendly WebP, downscaled so uploads stay well under the
// Server Action body limit and every browser can display the result.

const MAX_DIMENSION = 2400;
const QUALITY = 0.85;

// Formats we upload untouched (vector / animated — rasterising would break them).
const PASSTHROUGH_TYPES = new Set(["image/svg+xml", "image/gif"]);

function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    // Safari decodes HEIC natively; everything else handles the common formats.
    return await createImageBitmap(file);
  } catch (err) {
    if (!isHeic(file)) throw err;
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.95 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    if (!blob) throw err;
    return createImageBitmap(blob);
  }
}

export async function normalizeImage(file: File): Promise<File> {
  if (PASSTHROUGH_TYPES.has(file.type)) return file;

  const bitmap = await decode(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));

  // Browsers that can't encode WebP silently return PNG; use JPEG there instead.
  let blob = await encode("image/webp");
  if (blob && blob.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) throw new Error(`Could not convert ${file.name}`);

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const name = file.name.replace(/\.[^.]+$/, "") + "." + ext;
  return new File([blob], name, { type: blob.type });
}
