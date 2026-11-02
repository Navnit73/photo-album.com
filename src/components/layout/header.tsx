import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { mainNav, siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-none">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
          {mainNav.map((i) => (
            <Link key={i.href} href={i.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>Log in</Link>
          <Link href="/editor/new" className={buttonVariants()}>Create Album</Link>
        </div>
        <details className="group relative md:hidden">
          <summary aria-label="Open menu" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border">
            <Menu className="size-5" />
          </summary>
          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-background p-3 shadow-sm">
            <nav aria-label="Mobile" className="flex flex-col">
              {mainNav.map((i) => (
                <Link key={i.href} href={i.href} className="rounded-md px-3 py-2 text-sm hover:bg-surface">{i.label}</Link>
              ))}
              <Link href="/login" className="rounded-md px-3 py-2 text-sm hover:bg-surface">Log in</Link>
            </nav>
            <Link href="/editor/new" className={buttonVariants({ className: "mt-2 w-full" })}>Create Album</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
