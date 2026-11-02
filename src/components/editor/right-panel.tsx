"use client";

import { AlignCenterHorizontal, AlignCenterVertical, AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Trash2, Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/stores/editor-store";
import { fonts } from "@/lib/editor/presets";
import type { Element, ImageEl, TextEl } from "@/lib/editor/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-muted-foreground"><span className="mb-1 block">{label}</span>{children}</label>;
}
const inputCls = "h-8 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground";

function Num({ label, value, onChange, step = 1, min, max }: { label: string; value: number; onChange: (n: number) => void; step?: number; min?: number; max?: number }) {
  return (
    <Field label={label}>
      <input type="number" className={inputCls} value={Math.round(value * 100) / 100} step={step} min={min} max={max}
        onChange={(e) => { const n = parseFloat(e.target.value); if (!Number.isNaN(n)) onChange(n); }} />
    </Field>
  );
}

function Slider({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number }) {
  return (
    <Field label={`${label}: ${Math.round(value * 100) / 100}`}>
      <input type="range" className="w-full accent-[#b88c65]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </Field>
  );
}

export function RightPanel() {
  const album = useEditor((s) => s.album)!;
  const pageIndex = useEditor((s) => s.pageIndex);
  const selectedId = useEditor((s) => s.selectedId);
  const { updateElement, deleteElement, reorderElement, setPageNumbers } = useEditor.getState();
  const el = album.pages[pageIndex].elements.find((e) => e.id === selectedId);

  if (!el) {
    return (
      <div className="space-y-4 p-4">
        <h2 className="font-sans text-sm font-medium">{pageIndex === 0 ? "Cover" : `Page ${pageIndex}`}</h2>
        <p className="text-sm text-muted-foreground">Select a photo or text on the page to edit it. Use the left panel to change the layout and background.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={album.showPageNumbers} onChange={(e) => setPageNumbers(e.target.checked)} /> Show page numbers
        </label>
        <p className="text-xs text-muted-foreground">Album size: {album.format.label}</p>
      </div>
    );
  }

  const set = (patch: Partial<Element>, key?: string) => updateElement(el.id, patch, key ? `${el.id}:${key}` : undefined);
  const { width: W, height: H } = album.format;
  const wOf = (e: Element) => e.type === "image" ? e.w : e.w;
  const hOf = (e: Element) => e.type === "image" ? e.h : e.fontSize * 1.2 * (e.text.split("\n").length);

  return (
    <div className="space-y-5 p-4">
      <h2 className="font-sans text-sm font-medium">{el.type === "image" ? "Photo" : "Text"}</h2>

      {el.type === "image" && <ImageControls el={el} set={set} />}
      {el.type === "text" && <TextControls el={el} set={set} />}

      <section className="space-y-3">
        <h3 className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">Position & size</h3>
        <div className="grid grid-cols-2 gap-2">
          <Num label="X" value={el.x} onChange={(x) => set({ x }, "x")} />
          <Num label="Y" value={el.y} onChange={(y) => set({ y }, "y")} />
          {el.type === "image" && <Num label="Width" value={el.w} min={20} onChange={(w) => set({ w: Math.max(20, w) }, "w")} />}
          {el.type === "image" && <Num label="Height" value={el.h} min={20} onChange={(h) => set({ h: Math.max(20, h) }, "h")} />}
          {el.type === "text" && <Num label="Width" value={el.w} min={40} onChange={(w) => set({ w: Math.max(40, w) }, "w")} />}
        </div>
        <Slider label="Rotation (°)" value={el.rotation} min={-180} max={180} step={1} onChange={(rotation) => set({ rotation }, "rot")} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => set({ x: (W - wOf(el)) / 2 })}><AlignCenterHorizontal /> Centre H</Button>
          <Button variant="outline" size="sm" onClick={() => set({ y: (H - hOf(el)) / 2 })}><AlignCenterVertical /> Centre V</Button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">Layers</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Bring to front" onClick={() => reorderElement(el.id, "front")}><ChevronsUp /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Bring forward" onClick={() => reorderElement(el.id, "forward")}><ArrowUp /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Send backward" onClick={() => reorderElement(el.id, "back")}><ArrowDown /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Send to back" onClick={() => reorderElement(el.id, "backmost")}><ChevronsDown /></Button>
        </div>
      </section>

      <Button variant="destructive" className="w-full" onClick={() => deleteElement(el.id)}><Trash2 /> Delete</Button>
    </div>
  );
}

type SetFn = (patch: Partial<Element>, key?: string) => void;

function ImageControls({ el, set }: { el: ImageEl; set: SetFn }) {
  return (
    <section className="space-y-3">
      <h3 className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">Crop</h3>
      <Slider label="Zoom" value={el.zoom} min={1} max={4} step={0.05} onChange={(zoom) => set({ zoom }, "zoom")} />
      <Slider label="Horizontal focus" value={el.focusX} min={0} max={1} step={0.01} onChange={(focusX) => set({ focusX }, "fx")} />
      <Slider label="Vertical focus" value={el.focusY} min={0} max={1} step={0.01} onChange={(focusY) => set({ focusY }, "fy")} />
      <Button variant="ghost" size="sm" onClick={() => set({ zoom: 1, focusX: 0.5, focusY: 0.5 })}>Reset crop</Button>
    </section>
  );
}

function TextControls({ el, set }: { el: TextEl; set: SetFn }) {
  const aligns = [{ v: "left", i: AlignLeft }, { v: "center", i: AlignCenter }, { v: "right", i: AlignRight }] as const;
  return (
    <section className="space-y-3">
      <Field label="Text">
        <textarea className={`${inputCls} h-24 py-1.5`} value={el.text} onChange={(e) => set({ text: e.target.value }, "text")} />
      </Field>
      <Field label="Font">
        <select className={inputCls} value={el.fontFamily} onChange={(e) => set({ fontFamily: e.target.value })}>
          {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Num label="Size" value={el.fontSize} min={8} max={400} onChange={(fontSize) => set({ fontSize: Math.max(8, fontSize) }, "size")} />
        <Field label="Colour"><input type="color" className="h-8 w-full cursor-pointer rounded-md border border-border" value={el.fill} onChange={(e) => set({ fill: e.target.value }, "fill")} /></Field>
      </div>
      <div className="flex gap-1">
        <Button variant={el.bold ? "default" : "outline"} size="icon-sm" aria-label="Bold" aria-pressed={el.bold} onClick={() => set({ bold: !el.bold })}><Bold /></Button>
        <Button variant={el.italic ? "default" : "outline"} size="icon-sm" aria-label="Italic" aria-pressed={el.italic} onClick={() => set({ italic: !el.italic })}><Italic /></Button>
        {aligns.map(({ v, i: Icon }) => (
          <Button key={v} variant={el.align === v ? "default" : "outline"} size="icon-sm" aria-label={`Align ${v}`} aria-pressed={el.align === v} onClick={() => set({ align: v })}><Icon /></Button>
        ))}
      </div>
    </section>
  );
}
