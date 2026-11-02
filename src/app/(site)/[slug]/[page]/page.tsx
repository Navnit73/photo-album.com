import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingView } from "@/components/marketing/landing-view";
import { markets, type MarketCode } from "@/config/markets";
import { countryPages, countrySlugs, hasGlobalCounterpart, type CountrySlug } from "@/config/country-pages";
import { landingBySlug } from "@/config/landing-pages";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  // First segment is the country code, second is the page slug.
  return (Object.keys(markets) as MarketCode[]).flatMap((country) => countrySlugs.map((page) => ({ slug: country, page })));
}

function resolve(country: string, slug: string) {
  if (!(country in markets) || !(countrySlugs as readonly string[]).includes(slug)) return null;
  const c = country as MarketCode;
  const s = slug as CountrySlug;
  return { market: markets[c], page: countryPages[c][s], slug: s };
}

export async function generateMetadata({ params }: PageProps<"/[slug]/[page]">): Promise<Metadata> {
  const { slug: country, page: slug } = await params;
  const r = resolve(country, slug);
  if (!r) return {};
  return buildMetadata({
    title: r.page.seoTitle,
    description: r.page.seoDescription,
    path: `/${country}/${slug}`,
    languages: {
      "en-US": `/us/${slug}`, "en-GB": `/uk/${slug}`, "en-AU": `/au/${slug}`,
      ...(hasGlobalCounterpart[r.slug] ? { "x-default": `/${slug}` } : {}),
    },
  });
}

export default async function CountryLandingPage({ params }: PageProps<"/[slug]/[page]">) {
  const { slug: country, page: slug } = await params;
  const r = resolve(country, slug);
  if (!r) notFound();
  const related = [
    ...(landingBySlug[r.slug] ? [{ href: `/${r.slug}`, label: `${landingBySlug[r.slug].navLabel} (global)` }] : []),
    ...countrySlugs.filter((s) => s !== r.slug).slice(0, 3).map((s) => ({
      href: `/${country}/${s}`, label: countryPages[r.market.code][s].h1.split(",")[0].replace(/^Preparing a /, ""),
    })),
  ];
  return (
    <LandingView
      crumbs={[{ name: "Home", href: "/" }, { name: r.market.name, href: `/${country}/photo-album` }, { name: r.page.h1, href: `/${country}/${slug}` }]}
      h1={r.page.h1}
      intro={r.page.intro}
      sections={r.page.sections}
      faqs={r.page.faqs}
      related={related}
      countryNote={`${r.market.name} · ${r.market.currency}`}
    />
  );
}
