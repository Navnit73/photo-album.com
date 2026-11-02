"use client";

import { useEffect, useMemo, useRef, type DragEvent } from "react";
import { Stage, Layer, Rect, Image as KImage, Text, Transformer } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import { useEditor } from "@/stores/editor-store";
import { imageElement } from "@/lib/editor/presets";
import type { Background, Element, ImageEl, PhotoView, TextEl } from "@/lib/editor/types";

/** Stages by page index, so the toolbar can export a page. */
export const stageRegistry = new Map<number, Konva.Stage>();

function makePattern(bg: Background): HTMLCanvasElement | null {
  if (bg.pattern === "none" || typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 40;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(41,39,37,0.14)";
  g.strokeStyle = "rgba(41,39,37,0.10)";
  g.lineWidth = 1;
  if (bg.pattern === "dots") { g.beginPath(); g.arc(20, 20, 2, 0, Math.PI * 2); g.fill(); }
  if (bg.pattern === "lines" || bg.pattern === "grid") { g.beginPath(); g.moveTo(0, 39.5); g.lineTo(40, 39.5); g.stroke(); }
  if (bg.pattern === "grid") { g.beginPath(); g.moveTo(39.5, 0); g.lineTo(39.5, 40); g.stroke(); }
  return c;
}

interface NodeProps<T extends Element> {
  el: T;
  interactive: boolean;
  register: (id: string, node: Konva.Node | null) => void;
  onSelect: () => void;
  onChange: (patch: Partial<Element>) => void;
}

function ImageNode({ el, photo, interactive, register, onSelect, onChange }: NodeProps<ImageEl> & { photo?: PhotoView }) {
  const [image] = useImage(photo?.url ?? "");
  const crop = useMemo(() => {
    if (!image) return undefined;
    const frameAspect = el.w / el.h;
    const iw = image.naturalWidth, ih = image.naturalHeight;
    let cw = Math.min(iw, ih * frameAspect), ch = cw / frameAspect;
    cw /= el.zoom; ch /= el.zoom;
    return { x: (iw - cw) * el.focusX, y: (ih - ch) * el.focusY, width: cw, height: ch };
  }, [image, el.w, el.h, el.zoom, el.focusX, el.focusY]);

  if (!image) return <Rect x={el.x} y={el.y} width={el.w} height={el.h} rotation={el.rotation} fill="#eae6e1" />;
  return (
    <KImage
      ref={(n) => register(el.id, n)}
      image={image} crop={crop}
      x={el.x} y={el.y} width={el.w} height={el.h} rotation={el.rotation}
      draggable={interactive} listening={interactive}
      onClick={onSelect} onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const n = e.target;
        const w = Math.max(20, n.width() * n.scaleX()), h = Math.max(20, n.height() * n.scaleY());
        n.scaleX(1); n.scaleY(1);
        onChange({ x: n.x(), y: n.y(), w, h, rotation: n.rotation() });
      }}
    />
  );
}

function TextNode({ el, interactive, register, onSelect, onChange }: NodeProps<TextEl>) {
  return (
    <Text
      ref={(n) => register(el.id, n)}
      text={el.text} x={el.x} y={el.y} width={el.w} rotation={el.rotation}
      fontSize={el.fontSize} fontFamily={el.fontFamily} fill={el.fill} align={el.align}
      fontStyle={`${el.italic ? "italic " : ""}${el.bold ? "bold" : "normal"}`.trim()}
      draggable={interactive} listening={interactive}
      onClick={onSelect} onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const n = e.target as Konva.Text;
        const w = Math.max(40, n.width() * n.scaleX());
        const fontSize = Math.max(8, Math.round(n.fontSize() * n.scaleY()));
        n.scaleX(1); n.scaleY(1);
        onChange({ x: n.x(), y: n.y(), w, fontSize, rotation: n.rotation() });
      }}
    />
  );
}

export function PageCanvas({ pageIndex, scale, interactive }: { pageIndex: number; scale: number; interactive: boolean }) {
  const album = useEditor((s) => s.album)!;
  const photos = useEditor((s) => s.photos);
  const selectedId = useEditor((s) => s.selectedId);
  const active = useEditor((s) => s.pageIndex === pageIndex);
  const { select, updateElement, setPage, addElement } = useEditor.getState();

  const page = album.pages[pageIndex];
  const { width: W, height: H } = album.format;
  const editable = interactive && active;
  const nodes = useRef(new Map<string, Konva.Node>());
  const trRef = useRef<Konva.Transformer>(null);
  const pattern = useMemo(() => makePattern(page.background), [page.background]);

  const register = (id: string, node: Konva.Node | null) => {
    if (node) nodes.current.set(id, node); else nodes.current.delete(id);
  };

  // Attach the transformer to the selected node after every render.
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    const node = editable && selectedId ? nodes.current.get(selectedId) : undefined;
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  });

  useEffect(() => () => { stageRegistry.delete(pageIndex); }, [pageIndex]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    const photoId = e.dataTransfer.getData("application/x-photo-id");
    const photo = photoId ? photos[photoId] : undefined;
    if (!photo || !interactive) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / scale, cy = (e.clientY - rect.top) / scale;
    const w = Math.min(W * 0.45, (H * 0.45 * photo.width) / photo.height);
    const h = (w * photo.height) / photo.width;
    setPage(pageIndex);
    addElement(imageElement(photo, Math.max(0, cx - w / 2), Math.max(0, cy - h / 2), w, h));
  };

  const numbered = album.showPageNumbers && pageIndex > 0;

  return (
    <div
      onPointerDown={() => { if (interactive && !active) setPage(pageIndex); }}
      onDragOver={(e) => { if (interactive) e.preventDefault(); }}
      onDrop={onDrop}
      className={`shrink-0 overflow-hidden bg-white shadow-sm ring-1 ${active && interactive ? "ring-brand" : "ring-border"}`}
      style={{ width: W * scale, height: H * scale }}
      aria-label={`Page ${pageIndex + 1} of ${album.pages.length}`}
    >
      <Stage
        width={W * scale} height={H * scale} scaleX={scale} scaleY={scale}
        ref={(s) => { if (s) stageRegistry.set(pageIndex, s); }}
        onMouseDown={(e) => { if (editable && (e.target === e.target.getStage() || e.target.name() === "bg")) select(null); }}
        onTouchStart={(e) => { if (editable && (e.target === e.target.getStage() || e.target.name() === "bg")) select(null); }}
      >
        <Layer>
          <Rect name="bg" width={W} height={H} fill={page.background.color} listening={editable} />
          {pattern && <Rect name="bg" width={W} height={H} fillPatternImage={pattern as unknown as HTMLImageElement} listening={editable} />}
          {page.elements.map((el) => {
            const common = {
              interactive: editable, register,
              onSelect: () => select(el.id),
              onChange: (patch: Partial<Element>) => updateElement(el.id, patch),
            };
            return el.type === "image"
              ? <ImageNode key={el.id} el={el} photo={photos[el.photoId]} {...common} />
              : <TextNode key={el.id} el={el} {...common} />;
          })}
          {numbered && (
            <Text text={String(pageIndex)} x={0} y={H - 55} width={W} align="center" fontSize={24}
              fontFamily="Georgia" fill="#77716b" listening={false} />
          )}
          {editable && <Transformer ref={trRef} rotateEnabled keepRatio={false} flipEnabled={false} borderStroke="#b88c65" anchorStroke="#b88c65" anchorSize={10} />}
        </Layer>
      </Stage>
    </div>
  );
}
