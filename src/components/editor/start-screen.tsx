"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAlbum, customFormat, formats, templates, uid } from "@/lib/editor/presets";
import { processImageFile } from "@/lib/editor/images";
import { deleteAlbum, listAlbums, saveAlbum, savePhoto } from "@/lib/editor/storage";
import type { Album, Format, PhotoView } from "@/lib/editor/types";

const inputCls = "h-9 w-full rounded-md border border-border bg-background px-3 text-sm";

export function StartScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("My Photo Album");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [formatId, setFormatId] = useState(formats[0].id);
  const [cw, setCw] = useState(8);
  const [ch, setCh] = useState(8);
  const [pending, setPending] = useState<PhotoView[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState<Album[] | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { listAlbums().then((a) => setSaved(a.sort((x, y) => y.updatedAt - x.updatedAt))).catch(() => setSaved([])); }, []);

  const addFiles = async (files: FileList | File[]) => {
    setBusy(true); setErrors([]);
    const ok: PhotoView[] = []; const errs: string[] = [];
    for (const f of Array.from(files)) {
      try {
        const p = await processImageFile(f);
        ok.push({ id: uid(), albumId: "", name: p.name, width: p.width, height: p.height, blob: p.blob, url: URL.createObjectURL(p.blob) });
      } catch (e) { errs.push(e instanceof Error ? e.message : `${f.name}: failed`); }
    }
    setPending((p) => [...p, ...ok]); setErrors(errs); setBusy(false);
  };

  const customValid = cw >= 3 && cw <= 24 && ch >= 3 && ch <= 24;
  const format: Format = formatId === "custom" ? customFormat(cw, ch) : formats.find((f) => f.id === formatId)!;

  const create = async () => {
    if (formatId === "custom" && !customValid) return;
    setCreating(true);
    try {
      const album = buildAlbum({ title: title.trim() || "Untitled album", template: templates.find((t) => t.id === templateId)!, format, photos: pending });
      const photos = pending.map((p) => ({ ...p, albumId: album.id }));
      // Photos hold the (previously blank) album id; rebuild references are by photo id so this is safe.
      for (const p of photos) await savePhoto({ id: p.id, albumId: p.albumId, name: p.name, width: p.width, height: p.height, blob: p.blob });
      await saveAlbum(album);
      router.push(`/editor/${album.id}`);
    } catch {
      setErrors(["Could not save your album in this browser. Check that storage is not blocked."]);
      setCreating(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl">Create your photo album</h1>
        <p className="mt-2 text-muted-foreground">Albums are saved in this browser for now. Accounts and cloud saving are coming.</p>
      </div>

      <section aria-labelledby="s1" className="space-y-3">
        <h2 id="s1" className="text-xl">1. Choose a template</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {templates.map((t) => (
            <li key={t.id}>
              <button onClick={() => setTemplateId(t.id)} aria-pressed={templateId === t.id}
                className={`w-full rounded-xl border bg-background p-4 text-left ${templateId === t.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-brand"}`}>
                <div className="mb-3 h-16 rounded-md border border-border" style={{ background: t.background.color }} />
                <p className="font-serif text-lg">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.category} · {t.premium ? "Premium" : "Free"}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="s2" className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 id="s2" className="text-xl">2. Name and size</h2>
          <label className="block text-sm">Album title
            <input className={`${inputCls} mt-1`} value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm">Size
            <select className={`${inputCls} mt-1`} value={formatId} onChange={(e) => setFormatId(e.target.value)}>
              {formats.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              <option value="custom">Custom size…</option>
            </select>
          </label>
          {formatId === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Width (in)<input type="number" min={3} max={24} step={0.5} className={`${inputCls} mt-1`} value={cw} onChange={(e) => setCw(parseFloat(e.target.value) || 0)} /></label>
              <label className="text-sm">Height (in)<input type="number" min={3} max={24} step={0.5} className={`${inputCls} mt-1`} value={ch} onChange={(e) => setCh(parseFloat(e.target.value) || 0)} /></label>
              {!customValid && <p role="alert" className="col-span-2 text-xs text-destructive">Size must be between 3 and 24 inches.</p>}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl">3. Add photos <span className="text-sm text-muted-foreground">(optional)</span></h2>
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files); }}
            className="rounded-xl border border-dashed border-border bg-background p-5 text-center text-sm">
            <ImagePlus className="mx-auto size-6 text-brand" aria-hidden />
            <p className="mt-2 text-muted-foreground">Drag photos here or</p>
            <Button className="mt-2" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Processing…" : "Choose photos"}</Button>
            <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload photos"
              onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }} />
            <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP · up to 25 MB each</p>
          </div>
          {pending.length > 0 && <p className="text-sm">{pending.length} photo{pending.length === 1 ? "" : "s"} ready</p>}
          {errors.length > 0 && (
            <ul role="alert" className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
          )}
        </div>
      </section>

      <Button size="lg" onClick={create} disabled={creating || busy || (formatId === "custom" && !customValid)}>
        {creating ? "Creating…" : "Create album"}
      </Button>

      <section aria-labelledby="s4" className="space-y-3">
        <h2 id="s4" className="text-xl">Continue editing</h2>
        {saved === null ? <p className="text-sm text-muted-foreground">Loading…</p> : saved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved albums in this browser yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-background">
            {saved.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 p-4">
                <Link href={`/editor/${a.id}`} className="min-w-0 flex-1 hover:underline">
                  <p className="truncate font-serif text-lg">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.pages.length - 1} pages · {a.format.label} · edited {new Date(a.updatedAt).toLocaleDateString()}</p>
                </Link>
                <Button variant="ghost" size="icon-sm" aria-label={`Delete ${a.title}`}
                  onClick={async () => {
                    if (!window.confirm(`Delete “${a.title}” and its photos from this browser? This cannot be undone.`)) return;
                    await deleteAlbum(a.id); setSaved((s) => s?.filter((x) => x.id !== a.id) ?? []);
                  }}><Trash2 /></Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
