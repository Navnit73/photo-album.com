import { create } from "zustand";
import type { Album, Element, Page, PhotoView, Background } from "@/lib/editor/types";
import { blankPage, framesFor, layoutById, uid } from "@/lib/editor/presets";

const HISTORY_LIMIT = 100;
const COALESCE_MS = 700;

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type ViewMode = "single" | "spread";

interface EditorState {
  album: Album | null;
  photos: Record<string, PhotoView>;
  pageIndex: number;
  selectedId: string | null;
  zoom: number;
  viewMode: ViewMode;
  preview: boolean;
  saveStatus: SaveStatus;
  past: Album[];
  future: Album[];
  lastCoalesce: { key: string; at: number } | null;

  init: (album: Album, photos: PhotoView[]) => void;
  commit: (fn: (draft: Album) => void, coalesceKey?: string) => void;
  undo: () => void;
  redo: () => void;

  setPage: (i: number) => void;
  select: (id: string | null) => void;
  setZoom: (z: number) => void;
  setViewMode: (m: ViewMode) => void;
  setPreview: (p: boolean) => void;
  setSaveStatus: (s: SaveStatus) => void;

  addPhotos: (photos: PhotoView[]) => void;
  removePhoto: (id: string) => void;
  addElement: (el: Element) => void;
  updateElement: (id: string, patch: Partial<Element>, coalesceKey?: string) => void;
  deleteElement: (id: string) => void;
  reorderElement: (id: string, dir: "forward" | "back" | "front" | "backmost") => void;
  setBackground: (bg: Partial<Background>, allPages?: boolean) => void;
  applyLayout: (layoutId: string) => void;
  setTitle: (t: string) => void;
  setPageNumbers: (v: boolean) => void;

  addPage: () => void;
  duplicatePage: (i: number) => void;
  deletePage: (i: number) => void;
  movePage: (from: number, to: number) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export const useEditor = create<EditorState>((set, get) => ({
  album: null, photos: {}, pageIndex: 0, selectedId: null, zoom: 1, viewMode: "single", preview: false,
  saveStatus: "idle", past: [], future: [], lastCoalesce: null,

  init: (album, photos) =>
    set({
      album, photos: Object.fromEntries(photos.map((p) => [p.id, p])), pageIndex: 0, selectedId: null,
      zoom: 1, preview: false, past: [], future: [], saveStatus: "idle", lastCoalesce: null,
    }),

  commit: (fn, coalesceKey) => {
    const { album, past, lastCoalesce } = get();
    if (!album) return;
    const next = structuredClone(album);
    fn(next);
    next.updatedAt = Date.now();
    const now = Date.now();
    const coalesce = !!coalesceKey && lastCoalesce?.key === coalesceKey && now - lastCoalesce.at < COALESCE_MS;
    set({
      album: next,
      past: coalesce ? past : [...past, album].slice(-HISTORY_LIMIT),
      future: [],
      lastCoalesce: coalesceKey ? { key: coalesceKey, at: now } : null,
    });
  },

  undo: () => {
    const { album, past, future, pageIndex } = get();
    if (!album || past.length === 0) return;
    const prev = past[past.length - 1];
    set({ album: prev, past: past.slice(0, -1), future: [album, ...future], pageIndex: Math.min(pageIndex, prev.pages.length - 1), selectedId: null, lastCoalesce: null });
  },
  redo: () => {
    const { album, past, future, pageIndex } = get();
    if (!album || future.length === 0) return;
    const next = future[0];
    set({ album: next, past: [...past, album], future: future.slice(1), pageIndex: Math.min(pageIndex, next.pages.length - 1), selectedId: null, lastCoalesce: null });
  },

  setPage: (i) => {
    const n = get().album?.pages.length ?? 1;
    set({ pageIndex: clamp(i, 0, n - 1), selectedId: null });
  },
  select: (id) => set({ selectedId: id }),
  setZoom: (z) => set({ zoom: clamp(z, 0.25, 3) }),
  setViewMode: (m) => set({ viewMode: m }),
  setPreview: (p) => set({ preview: p, selectedId: null }),
  setSaveStatus: (s) => set({ saveStatus: s }),

  addPhotos: (photos) => set((s) => ({ photos: { ...s.photos, ...Object.fromEntries(photos.map((p) => [p.id, p])) } })),

  removePhoto: (id) => {
    const { photos } = get();
    const rest = { ...photos };
    const gone = rest[id];
    delete rest[id];
    get().commit((a) => { a.pages.forEach((p) => { p.elements = p.elements.filter((e) => !(e.type === "image" && e.photoId === id)); }); });
    set({ photos: rest, selectedId: null });
    if (gone) URL.revokeObjectURL(gone.url);
  },

  addElement: (el) => {
    const i = get().pageIndex;
    get().commit((a) => { a.pages[i].elements.push(el); });
    set({ selectedId: el.id });
  },

  updateElement: (id, patch, key) => {
    const i = get().pageIndex;
    get().commit((a) => {
      const el = a.pages[i].elements.find((e) => e.id === id);
      if (el) Object.assign(el, patch);
    }, key);
  },

  deleteElement: (id) => {
    const i = get().pageIndex;
    get().commit((a) => { a.pages[i].elements = a.pages[i].elements.filter((e) => e.id !== id); });
    set({ selectedId: null });
  },

  reorderElement: (id, dir) => {
    const i = get().pageIndex;
    get().commit((a) => {
      const els = a.pages[i].elements;
      const from = els.findIndex((e) => e.id === id);
      if (from < 0) return;
      const to = dir === "forward" ? from + 1 : dir === "back" ? from - 1 : dir === "front" ? els.length - 1 : 0;
      if (to < 0 || to >= els.length) return;
      const [el] = els.splice(from, 1);
      els.splice(to, 0, el);
    });
  },

  setBackground: (bg, allPages) => {
    const i = get().pageIndex;
    get().commit((a) => {
      (allPages ? a.pages : [a.pages[i]]).forEach((p) => { p.background = { ...p.background, ...bg }; });
    }, "background");
  },

  /** Re-flow the current page's photos into a layout, pulling in unused album photos if frames remain. */
  applyLayout: (layoutId) => {
    const { album, photos, pageIndex } = get();
    const layout = layoutById[layoutId];
    if (!album || !layout) return;
    const page = album.pages[pageIndex];
    const onPage = page.elements.filter((e) => e.type === "image");
    const used = new Set(album.pages.flatMap((p) => p.elements.flatMap((e) => (e.type === "image" ? [e.photoId] : []))));
    const unused = Object.values(photos).filter((p) => !used.has(p.id));
    const sources = [
      ...onPage.map((e) => ({ id: e.photoId })),
      ...unused.map((p) => ({ id: p.id })),
    ].slice(0, layout.frames.length);
    get().commit((a) => {
      const pg = a.pages[pageIndex];
      const texts = pg.elements.filter((e) => e.type === "text");
      const leftover = pg.elements.filter((e) => e.type === "image").slice(sources.length);
      pg.elements = [...framesFor(layoutId, a.format, sources), ...leftover, ...texts];
    });
    set({ selectedId: null });
  },

  setTitle: (t) => get().commit((a) => { a.title = t; }, "title"),
  setPageNumbers: (v) => get().commit((a) => { a.showPageNumbers = v; }),

  addPage: () => {
    const { album, pageIndex } = get();
    if (!album) return;
    const bg = album.pages[pageIndex]?.background ?? { color: "#ffffff", pattern: "none" as const };
    get().commit((a) => { a.pages.splice(pageIndex + 1, 0, blankPage(bg)); });
    set({ pageIndex: pageIndex + 1, selectedId: null });
  },

  duplicatePage: (i) => {
    if (!get().album?.pages[i]) return;
    get().commit((a) => {
      const copy: Page = structuredClone(a.pages[i]);
      copy.id = uid();
      copy.elements.forEach((e) => { e.id = uid(); });
      a.pages.splice(i + 1, 0, copy);
    });
    set({ pageIndex: i + 1, selectedId: null });
  },

  deletePage: (i) => {
    const { album } = get();
    if (!album || album.pages.length <= 1 || i === 0) return; // the cover cannot be deleted
    get().commit((a) => { a.pages.splice(i, 1); });
    set((s) => ({ pageIndex: Math.min(s.pageIndex, (s.album?.pages.length ?? 1) - 1), selectedId: null }));
  },

  movePage: (from, to) => {
    const { album } = get();
    // The cover (index 0) stays first.
    if (!album || from === to || from === 0 || to < 1 || to >= album.pages.length) return;
    get().commit((a) => { const [p] = a.pages.splice(from, 1); a.pages.splice(to, 0, p); });
    set({ pageIndex: to });
  },
}));
