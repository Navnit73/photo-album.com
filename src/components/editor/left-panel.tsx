"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, LayoutGrid, Palette, Type, Trash2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/stores/editor-store";
import { layouts, imageElement, textElement, swatches, uid } from "@/lib/editor/presets";
import { processImageFile } from "@/lib/editor/images";
import { savePhoto, deletePhoto } from "@/lib/editor/storage";
import type { PatternId, PhotoView } from "@/lib/editor/types";

const tabs = [
  { id: "photos", label: "Photos", icon: Images },
  { id: "layouts", label: "Layouts", icon: LayoutGrid },
  { id: "backgrounds", label: "Backgrounds", icon: Palette },
  { id: "text", label: "Text", icon: Type },
] as const;
type Tab = (typeof tabs)[number]["id"];

/** Uploads files into an album (validates, downsizes, persists locally). Returns error messages. */
export async function uploadFiles(albumId: string, files: File[]): Promise<{ added: PhotoView[]; errors: string[] }> {
  const added: PhotoView[] = [];
  const errors: string[] = [];
  for (const file of files) {
    try {
      const p = await processImageFile(file);
      const photo = { id: uid(), albumId, name: p.name, width: p.width, height: p.height, blob: p.blob };
      await savePhoto(photo);
      added.push({ ...photo, url: URL.createObjectURL(photo.blob) });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : `${file.name}: upload failed.`);
    }
  }
  return { added, errors };
}

export function LeftPanel() {
  const [tab, setTab] = useState<Tab>("photos");
  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label="Editor tools" className="grid grid-cols-4 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-1 px-1 py-2.5 text-xs ${tab === t.id ? "border-b-2 border-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="size-4" aria-hidden />{t.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {tab === "photos" && <PhotosTab />}
        {tab === "layouts" && <LayoutsTab />}
        {tab === "backgrounds" && <BackgroundsTab />}
        {tab === "text" && <TextTab />}
      </div>
    </div>
  );
}

function PhotosTab() {
  const album = useEditor((s) => s.album)!;
  const photos = useEditor((s) => s.photos);
  const addPhotos = useEditor((s) => s.addPhotos);
  const removePhoto = useEditor((s) => s.removePhoto);
  const addElement = useEditor((s) => s.addElement);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  const handle = async (list: FileList | File[]) => {
    setBusy(true); setErrors([]);
    const { added, errors } = await uploadFiles(album.id, Array.from(list));
    addPhotos(added); setErrors(errors); setBusy(false);
  };

  const place = (p: PhotoView) => {
    const { width: W, height: H } = album.format;
    const w = Math.min(W * 0.5, (H * 0.5 * p.width) / p.height), h = (w * p.height) / p.width;
    addElement(imageElement(p, (W - w) / 2, (H - h) / 2, w, h));
  };

  const list = Object.values(photos);
  return (
    <div>
      <div
        onDragOver={(e: DragEvent) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) void handle(e.dataTransfer.files); }}
        className={`rounded-xl border border-dashed p-4 text-center text-sm ${over ? "border-brand bg-surface" : "border-border"}`}
      >
        <ImagePlus className="mx-auto size-6 text-brand" aria-hidden />
        <p className="mt-2 text-muted-foreground">Drag photos here or</p>
        <Button className="mt-2" variant="outline" size="sm" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? "Processing…" : "Choose photos"}
        </Button>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload photos"
          onChange={(e) => { if (e.target.files) void handle(e.target.files); e.target.value = ""; }} />
        <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP · up to 25 MB each</p>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}

      {list.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">No photos yet. Upload some to get started.</p>
      ) : (
        <>
          <p className="mt-4 text-xs text-muted-foreground">{list.length} photo{list.length === 1 ? "" : "s"} · click or drag onto the page</p>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {list.map((p) => (
              <li key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.name} draggable
                  onDragStart={(e) => e.dataTransfer.setData("application/x-photo-id", p.id)}
                  onClick={() => place(p)} className="size-full cursor-pointer object-cover" />
                <button aria-label={`Remove ${p.name}`}
                  onClick={() => {
                    if (!window.confirm("Remove this photo from the album? It will also be removed from any page using it.")) return;
                    removePhoto(p.id); void deletePhoto(p.id);
                  }}
                  className="absolute right-1 top-1 hidden rounded-md bg-background/90 p-1 group-hover:block focus-visible:block">
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function LayoutsTab() {
  const applyLayout = useEditor((s) => s.applyLayout);
  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">Re-arranges the photos on this page. Unused photos fill empty frames.</p>
      <ul className="grid grid-cols-2 gap-3">
        {layouts.map((l) => (
          <li key={l.id}>
            <button onClick={() => applyLayout(l.id)} className="w-full rounded-lg border border-border p-2 text-left hover:border-brand" aria-label={`Apply layout: ${l.label}`}>
              <div className="relative aspect-[4/3] bg-surface">
                {l.frames.map((f, i) => (
                  <div key={i} className="absolute bg-secondary-foreground/30"
                    style={{ left: `${f[0] * 100}%`, top: `${f[1] * 100}%`, width: `${f[2] * 100}%`, height: `${f[3] * 100}%` }} />
                ))}
              </div>
              <span className="mt-1.5 block text-xs">{l.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const patterns: { id: PatternId; label: string }[] = [
  { id: "none", label: "None" }, { id: "dots", label: "Dots" }, { id: "lines", label: "Lines" }, { id: "grid", label: "Grid" },
];

function BackgroundsTab() {
  const page = useEditor((s) => s.album!.pages[s.pageIndex]);
  const setBackground = useEditor((s) => s.setBackground);
  const [all, setAll] = useState(false);
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium">Colour</p>
        <div className="flex flex-wrap gap-2">
          {swatches.map((c) => (
            <button key={c} aria-label={`Background ${c}`} onClick={() => setBackground({ color: c }, all)}
              className={`size-8 rounded-full border ${page.background.color === c ? "ring-2 ring-brand ring-offset-2" : "border-border"}`} style={{ background: c }} />
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">Custom
          <input type="color" value={page.background.color} onChange={(e) => setBackground({ color: e.target.value }, all)} className="h-8 w-12 cursor-pointer rounded border border-border" />
        </label>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Pattern</p>
        <div className="grid grid-cols-2 gap-2">
          {patterns.map((p) => (
            <Button key={p.id} size="sm" variant={page.background.pattern === p.id ? "default" : "outline"} onClick={() => setBackground({ pattern: p.id }, all)}>{p.label}</Button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Apply to all pages
      </label>
    </div>
  );
}

function TextTab() {
  const album = useEditor((s) => s.album)!;
  const addElement = useEditor((s) => s.addElement);
  const { width: W, height: H } = album.format;
  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full justify-start" onClick={() => addElement(textElement("Heading", W * 0.1, H * 0.1, W * 0.8, { fontSize: Math.round(W * 0.06) }))}>
        <span className="font-serif text-base">Add heading</span>
      </Button>
      <Button variant="outline" className="w-full justify-start" onClick={() => addElement(textElement("Add a caption", W * 0.1, H * 0.88, W * 0.8, { fontSize: Math.round(W * 0.025), italic: true }))}>
        <span className="text-sm italic">Add caption</span>
      </Button>
      <p className="text-xs text-muted-foreground">Select text on the page to edit its content, font and colour.</p>
    </div>
  );
}
