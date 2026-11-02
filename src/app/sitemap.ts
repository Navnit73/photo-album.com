import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { landingPages } from "@/config/landing-pages";
import { countrySlugs, hasGlobalCounterpart } from "@/config/country-pages";
import { markets, type MarketCode } from "@/config/markets";

export default function sitemap(): MetadataRoute.Sitemap {
  const codes = Object.keys(markets) as MarketCode[];
  const langs = (slug: string, withDefault: boolean) => ({
    "en-US": absoluteUrl(`/us/${slug}`),
    "en-GB": absoluteUrl(`/uk/${slug}`),
    "en-AU": absoluteUrl(`/au/${slug}`),
    ...(withDefault ? { "x-default": absoluteUrl(`/${slug}`) } : {}),
  });
  const isCountrySlug = (s: string) => (countrySlugs as readonly string[]).includes(s);

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...landingPages.map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(isCountrySlug(p.slug) ? { alternates: { languages: langs(p.slug, true) } } : {}),
    })),
    ...codes.flatMap((c) =>
      countrySlugs.map((s) => ({
        url: absoluteUrl(`/${c}/${s}`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: langs(s, hasGlobalCounterpart[s]) },
      })),
    ),
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.4 },
  ];
}
