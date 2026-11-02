import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export function SimplePage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title, href: path }]} />
      <h1 className="mt-6 text-4xl md:text-5xl">{title}</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">{children}</div>
    </div>
  );
}

export function DraftNotice() {
  return (
    <p className="rounded-xl border border-border bg-surface p-4 text-sm">
      Draft: this page is a placeholder and must be replaced with legally reviewed text before launch.
    </p>
  );
}
