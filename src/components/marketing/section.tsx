import type { ReactNode } from "react";

export function Section({ title, intro, children, tone = "white", id }: {
  title: string; intro?: string; children: ReactNode; tone?: "white" | "surface"; id?: string;
}) {
  return (
    <section id={id} className={tone === "surface" ? "bg-surface" : ""}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">{title}</h2>
          {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
