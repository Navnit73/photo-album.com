import type { MarketCode } from "./markets";
import type { FaqItem, LandingSection } from "./landing-pages";

/**
 * Country landing pages. Content is genuinely market-specific (paper sizes, units,
 * seasons, local occasions, privacy context). Do NOT add a country page unless it has
 * distinct local value. Prices are intentionally NOT shown here; they come from the
 * pricing config/DB (Phase 5).
 */
export const countrySlugs = [
  "photo-album",
  "photo-album-maker",
  "wedding-photo-album",
  "family-photo-album",
  "photo-album-printing",
] as const;
export type CountrySlug = (typeof countrySlugs)[number];

/** Country slugs that also exist as a global page (used for hreflang x-default). */
export const hasGlobalCounterpart: Record<CountrySlug, boolean> = {
  "photo-album": true,
  "photo-album-maker": true,
  "wedding-photo-album": true,
  "family-photo-album": true,
  "photo-album-printing": false,
};

interface CountryPage {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  sections: LandingSection[];
  faqs: FaqItem[];
}

const printingBase: FaqItem = {
  q: "Do you print and deliver albums?",
  a: "Not yet. We do not offer physical printing or delivery today. You can design your album and export a PDF to use with a printer of your choice.",
};

export const countryPages: Record<MarketCode, Record<CountrySlug, CountryPage>> = {
  us: {
    "photo-album": {
      seoTitle: "Photo Albums in the US: Sizes, Styles and Online Maker",
      seoDescription: "Make a photo album online in US-friendly sizes like 8x8 and 8.5x11 in. Learn which album style suits your photos and how to prepare for printing.",
      h1: "Photo Albums for the United States",
      intro: "Choose a size and style that matches how Americans typically print and display photos, then build your album online.",
      sections: [
        { heading: "Common US album sizes", body: "Sizes are given in inches.", bullets: ["8 x 8 in: square, the most popular compact size.", "8.5 x 11 in: US Letter portrait, suits formal portraits and documents.", "11 x 8.5 in: US Letter landscape, ideal for travel and group photos.", "12 x 12 in: large square for statement albums."] },
        { heading: "Seasonal photo moments", body: "Many US families build albums around Thanksgiving, the winter holidays, graduations in spring and summer road trips. Group those photos into one section each." },
      ],
      faqs: [{ q: "Are albums sized in inches?", a: "Yes. US sizes are shown in inches." }, printingBase],
    },
    "photo-album-maker": {
      seoTitle: "Photo Album Maker for US Users: Letter and Square Sizes",
      seoDescription: "Use the photo album maker with US Letter and square presets in inches. Upload, design and export a PDF sized for your printer.",
      h1: "Photo Album Maker, US Sizes Built In",
      intro: "Start with a US preset so your pages are the right size for local print shops and home printers.",
      sections: [
        { heading: "US presets in the editor", body: "", bullets: ["US Letter portrait and landscape (8.5 x 11 in).", "Square 8 x 8 in and 12 x 12 in.", "Custom dimensions in inches."] },
        { heading: "Dollars, not guesswork", body: "Plans are billed in US dollars once paid plans launch. Pricing is shown clearly before you pay." },
      ],
      faqs: [{ q: "Can I set a custom size in inches?", a: "Yes. Custom dimensions are supported." }],
    },
    "wedding-photo-album": {
      seoTitle: "Wedding Photo Album in the US: Structure from Engagement to Reception",
      seoDescription: "Design a US wedding photo album that covers engagement photos, rehearsal dinner, ceremony and reception, with layout tips for each part.",
      h1: "Wedding Photo Album for US Weddings",
      intro: "American weddings often span several events. Organise the album so each one gets its own section.",
      sections: [
        { heading: "Sections for a US wedding weekend", body: "", bullets: ["Engagement photos or a save-the-date shoot.", "Bridal shower and bachelor or bachelorette events.", "Rehearsal dinner.", "Ceremony, portraits and reception."] },
        { heading: "Sizes", body: "8.5 x 11 in portrait works well for formal portraits; 11 x 8.5 in landscape suits reception and venue shots." },
      ],
      faqs: [{ q: "Can I include the rehearsal dinner?", a: "Yes. Give it its own section so guests find it easily." }],
    },
    "family-photo-album": {
      seoTitle: "Family Photo Album in the US: Holidays, Reunions and Road Trips",
      seoDescription: "Create a US family photo album organised around holidays, reunions and road trips, with caption ideas and size suggestions in inches.",
      h1: "Family Photo Album for US Families",
      intro: "Big gatherings and long road trips produce a lot of photos. Group them by event to keep the album easy to flip through.",
      sections: [
        { heading: "Events worth their own spread", body: "", bullets: ["Thanksgiving and winter holidays.", "Family reunions with a group photo page.", "Summer road trips and national park visits.", "School milestones and graduations."] },
        { heading: "Privacy in the US", body: "Your albums are private by default. Privacy rights vary by state, for example in California. See our privacy policy for details once published." },
      ],
      faqs: [{ q: "Which size is best for family albums?", a: "8 x 8 in is popular for casual albums; 8.5 x 11 in suits larger group photos." }],
    },
    "photo-album-printing": {
      seoTitle: "Photo Album Printing in the US: Prepare Your Album as a PDF",
      seoDescription: "Not yet printing albums ourselves, but you can design an album in US sizes and export a PDF for a printer. See what to check first.",
      h1: "Preparing a Photo Album for Printing in the US",
      intro: "We do not print or ship albums yet. Here is how to design so your album is ready to take to a printer.",
      sections: [
        { heading: "Checklist before you print", body: "", bullets: ["Confirm the printer's page size in inches.", "Ask about bleed and safe margins.", "Use high-resolution photos; around 300 dpi at print size is a common target.", "Ask whether they accept PDF and which colour profile they want."] },
        { heading: "Our printing status", body: "Print-ready export will be offered only when bleed, safe areas and colour handling are correctly supported. Until then, exports are standard digital PDFs." },
      ],
      faqs: [printingBase, { q: "What resolution should photos be?", a: "Around 300 dpi at the printed size is a common guideline, but check your printer." }],
    },
  },
  uk: {
    "photo-album": {
      seoTitle: "Photo Albums in the UK: A4 Sizes, Styles and Online Maker",
      seoDescription: "Make a personalised photo album online in A4, A5 or square sizes. Compare album styles and prepare your design for a UK printer.",
      h1: "Personalised Photo Albums for the UK",
      intro: "UK printers work in metric paper sizes, so start with A4 or A5 and design around them.",
      sections: [
        { heading: "Common UK album sizes", body: "Sizes shown in centimetres, with inches for reference.", bullets: ["A4 portrait: 21 x 29.7 cm (8.3 x 11.7 in).", "A4 landscape: 29.7 x 21 cm.", "A5: 14.8 x 21 cm (5.8 x 8.3 in), a compact, handbag-friendly size.", "Square 20 x 20 cm (about 8 x 8 in)."] },
        { heading: "UK moments", body: "Bank holiday weekends, seaside breaks, Christmas and school-year milestones make natural sections for a family album." },
      ],
      faqs: [{ q: "Are sizes in centimetres?", a: "Yes. UK sizes are shown in centimetres with inches for reference." }, printingBase],
    },
    "photo-album-maker": {
      seoTitle: "Photo Album Maker for UK Users: A4, A5 and Square",
      seoDescription: "Use the photo album maker with A4, A5 and square presets in centimetres. Upload, design and export a PDF sized for your printer.",
      h1: "Photo Album Maker, UK Sizes Built In",
      intro: "Pick a metric preset and your pages match what UK print shops expect.",
      sections: [
        { heading: "UK presets in the editor", body: "", bullets: ["A4 portrait and landscape.", "A5 portrait and landscape.", "Square 20 x 20 cm.", "Custom dimensions in centimetres or inches."] },
        { heading: "Pounds sterling", body: "Plans are billed in GBP once paid plans launch, with the full price shown before you pay." },
      ],
      faqs: [{ q: "Is the spelling British?", a: "Yes. Pages for UK visitors use British spelling, such as personalised and colour." }],
    },
    "wedding-photo-album": {
      seoTitle: "Wedding Photo Album in the UK: Ceremony, Wedding Breakfast and Evening",
      seoDescription: "Design a UK wedding photo album that follows the day: ceremony, confetti, wedding breakfast, speeches and the evening reception.",
      h1: "Personalised Wedding Photo Album for UK Weddings",
      intro: "UK weddings have a familiar running order. Mirror it in your album so the story is easy to follow.",
      sections: [
        { heading: "Running order for the pages", body: "", bullets: ["Getting ready and the arrival of guests.", "Ceremony and confetti.", "Group photographs and couple portraits.", "Wedding breakfast and speeches.", "Evening reception and first dance."] },
        { heading: "Sizes", body: "A4 portrait is a good fit for formal portraits; A4 landscape or square works for the evening party." },
      ],
      faqs: [{ q: "Is an A4 album a good size for a wedding?", a: "Yes. A4 gives portraits room without being unwieldy." }],
    },
    "family-photo-album": {
      seoTitle: "Family Photo Album in the UK: Holidays, Seaside Trips and Christmas",
      seoDescription: "Create a UK family photo album around school holidays, seaside trips, Christmas and family get-togethers, with A4 and A5 layout tips.",
      h1: "Personalised Family Photo Album for UK Families",
      intro: "From half-term days out to Christmas at the grandparents', group the year's photos into seasons.",
      sections: [
        { heading: "Seasonal sections", body: "", bullets: ["Easter and spring days out.", "Summer holidays and the seaside.", "Autumn half term and Bonfire Night.", "Christmas and New Year."] },
        { heading: "Privacy in the UK", body: "Your albums are private by default. UK GDPR gives you rights over your personal data; see our privacy policy once published." },
      ],
      faqs: [{ q: "Which size suits a family album?", a: "A5 is compact; A4 is better for group photos." }],
    },
    "photo-album-printing": {
      seoTitle: "Photo Album Printing in the UK: Prepare a PDF for Your Printer",
      seoDescription: "We do not print albums yet, but you can design in A4 or A5 and export a PDF. Learn what to check with a UK printer.",
      h1: "Preparing a Personalised Photo Album for Printing in the UK",
      intro: "We do not offer printing or delivery yet. Design in metric sizes and use this checklist with your printer.",
      sections: [
        { heading: "Checklist before you print", body: "", bullets: ["Confirm the page size, such as A4 or A5, in millimetres.", "Ask for bleed (often 3 mm) and safe margin guidance.", "Aim for around 300 dpi at the printed size.", "Check accepted file types and colour profile."] },
        { heading: "Our printing status", body: "We will describe exports as print-ready only when bleed, safe areas and colour handling are properly supported." },
      ],
      faqs: [printingBase, { q: "What is bleed?", a: "Extra image area beyond the page edge that is trimmed off after printing, so there is no white edge." }],
    },
  },
  au: {
    "photo-album": {
      seoTitle: "Photo Albums in Australia: A4 Sizes, Styles and Online Maker",
      seoDescription: "Make a personalised photo album online in Australian-standard A4 and A5 sizes. Pick a style and prepare your album for printing.",
      h1: "Personalised Photo Albums for Australia",
      intro: "Australia uses metric paper sizes, so A4 and A5 are the natural starting points for album design.",
      sections: [
        { heading: "Common Australian album sizes", body: "Sizes are in centimetres, with inches for reference.", bullets: ["A4 portrait: 21 x 29.7 cm.", "A4 landscape: 29.7 x 21 cm.", "A5: 14.8 x 21 cm.", "Square 20 x 20 cm (about 8 x 8 in)."] },
        { heading: "Australian moments", body: "Summer Christmas at the beach, road trips, Anzac Day and school holidays that fall in the warmer months are common album themes." },
      ],
      faqs: [{ q: "Are sizes in centimetres?", a: "Yes, with inches for reference." }, printingBase],
    },
    "photo-album-maker": {
      seoTitle: "Photo Album Maker for Australian Users: A4, A5 and Square",
      seoDescription: "Use the photo album maker with A4, A5 and square presets in centimetres. Design online and export a PDF for your preferred printer.",
      h1: "Photo Album Maker, Australian Sizes Built In",
      intro: "Metric presets match Australian printers, so your design lines up with what they expect.",
      sections: [
        { heading: "Australian presets in the editor", body: "", bullets: ["A4 and A5 in portrait or landscape.", "Square 20 x 20 cm.", "Custom dimensions in centimetres or inches."] },
        { heading: "Australian dollars", body: "Plans are billed in AUD once paid plans launch. The full price is shown before you pay." },
      ],
      faqs: [{ q: "Will pages use Australian spelling?", a: "Yes. We use spelling such as personalised, favourite and colour." }],
    },
    "wedding-photo-album": {
      seoTitle: "Wedding Photo Album in Australia: Beach, Vineyard and Backyard Weddings",
      seoDescription: "Design an Australian wedding photo album, with layout ideas for beach, vineyard and garden weddings and a summer-friendly structure.",
      h1: "Personalised Wedding Photo Album for Australian Weddings",
      intro: "Outdoor venues and golden light shape many Australian weddings. Use full-width spreads to show the setting.",
      sections: [
        { heading: "Layout ideas for outdoor weddings", body: "", bullets: ["Full-spread landscape for beach, vineyard or garden venues.", "Portrait pages for couple portraits in golden-hour light.", "Detail grids for florals, tables and signage.", "A guest page with candid photos from the day."] },
        { heading: "Seasons", body: "Peak wedding season runs through the Southern Hemisphere spring and summer. If you married in that window, consider a warm background tone." },
      ],
      faqs: [{ q: "Can I use A4 landscape?", a: "Yes. A4 landscape suits wide outdoor scenes." }],
    },
    "family-photo-album": {
      seoTitle: "Family Photo Album in Australia: Beach Days, Camping and Christmas",
      seoDescription: "Create an Australian family photo album around beach days, camping trips and a summer Christmas, with A4 and A5 layout tips.",
      h1: "Personalised Family Photo Album for Australian Families",
      intro: "Many Australian family memories come from outdoors. Group them by season and place.",
      sections: [
        { heading: "Section ideas", body: "", bullets: ["Summer Christmas and New Year.", "Beach days and holidays.", "Camping and road trips.", "School events and sports days."] },
        { heading: "Privacy in Australia", body: "Your albums are private by default. Australia's Privacy Act and the Australian Consumer Law apply to how businesses handle data and sales; see our policies once published." },
      ],
      faqs: [{ q: "Which size should I pick?", a: "A5 is compact; A4 landscape suits big group photos and scenery." }],
    },
    "photo-album-printing": {
      seoTitle: "Photo Album Printing in Australia: Prepare a PDF for Your Printer",
      seoDescription: "We do not print albums yet, but you can design to A4 or A5 and export a PDF. See what to check with an Australian printer.",
      h1: "Preparing a Personalised Photo Album for Printing in Australia",
      intro: "We do not currently print or deliver albums. Design to metric sizes and use this checklist with your printer.",
      sections: [
        { heading: "Checklist before you print", body: "", bullets: ["Confirm the page size in millimetres.", "Ask about bleed and safe margins.", "Aim for around 300 dpi at the printed size.", "Check accepted file types and the colour profile."] },
        { heading: "Our printing status", body: "We will only call an export print-ready when bleed, safe areas and colour are handled correctly." },
      ],
      faqs: [printingBase, { q: "Can I use A4?", a: "Yes. A4 is the standard paper size in Australia." }],
    },
  },
};
