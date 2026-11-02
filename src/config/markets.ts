export type MarketCode = "us" | "uk" | "au";

export interface Market {
  code: MarketCode;
  name: string;
  locale: "en-US" | "en-GB" | "en-AU";
  currency: "USD" | "GBP" | "AUD";
  units: "in" | "in-cm" | "cm-in";
}

export const markets: Record<MarketCode, Market> = {
  us: { code: "us", name: "United States", locale: "en-US", currency: "USD", units: "in" },
  uk: { code: "uk", name: "United Kingdom", locale: "en-GB", currency: "GBP", units: "in-cm" },
  au: { code: "au", name: "Australia", locale: "en-AU", currency: "AUD", units: "cm-in" },
};
