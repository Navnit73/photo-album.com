import type { Album, Background, Format, ImageEl, Page, PhotoView, TextEl } from "./types";

export const uid = () => crypto.randomUUID();

export const formats: Format[] = [
  { id: "square-8", label: "Square 8 × 8 in (20 × 20 cm)", width: 800, height: 800, orientation: "square" },
  { id: "landscape-11x85", label: "Landscape 11 × 8.5 in (US Letter)", width: 1100, height: 850, orientation: "landscape" },
  { id: "portrait-85x11", label: "Portrait 8.5 × 11 in (US Letter)", width: 850, height: 1100, orientation: "portrait" },
  { id: "landscape-a4", label: "Landscape A4 (29.7 × 21 cm)", width: 1169, height: 827, orientation: "landscape" },
  { id: "portrait-a4", label: "Portrait A4 (21 × 29.7 cm)", width: 827, height: 1169, orientation: "portrait" },
];

export function customFormat(widthIn: number, heightIn: number): Format {
  return {
    id: "custom", label: `Custom ${widthIn} × ${heightIn} in`, width: Math.round(widthIn * 100), height: Math.round(heightIn * 100),
    orientation: "custom",
  };
}

export const fonts = ["Georgia", "Palatino", "Times New Roman", "Helvetica", "Arial", "Trebuchet MS", "Courier New"];

export const swatches = ["#ffffff", "#f8f6f3", "#eae6e1", "#e9dfd3", "#d9e0e3", "#dfe3da", "#292725", "#6f6258", "#b88c65"];

/* ---------- Layouts: frames as fractions of the page (x,y,w,h in 0..1) ---------- */
type Frame = [number, number, number, number];
export interface Layout { id: string; label: string; frames: Frame[] }
const M = 0.06; // outer margin
const G = 0.02; // gutter
const inner = 1 - 2 * M;
const col2 = (inner - G) / 2;
const col3 = (inner - 2 * G) / 3;

export const layouts: Layout[] = [
  { id: "full", label: "Full page", frames: [[0, 0, 1, 1]] },
  { id: "framed", label: "Framed", frames: [[M, M, inner, inner]] },
  { id: "two-side", label: "Two side by side", frames: [[M, M, col2, inner], [M + col2 + G, M, col2, inner]] },
  { id: "two-stack", label: "Two stacked", frames: [[M, M, inner, col2], [M, M + col2 + G, inner, col2]] },
  { id: "one-two", label: "One large, two small", frames: [[M, M, inner, inner * 0.6], [M, M + inner * 0.6 + G, col2, inner * 0.4 - G], [M + col2 + G, M + inner * 0.6 + G, col2, inner * 0.4 - G]] },
  { id: "grid-4", label: "Grid of four", frames: [[M, M, col2, col2], [M + col2 + G, M, col2, col2], [M, M + col2 + G, col2, col2], [M + col2 + G, M + col2 + G, col2, col2]] },
  { id: "strip-3", label: "Three columns", frames: [0, 1, 2].map((i) => [M + i * (col3 + G), M, col3, inner] as Frame) },
  { id: "grid-6", label: "Grid of six", frames: [0, 1, 2].flatMap((r) => [0, 1].map((c) => [M + c * (col2 + G), M + r * (col3 + G), col2, col3] as Frame)) },
];
export const layoutById = Object.fromEntries(layouts.map((l) => [l.id, l])) as Record<string, Layout>;

/* ---------- Templates ---------- */
export interface Template {
  id: string; name: string; category: string; premium: boolean;
  background: Background;
  coverLayout: string;
  pageLayouts: string[]; // cycled through for interior pages
  titleColor: string; titleFont: string;
  pageCount: number;
}
export const templates: Template[] = [
  { id: "classic-ivory", name: "Classic Ivory", category: "Wedding", premium: false, background: { color: "#fbf8f3", pattern: "none" }, coverLayout: "framed", pageLayouts: ["framed", "two-side", "one-two", "full"], titleColor: "#292725", titleFont: "Georgia", pageCount: 24 },
  { id: "golden-hour", name: "Golden Hour", category: "Travel", premium: false, background: { color: "#ffffff", pattern: "none" }, coverLayout: "full", pageLayouts: ["full", "one-two", "two-stack", "grid-4"], titleColor: "#ffffff", titleFont: "Georgia", pageCount: 20 },
  { id: "first-year", name: "First Year", category: "Baby", premium: false, background: { color: "#f8f6f3", pattern: "dots" }, coverLayout: "framed", pageLayouts: ["grid-4", "framed", "strip-3", "one-two"], titleColor: "#6f6258", titleFont: "Palatino", pageCount: 30 },
  { id: "family-table", name: "Sunday Table", category: "Family", premium: false, background: { color: "#ffffff", pattern: "none" }, coverLayout: "framed", pageLayouts: ["one-two", "grid-6", "two-side", "grid-4"], titleColor: "#292725", titleFont: "Georgia", pageCount: 20 },
  { id: "quiet-minimal", name: "Quiet Minimal", category: "Minimalist", premium: false, background: { color: "#ffffff", pattern: "none" }, coverLayout: "framed", pageLayouts: ["framed", "two-side", "framed", "two-stack"], titleColor: "#292725", titleFont: "Helvetica", pageCount: 16 },
  { id: "blank", name: "Blank album", category: "Any", premium: false, background: { color: "#ffffff", pattern: "none" }, coverLayout: "framed", pageLayouts: ["framed"], titleColor: "#292725", titleFont: "Georgia", pageCount: 10 },
];
export const templateById = Object.fromEntries(templates.map((t) => [t.id, t])) as Record<string, Template>;

/* ---------- Builders ---------- */
export function imageElement(photo: Pick<PhotoView, "id">, x: number, y: number, w: number, h: number): ImageEl {
  return { id: uid(), type: "image", photoId: photo.id, x, y, w, h, rotation: 0, zoom: 1, focusX: 0.5, focusY: 0.5 };
}

export function textElement(text: string, x: number, y: number, w: number, over: Partial<TextEl> = {}): TextEl {
  return { id: uid(), type: "text", text, x, y, w, rotation: 0, fontSize: 48, fontFamily: "Georgia", fill: "#292725", align: "center", bold: false, italic: false, ...over };
}

/** Place `photos` into the frames of a layout. Returns new image elements. */
export function framesFor(layoutId: string, fmt: Format, photos: Pick<PhotoView, "id">[]): ImageEl[] {
  const layout = layoutById[layoutId] ?? layouts[0];
  return layout.frames.slice(0, photos.length).map(([fx, fy, fw, fh], i) =>
    imageElement(photos[i], fx * fmt.width, fy * fmt.height, fw * fmt.width, fh * fmt.height));
}

export function blankPage(bg: Background): Page {
  return { id: uid(), background: { ...bg }, elements: [] };
}

/** Build a new album from a template, distributing photos across pages. */
export function buildAlbum(opts: { title: string; template: Template; format: Format; photos: PhotoView[] }): Album {
  const { template: t, format, photos } = opts;
  const queue = [...photos];
  const pages: Page[] = [];

  const cover = blankPage(t.background);
  if (queue.length) cover.elements.push(...framesFor(t.coverLayout, format, [queue.shift()!]));
  const titleOnPhoto = t.coverLayout === "full" && photos.length > 0;
  cover.elements.push(textElement(opts.title, format.width * 0.1, format.height * (titleOnPhoto ? 0.78 : 0.8), format.width * 0.8,
    { fontSize: Math.round(format.width * 0.07), fontFamily: t.titleFont, fill: titleOnPhoto ? "#ffffff" : t.titleColor }));
  pages.push(cover);

  // With photos: add interior pages until every photo is placed. Without: a few blank pages.
  const interior = queue.length === 0 ? 3 : Infinity;
  for (let i = 0; i < interior && (interior !== Infinity || queue.length > 0) && pages.length < 200; i++) {
    const layoutId = t.pageLayouts[i % t.pageLayouts.length];
    const count = (layoutById[layoutId] ?? layouts[0]).frames.length;
    const page = blankPage(t.background);
    page.elements.push(...framesFor(layoutId, format, queue.splice(0, count)));
    pages.push(page);
  }

  const now = Date.now();
  return { id: uid(), title: opts.title, category: t.category, templateId: t.id, format, pages, showPageNumbers: true, createdAt: now, updatedAt: now };
}
