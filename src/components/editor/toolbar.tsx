"use client";

import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, Eye, Download, BookOpen, Square, Check, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/stores/editor-store";
import { stageRegistry } from "./page-canvas";

export function exportPagePng() {
  const { pageIndex, album, select } = useEditor.getState();
  select(null);
  // Wait a frame so the transformer is removed before capturing.
  requestAnimationFrame(() => {
    const stage = stageRegistry.get(pageIndex);
    if (!stage || !album) return;
    // 300 dpi: logical units are 100 per inch.
    const url = stage.toDataURL({ pixelRatio: 3 / stage.scaleX(), mimeType: "image/png" });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${album.title.replace(/[^\w-]+/g, "-") || "album"}-${pageIndex === 0 ? "cover" : `page-${pageIndex}`}.png`;
    a.click();
  });
}

export function Toolbar() {
  const title = useEditor((s) => s.album!.title);
  const zoom = useEditor((s) => s.zoom);
  const viewMode = useEditor((s) => s.viewMode);
  const saveStatus = useEditor((s) => s.saveStatus);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);
  const { setTitle, undo, redo, setZoom, setViewMode, setPreview } = useEditor.getState();

  const status = {
    idle: null,
    saving: <><Loader2 className="size-3.5 animate-spin" /> Saving…</>,
    saved: <><Check className="size-3.5 text-success" /> Saved</>,
    error: <><TriangleAlert className="size-3.5 text-destructive" /> Not saved</>,
  }[saveStatus];

  return (
    <header className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-3 py-2">
      <Link href="/editor/new" aria-label="Back to albums" className="rounded-md p-1.5 hover:bg-surface"><ArrowLeft className="size-4" /></Link>
      <input aria-label="Album title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="h-8 min-w-[9rem] flex-1 rounded-md border border-transparent px-2 font-serif text-base hover:border-border focus:border-ring sm:max-w-xs" />
      <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex" aria-live="polite">{status}</span>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Undo" disabled={!canUndo} onClick={undo}><Undo2 /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Redo" disabled={!canRedo} onClick={redo}><Redo2 /></Button>
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        <Button variant="ghost" size="icon-sm" aria-label="Zoom out" onClick={() => setZoom(zoom - 0.1)}><ZoomOut /></Button>
        <button onClick={() => setZoom(1)} className="w-11 text-center text-xs text-muted-foreground" aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
        <Button variant="ghost" size="icon-sm" aria-label="Zoom in" onClick={() => setZoom(zoom + 0.1)}><ZoomIn /></Button>
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        <Button variant={viewMode === "spread" ? "secondary" : "ghost"} size="icon-sm" aria-label={viewMode === "spread" ? "Single page view" : "Spread view"} aria-pressed={viewMode === "spread"}
          onClick={() => setViewMode(viewMode === "spread" ? "single" : "spread")}>{viewMode === "spread" ? <BookOpen /> : <Square />}</Button>
        <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye /> <span className="hidden sm:inline">Preview</span></Button>
        <Button size="sm" onClick={exportPagePng}><Download /> <span className="hidden sm:inline">Export page</span></Button>
      </div>
    </header>
  );
}
