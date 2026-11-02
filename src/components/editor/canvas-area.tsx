"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/stores/editor-store";
import { PageCanvas } from "./page-canvas";

const PAD = 40;
const GAP = 0;

/** Pages shown together: cover alone, then (1,2), (3,4)… in spread mode. */
function visiblePages(index: number, total: number, spread: boolean): number[] {
  if (!spread || index === 0) return [index];
  const left = index % 2 === 1 ? index : index - 1;
  return [left, left + 1].filter((i) => i < total);
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function Pages({ interactive, zoom, spread, size }: { interactive: boolean; zoom: number; spread: boolean; size: { w: number; h: number } }) {
  const album = useEditor((s) => s.album)!;
  const pageIndex = useEditor((s) => s.pageIndex);
  const pages = visiblePages(pageIndex, album.pages.length, spread);
  const { width: W, height: H } = album.format;
  const fit = Math.min((size.w - PAD) / (W * pages.length + GAP), (size.h - PAD) / H);
  const scale = Math.max(0.05, fit * zoom);
  return (
    <div className="m-auto flex" style={{ gap: GAP }}>
      {pages.map((i) => <PageCanvas key={album.pages[i].id} pageIndex={i} scale={scale} interactive={interactive} />)}
    </div>
  );
}

export function CanvasArea() {
  const zoom = useEditor((s) => s.zoom);
  const viewMode = useEditor((s) => s.viewMode);
  const preview = useEditor((s) => s.preview);
  const pageIndex = useEditor((s) => s.pageIndex);
  const total = useEditor((s) => s.album!.pages.length);
  const { setPage, setPreview } = useEditor.getState();
  const [ref, size] = useSize<HTMLDivElement>();
  const [pvRef, pvSize] = useSize<HTMLDivElement>();

  const step = (dir: 1 | -1) => {
    const shown = visiblePages(pageIndex, total, viewMode === "spread");
    setPage(dir === 1 ? Math.min(total - 1, shown[shown.length - 1] + 1) : Math.max(0, shown[0] - 1));
  };

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div ref={ref} className="relative flex min-h-0 flex-1 overflow-auto bg-surface p-5">
        <Pages interactive zoom={zoom} spread={viewMode === "spread"} size={size} />
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-border bg-background py-1.5 text-xs text-muted-foreground">
        <Button variant="ghost" size="icon-xs" aria-label="Previous page" disabled={pageIndex === 0} onClick={() => step(-1)}><ChevronLeft /></Button>
        {pageIndex === 0 ? "Cover" : `Page ${pageIndex}`} of {total - 1}
        <Button variant="ghost" size="icon-xs" aria-label="Next page" disabled={pageIndex >= total - 1} onClick={() => step(1)}><ChevronRight /></Button>
      </div>

      {preview && (
        <div role="dialog" aria-modal="true" aria-label="Album preview" className="fixed inset-0 z-50 flex flex-col bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
            <p className="font-serif">Preview</p>
            <Button variant="ghost" size="icon-sm" aria-label="Close preview" onClick={() => setPreview(false)}><X /></Button>
          </div>
          <div ref={pvRef} className="flex min-h-0 flex-1 overflow-auto p-5">
            <Pages interactive={false} zoom={1} spread size={pvSize} />
          </div>
          <div className="flex items-center justify-center gap-4 border-t border-border bg-background py-2 text-sm">
            <Button variant="outline" size="sm" disabled={pageIndex === 0} onClick={() => step(-1)}><ChevronLeft /> Previous</Button>
            <Button variant="outline" size="sm" disabled={pageIndex >= total - 1 || visiblePages(pageIndex, total, true).includes(total - 1)} onClick={() => step(1)}>Next <ChevronRight /></Button>
          </div>
        </div>
      )}
    </>
  );
}
