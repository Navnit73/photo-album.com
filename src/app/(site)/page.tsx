import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/marketing/section";
import { AlbumPreview } from "@/components/marketing/album-preview";
import { steps, categories, templates, features, reasons, faqs } from "@/config/home";

export default function HomePage() {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl leading-tight md:text-6xl">Create Beautiful Photo Albums Online</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Turn your favourite memories into beautiful personalized photo albums. Upload your photos, choose a design,
              customize every page, and create an album worth keeping forever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/editor/new" className={buttonVariants({ size: "lg" })}>Create Your Photo Album</Link>
              <Link href="/photo-album-templates" className={buttonVariants({ size: "lg", variant: "outline" })}>Explore Templates</Link>
            </div>
          </div>
          <AlbumPreview />
        </div>
      </section>

      <Section title="How It Works" intro="Three simple steps from camera roll to finished album.">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border p-6">
              <s.icon className="size-6 text-brand" aria-hidden />
              <p className="mt-4 text-sm text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Albums for Every Story" tone="surface">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <li key={c.name}>
              <Link href={c.href} className="group block">
                <div className={`${c.tone} aspect-[4/5] rounded-2xl border border-border`} />
                <p className="mt-3 text-sm font-medium group-hover:underline">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Photo Album Templates" intro="Start from a professionally designed layout and make it yours.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <li key={t.name} className="overflow-hidden rounded-2xl border border-border">
              <div className="aspect-[4/3] bg-surface" />
              <div className="p-5">
                <h3 className="text-lg">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.category} · {t.pages} pages · {t.orientation}</p>
                <Link href="/editor/new" className={buttonVariants({ variant: "outline", className: "mt-4" })}>Create Album</Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Everything You Need" tone="surface">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <li key={f.title}>
              <f.icon className="size-5 text-brand" aria-hidden />
              <h3 className="mt-3 text-base font-sans font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Why Choose Us?">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <li key={r.title} className="rounded-2xl border border-border p-6">
              <r.icon className="size-5 text-brand" aria-hidden />
              <h3 className="mt-3 text-lg">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Testimonials intentionally omitted: only real customer reviews will be published. */}

      <Section title="Frequently Asked Questions" tone="surface" id="faq">
        <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-background">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl md:text-4xl">Your Memories Deserve More Than a Camera Roll.</h2>
          <Link href="/editor/new" className={buttonVariants({ size: "lg", className: "mt-8" })}>Create Your Photo Album</Link>
        </div>
      </section>
    </>
  );
}
