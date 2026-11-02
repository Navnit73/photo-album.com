"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEditor } from "@/stores/editor-store";
import { loadAlbum, loadPhotos, saveAlbum } from "@/lib/editor/storage";
import { Toolbar } from "./toolbar";
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";
import { CanvasArea } from "./canvas-area";
import { PageStrip } from "./page-strip";
import { buttonVariants } from "@/components/ui/button";

type Load = "loading" | "ready" | "missing" | "error";

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

export function EditorShell() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<Load>("loading");
  const [mobileTab, setMobileTab] = useState<"tools" | "props">("tools");

  // Load album + photos from local storage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const album = await loadAlbum(id);
        if (cancelled) return;
        if (!album) return setState("missing");
        const photos = (await loadPhotos(id)).map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }));
        if (cancelled) return;
        useEditor.getState().init(album, photos);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Autosave (debounced) + flush when the tab is hidden.
  useEffect(() => {
    if (state !== "ready") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const flush = async () => {
      const album = useEditor.getState().album;
      if (!album) return;
      try { await saveAlbum(album); useEditor.getState().setSaveStatus("saved"); }
      catch { useEditor.getState().setSaveStatus("error"); }
    };
    const unsub = useEditor.subscribe((s, prev) => {
      if (s.album === prev.album || !s.album) return;
      s.setSaveStatus("saving");
      clearTimeout(timer);
      timer = setTimeout(flush, 800);
    });
    const onHide = () => { if (document.visibilityState === "hidden" && timer) { clearTimeout(timer); void flush(); } };
    document.addEventListener("visibilitychange", onHide);
    return () => { unsub(); clearTimeout(timer); document.removeEventListener("visibilitychange", onHide); };
  }, [state]);

  // Keyboard shortcuts.
  useEffect(() => {
    if (state !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const st = useEditor.getState();
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) st.redo(); else st.undo(); return; }
      if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); st.redo(); return; }
      if (st.preview || !st.selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); st.deleteElement(st.selectedId); return; }
      const step = e.shiftKey ? 10 : 1;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      const el = st.album?.pages[st.pageIndex].elements.find((x) => x.id === st.selectedId);
      if (d && el) { e.preventDefault(); st.updateElement(el.id, { x: el.x + d[0], y: el.y + d[1] }, `${el.id}:nudge`); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  if (state === "loading") return <div className="grid h-dvh place-items-center text-sm text-muted-foreground" role="status">Loading your album…</div>;
  if (state !== "ready") {
    return (
      <div className="grid h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl">{state === "missing" ? "Album not found" : "Could not open the album"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {state === "missing" ? "Albums are saved in this browser for now. It may have been deleted or created on another device." : "Your browser blocked local storage. Check privacy settings and try again."}
          </p>
          <Link href="/editor/new" className={buttonVariants({ className: "mt-5" })}>Back to albums</Link>
        </div>
      </div>
    );
  }

  const tabBtn = (t: "tools" | "props", label: string) => (
    <button onClick={() => setMobileTab(t)} aria-pressed={mobileTab === t}
      className={`flex-1 py-2 text-sm ${mobileTab === t ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}>{label}</button>
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Toolbar />
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[288px_1fr_304px]">
        <div className="flex min-h-0 flex-1 flex-col lg:order-2">
          <CanvasArea />
          <PageStrip />
        </div>
        {/* Mobile: a single tabbed panel under the canvas. Desktop: left + right sidebars. */}
        <div className="flex border-t border-border lg:hidden">{tabBtn("tools", "Tools")}{tabBtn("props", "Properties")}</div>
        <aside aria-label="Tools" className={`${mobileTab === "tools" ? "block" : "hidden"} h-[34vh] overflow-hidden border-border lg:order-1 lg:block lg:h-auto lg:border-r`}><LeftPanel /></aside>
        <aside aria-label="Properties" className={`${mobileTab === "props" ? "block" : "hidden"} h-[34vh] overflow-y-auto border-border lg:order-3 lg:block lg:h-auto lg:border-l`}><RightPanel /></aside>
      </div>
    </div>
  );
}
