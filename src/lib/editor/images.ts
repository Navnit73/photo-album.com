export const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MIN_DIMENSION = 200;
export const MAX_DIMENSION = 12000;
const WORKING_MAX = 2400; // longest edge kept in the editor

export interface ProcessedImage { name: string; width: number; height: number; blob: Blob }

export class UploadError extends Error {}

/** Validate type, size and dimensions, then downscale to a working copy. */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".heic") || lower.endsWith(".heif") || file.type === "image/heic" || file.type === "image/heif") {
    throw new UploadError(`${file.name}: HEIC is not supported in the browser yet. Please export as JPG or PNG.`);
  }
  if (!ACCEPTED.includes(file.type)) throw new UploadError(`${file.name}: unsupported format. Use JPG, PNG or WebP.`);
  if (file.size > MAX_FILE_BYTES) throw new UploadError(`${file.name}: larger than ${MAX_FILE_BYTES / 1024 / 1024} MB.`);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new UploadError(`${file.name}: could not be read as an image.`);
  }
  const { width, height } = bitmap;
  if (Math.min(width, height) < MIN_DIMENSION) { bitmap.close(); throw new UploadError(`${file.name}: too small (minimum ${MIN_DIMENSION}px).`); }
  if (Math.max(width, height) > MAX_DIMENSION) { bitmap.close(); throw new UploadError(`${file.name}: too large (maximum ${MAX_DIMENSION}px).`); }

  const scale = Math.min(1, WORKING_MAX / Math.max(width, height));
  const w = Math.round(width * scale), h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const keepPng = file.type === "image/png";
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, keepPng ? "image/png" : "image/jpeg", 0.92));
  if (!blob) throw new UploadError(`${file.name}: could not be processed.`);
  return { name: file.name, width: w, height: h, blob };
}
