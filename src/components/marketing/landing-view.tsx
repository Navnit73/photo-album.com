import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs, type Crumb } from "@/components/seo/breadcrumbs";
import type { FaqItem, LandingSection } from "@/config/landing-pages";

export interface RelatedLink { href: string; label: string }

export function LandingView({ crumbs, h1, intro, sections, faqs, related, countryNote }: {
  crumbs: Crumb[]; h1: string; intro: string; sections: LandingSection[]; faqs: FaqItem[];
  related: RelatedLink[]; countryNote?: string;
}) {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumbs items={crumbs} />
          {countryNote && <p className="mt-6 text-sm font-medium text-brand">{countryNote}</p>}
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p>
          <Link href="/editor/new" className={buttonVariants({ size: "lg", className: "mt-8" })}>Create Your Photo Album</Link>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-2xl md:text-3xl">{s.heading}</h2>
            {s.body && <p className="mt-3 text-muted-foreground">{s.body}</p>}
            {s.bullets && (
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section>
          <h2 className="text-2xl md:text-3xl">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {f.q}<ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <nav aria-label="Related pages">
            <h2 className="text-2xl md:text-3xl">Keep exploring</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {related.map((r) => (
                <li key={r.href}><Link href={r.href} className={buttonVariants({ variant: "outline" })}>{r.label}</Link></li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </>
  );
}
