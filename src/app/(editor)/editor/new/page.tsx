import type { Metadata } from "next";
import Link from "next/link";
import { StartScreen } from "@/components/editor/start-screen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create a photo album",
  description: "Choose a template and size, add your photos and start designing.",
  robots: { index: false, follow: false },
};

export default function NewAlbumPage() {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
          <Link href="/" className="font-serif text-lg font-semibold">{siteConfig.name}</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <StartScreen />
      </main>
    </div>
  );
}
