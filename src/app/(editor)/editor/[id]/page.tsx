import type { Metadata } from "next";
import { EditorLoader } from "@/components/editor/editor-loader";

export const metadata: Metadata = { title: "Album editor", robots: { index: false, follow: false } };

// The editor reads the album id on the client (albums live in the browser for now).
export function generateStaticParams() {
  return [{ id: "local" }];
}

export default function EditorPage() {
  return <EditorLoader />;
}
