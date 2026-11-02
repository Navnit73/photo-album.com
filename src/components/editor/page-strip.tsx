"use client";

import { useState } from "react";
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/stores/editor-store";
import type { Page, Format } from "@/lib/editor/types";

const THUMB_W = 76;

function Thumb({ page, format }: { page: Page; format: Format }) {
  const photos = useEditor((s) => s.photos);
  return (
    <div className="relative overflow-hidden" style={{ width: THUMB_W, height: (THUMB_W * format.height) / format.width, background: page.background.color }}>
      {page.elements.map((e) => {
        const style = { left: `${(e.x / format.width) * 100}%`, top: `${(e.y / format.height) * 100}%`, width: `${(e.w / format.width) * 100}%`, transform: `rotate(${e.rotation}deg)`, transformOrigin: "top left" } as const;
        return e.type === "image" ? (
          <div key={e.id} className="absolute bg-cover bg-center" style={{ ...style, height: `${(e.h / format.height) * 100}%`, backgroundImage: photos[e.photoId] ? `url(${photos[e.photoId].url})` : undefined, backgroundColor: "#eae6e1" }} />
        ) : (
          <div key={e.id} className="absolute h-[2px] bg-foreground/50" style={style} />
        );
      })}
    </div>
  );
}

export function PageStrip() {
  const album = useEditor((s) => s.album)!;
  const pageIndex = useEditor((s) => s.pageIndex);
  const { setPage, addPage, duplicatePage, deletePage, movePage } = useEditor.getState();
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const n = album.pages.length;

  return (
    <div className="flex items-center gap-3 border-t border-border bg-background px-3 py-2">
      <div className="flex shrink-0 gap-1" role="toolbar" aria-label="Page actions">
        <Button variant="outline" size="icon-sm" aria-label="Add page" onClick={addPage}><Plus /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Duplicate page" onClick={() => duplicatePage(pageIndex)}><Copy /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move page left" disabled={pageIndex < 2} onClick={() => movePage(pageIndex, pageIndex - 1)}><ChevronLeft /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Move page right" disabled={pageIndex === 0 || pageIndex >= n - 1} onClick={() => movePage(pageIndex, pageIndex + 1)}><ChevronRight /></Button>
        <Button variant="outline" size="icon-sm" aria-label="Delete page" disabled={pageIndex === 0 || n <= 1}
          onClick={() => { if (window.confirm("Delete this page?")) deletePage(pageIndex); }}><Trash2 /></Button>
      </div>
      <ol className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1" aria-label="Pages">
        {album.pages.map((p, i) => (
          <li key={p.id} className="shrink-0">
            <button
              draggable={i > 0}
              onDragStart={() => setDragFrom(i)}
              onDragOver={(e) => { if (dragFrom !== null && i > 0) e.preventDefault(); }}
              onDrop={() => { if (dragFrom !== null) movePage(dragFrom, i); setDragFrom(null); }}
              onClick={() => setPage(i)}
              aria-label={i === 0 ? "Cover" : `Page ${i}`} aria-current={i === pageIndex}
              className={`block rounded-md p-0.5 ${i === pageIndex ? "ring-2 ring-brand" : "ring-1 ring-border"}`}
            >
              <Thumb page={p} format={album.format} />
              <span className="mt-0.5 block text-center text-[10px] text-muted-foreground">{i === 0 ? "Cover" : i}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
