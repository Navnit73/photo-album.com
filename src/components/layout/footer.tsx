import Link from "next/link";
import { Suspense } from "react";
import { footerNav, siteConfig } from "@/config/site";

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-1">
          <p className="font-serif text-xl font-semibold">{siteConfig.name}</p>
          <p className="mt-3 text-sm text-muted-foreground">Beautiful photo albums, made online.</p>
        </div>
        {Object.entries(footerNav).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="text-sm font-medium">{title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {links.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-foreground">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © <Suspense fallback={null}><CopyrightYear /></Suspense> {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
