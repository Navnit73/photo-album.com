/** Logical units: 100 units = 1 inch. Export multiplies by DPI/100. */
export interface Format {
  id: string;
  label: string;
  width: number;
  height: number;
  orientation: "square" | "landscape" | "portrait" | "custom";
}

export type PatternId = "none" | "dots" | "lines" | "grid";
export interface Background { color: string; pattern: PatternId }

interface BaseEl { id: string; x: number; y: number; rotation: number }
export interface ImageEl extends BaseEl {
  type: "image"; photoId: string; w: number; h: number;
  /** >= 1. Crop zoom inside the frame. */
  zoom: number;
  /** 0..1 crop focus within the source image. */
  focusX: number; focusY: number;
}
export interface TextEl extends BaseEl {
  type: "text"; text: string; w: number; fontSize: number; fontFamily: string;
  fill: string; align: "left" | "center" | "right"; bold: boolean; italic: boolean;
}
export type Element = ImageEl | TextEl;

export interface Page { id: string; background: Background; elements: Element[] }

export interface Album {
  id: string;
  title: string;
  category: string;
  templateId: string;
  format: Format;
  pages: Page[]; // pages[0] is the cover
  showPageNumbers: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Photo {
  id: string; albumId: string; name: string; width: number; height: number; blob: Blob;
}
/** Photo with a live object URL for display. */
export interface PhotoView extends Omit<Photo, "blob"> { url: string; blob: Blob }
