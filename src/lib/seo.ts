import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export type HreflangMap = Partial<Record<"en-US" | "en-GB" | "en-AU" | "x-default", string>>;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Path starting with "/", used for canonical + OG url. */
  path: string;
  /** hreflang alternates: language -> path. */
  languages?: HreflangMap;
  noindex?: boolean;
}

/** One place that produces canonical, hreflang, Open Graph and Twitter metadata. */
export function buildMetadata({ title, description, path, languages, noindex }: BuildMetadataInput): Metadata {
  const languageUrls = languages
    ? Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, absoluteUrl(v as string)]))
    : undefined;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path), languages: languageUrls },
    openGraph: { title, description, url: absoluteUrl(path), siteName: siteConfig.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
