import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingView } from "@/components/marketing/landing-view";
import { landingPages, landingBySlug } from "@/config/landing-pages";
import { countrySlugs, hasGlobalCounterpart, type CountrySlug } from "@/config/country-pages";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return landingPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = landingBySlug[slug];
  if (!page) return {};
  const hasCountries = (countrySlugs as readonly string[]).includes(slug) && hasGlobalCounterpart[slug as CountrySlug];
  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/${slug}`,
    languages: hasCountries
      ? { "en-US": `/us/${slug}`, "en-GB": `/uk/${slug}`, "en-AU": `/au/${slug}`, "x-default": `/${slug}` }
      : undefined,
  });
}

export default async function LandingPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = landingBySlug[slug];
  if (!page) notFound();
  return (
    <LandingView
      crumbs={[{ name: "Home", href: "/" }, { name: page.navLabel, href: `/${slug}` }]}
      h1={page.h1}
      intro={page.intro}
      sections={page.sections}
      faqs={page.faqs}
      related={page.related.map((r) => ({ href: `/${r}`, label: landingBySlug[r].navLabel }))}
    />
  );
}
