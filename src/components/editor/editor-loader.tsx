"use client";

import dynamic from "next/dynamic";

// Konva needs the browser, and the editor bundle should load separately from the marketing site.
const EditorShell = dynamic(() => import("./editor-shell").then((m) => m.EditorShell), {
  ssr: false,
  loading: () => <div className="grid h-dvh place-items-center text-sm text-muted-foreground" role="status">Loading editor…</div>,
});

export function EditorLoader() { return <EditorShell />; }
