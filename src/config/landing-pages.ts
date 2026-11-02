/**
 * Global (non-country) landing pages. Each page owns ONE search intent:
 *  - photo-album            -> broad hub / ideas to pick the right album
 *  - photo-album-maker      -> the tool: how the editor works, step by step
 *  - photo-album-creator    -> design control: what you can customise
 *  - online-photo-album     -> browser-based, nothing to install, any device
 *  - digital-photo-album    -> viewing & sharing a digital album
 *  - photo-album-templates  -> browse starting points
 *  - occasion pages         -> wedding / family / baby / travel / birthday / anniversary
 * Do not add pages that duplicate these intents; extend the existing page instead.
 */
export interface FaqItem { q: string; a: string }
export interface LandingSection { heading: string; body: string; bullets?: string[] }
export interface LandingPage {
  slug: string;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  sections: LandingSection[];
  faqs: FaqItem[];
  related: string[];
}

export const landingPages: LandingPage[] = [
  {
    slug: "photo-album",
    navLabel: "Photo Album",
    seoTitle: "Photo Albums: Ideas, Styles and How to Make Yours",
    seoDescription:
      "Explore photo album styles, formats and ideas, then build your own online. Compare digital and printed albums and pick the right layout for your photos.",
    h1: "Photo Albums for the Moments You Want to Keep",
    intro:
      "A good photo album turns a pile of pictures into a story. Whether you want something to flick through on a screen or a design you can take to a printer, start by choosing the style and shape that suits your photos.",
    sections: [
      {
        heading: "Choose the right kind of photo album",
        body: "Different occasions suit different albums. Think about who will look at it and how.",
        bullets: [
          "Story albums: one chronological narrative, such as a holiday or first year.",
          "Highlight albums: a small number of your best photographs, one or two per page.",
          "Collage albums: many casual photos per page, ideal for events with lots of guests.",
          "Portfolio albums: clean, minimal pages that let the photography lead.",
        ],
      },
      {
        heading: "Pick a format before you pick photos",
        body: "Square albums suit social-style photos, landscape suits scenery and group shots, and portrait suits people and formal photography. Choosing the format first means you will not have to re-crop every picture later.",
      },
      {
        heading: "Digital first, print when you are ready",
        body: "You can design, save and share a digital album today. If you plan to print, export a PDF and check the size and resolution with your chosen printer. We do not currently offer physical printing or delivery.",
      },
    ],
    faqs: [
      { q: "How many photos should a photo album have?", a: "Most albums work well with 20 to 60 photos. Fewer, better photos usually read better than every picture from the day." },
      { q: "Is a digital album better than a printed one?", a: "They do different jobs. Digital albums are quick to share and edit; printed albums are keepsakes. Many people make both from the same design." },
    ],
    related: ["photo-album-maker", "photo-album-templates", "digital-photo-album"],
  },
  {
    slug: "photo-album-maker",
    navLabel: "Photo Album Maker",
    seoTitle: "Photo Album Maker: Make an Album from Your Photos",
    seoDescription:
      "Use our photo album maker to upload pictures, drop them into designed pages, add captions and save your album. See exactly how the editor works.",
    h1: "Photo Album Maker: From Upload to Finished Album",
    intro:
      "Our photo album maker walks you through the whole process in one place. Here is what to expect, in order, so you can get from a folder of photos to a finished album quickly.",
    sections: [
      {
        heading: "How the photo album maker works",
        body: "The editor is built around four steps.",
        bullets: [
          "Upload: drag in your photos or choose them from your device.",
          "Start: pick a template or begin with an empty page and a layout.",
          "Arrange: drag photos into frames, crop, rotate and add captions.",
          "Finish: preview the spreads, then save, share or export a PDF.",
        ],
      },
      {
        heading: "Built for people who are not designers",
        body: "Layouts keep spacing and alignment tidy for you, so photos line up even when you are placing them quickly. You can always override a layout and place things freely.",
      },
      {
        heading: "Your work is saved as you go",
        body: "Albums autosave to your account, so you can close the tab and continue later on the same or another device.",
      },
    ],
    faqs: [
      { q: "Do I need to install anything?", a: "No. The photo album maker runs in your browser." },
      { q: "What formats can I upload?", a: "JPG, PNG and WebP. HEIC support will be shown in the editor if available for your device." },
    ],
    related: ["photo-album-creator", "photo-album-templates", "online-photo-album"],
  },
  {
    slug: "photo-album-creator",
    navLabel: "Photo Album Creator",
    seoTitle: "Photo Album Creator: Customise Covers, Layouts and Text",
    seoDescription:
      "Design every detail of your album: covers, page layouts, backgrounds, fonts and captions. See the customisation tools in the photo album creator.",
    h1: "Photo Album Creator: Design Every Page Your Way",
    intro:
      "If you care about how your album looks, the creator gives you control over every page. This page covers the design tools; if you want the quick start, see the photo album maker.",
    sections: [
      {
        heading: "Customisation tools",
        body: "Everything is editable on each page, and changes can be undone.",
        bullets: [
          "Covers: choose a cover photo, title and text style.",
          "Layouts: switch between grid, full-bleed and mixed layouts without losing photos.",
          "Backgrounds: solid colours and subtle patterns, per page or for the whole album.",
          "Typography: fonts, sizes, alignment and spacing for captions and titles.",
          "Layers: bring photos and text forward or send them back.",
        ],
      },
      {
        heading: "Design tips for a polished album",
        body: "Keep one or two fonts, repeat the same margins, and leave white space around your strongest photo on each spread. Consistency makes an album feel professional.",
      },
    ],
    faqs: [
      { q: "Can I change a layout after adding photos?", a: "Yes. Photos are kept when you switch layouts." },
      { q: "Can I use my own fonts?", a: "Custom font uploads are not available yet. A curated set of fonts is included." },
    ],
    related: ["photo-album-maker", "photo-album-templates", "wedding-photo-album"],
  },
  {
    slug: "online-photo-album",
    navLabel: "Online Photo Album",
    seoTitle: "Online Photo Album: Create and Edit in Your Browser",
    seoDescription:
      "Make an online photo album with nothing to install. Work on any device, save to your account and pick up where you left off.",
    h1: "Online Photo Album: Make It Anywhere, Keep It Safe",
    intro:
      "An online photo album lives in your account rather than on one computer. That means you can start on a laptop, tweak on a tablet and share from your phone.",
    sections: [
      {
        heading: "What makes an album online",
        body: "Your projects and photos are stored in your account, not in a file you have to carry around.",
        bullets: [
          "No software to install or update.",
          "Autosave, so a closed tab does not lose your work.",
          "Open the same album from any modern browser.",
          "Delete photos and albums yourself at any time.",
        ],
      },
      {
        heading: "Privacy by default",
        body: "Albums are private unless you choose to share them. We will explain how long photos are kept and how to delete them in our privacy policy.",
      },
    ],
    faqs: [
      { q: "Can I use it on my phone?", a: "Yes, with a simplified mobile editor for arranging and captioning photos." },
      { q: "Who can see my album?", a: "Only you, until you create a share link." },
    ],
    related: ["digital-photo-album", "photo-album-maker", "photo-album"],
  },
  {
    slug: "digital-photo-album",
    navLabel: "Digital Photo Album",
    seoTitle: "Digital Photo Album: Create, View and Share Online",
    seoDescription:
      "Create a digital photo album you can view on any screen and share with a private link. Learn how digital albums compare with printed ones.",
    h1: "Digital Photo Album: Easy to View, Easy to Share",
    intro:
      "A digital photo album is made to be looked at on screens and passed around. This page focuses on viewing and sharing; to learn how to build one, see the photo album maker.",
    sections: [
      {
        heading: "Why choose a digital album",
        body: "",
        bullets: [
          "Share with family anywhere using a private link.",
          "Update or add pages after you have sent it.",
          "No printing time or cost to get started.",
          "Keep a single design you can later export as a PDF.",
        ],
      },
      {
        heading: "Digital vs printed",
        body: "Digital albums win on speed and reach; printed albums win as physical keepsakes. If you want both, design once and export a PDF to take to a printer. Always check the printer's size and resolution requirements.",
      },
    ],
    faqs: [
      { q: "How do I share a digital photo album?", a: "Create a private share link from your album and send it to anyone you choose." },
      { q: "Can people download my photos?", a: "Sharing settings will let you control this. Downloads are off unless you enable them." },
    ],
    related: ["online-photo-album", "photo-album-maker", "photo-album"],
  },
  {
    slug: "photo-album-templates",
    navLabel: "Photo Album Templates",
    seoTitle: "Photo Album Templates for Weddings, Family and Travel",
    seoDescription:
      "Browse photo album templates by occasion, size and style. Start from a designed layout and replace the placeholders with your own photos.",
    h1: "Photo Album Templates to Start From",
    intro:
      "Templates give you designed covers and pages so you are never facing a blank canvas. Choose by occasion, then adjust anything you like.",
    sections: [
      {
        heading: "Browse by occasion",
        body: "Template categories include wedding, family, baby and newborn, birthday, anniversary, travel and vacation, couple, graduation, portfolio, minimalist and luxury.",
      },
      {
        heading: "What each template includes",
        body: "",
        bullets: [
          "A cover layout and a set of page layouts.",
          "A stated page count, size and orientation.",
          "Free or premium status, shown before you start.",
        ],
      },
    ],
    faqs: [
      { q: "Can I edit a template?", a: "Yes. Every layout, colour and text box is editable." },
      { q: "Are all templates free?", a: "Some are free and some are premium. This is shown on each template." },
    ],
    related: ["photo-album-maker", "photo-album-creator", "wedding-photo-album"],
  },
  {
    slug: "wedding-photo-album",
    navLabel: "Wedding Photo Album",
    seoTitle: "Wedding Photo Album: Design Your Wedding Day Story",
    seoDescription:
      "Plan and design a wedding photo album: what to include, how to order the day, and layouts that suit portraits, candids and details.",
    h1: "Wedding Photo Album: Tell the Day in Order",
    intro:
      "Wedding photographs deserve more than a folder. Structure the album as the day unfolded and give your best portraits room to breathe.",
    sections: [
      {
        heading: "A simple structure that works",
        body: "",
        bullets: [
          "Getting ready and details: rings, dress, flowers, venue.",
          "Ceremony: aisle, vows, first kiss.",
          "Portraits: couple, family groups, wedding party.",
          "Reception: speeches, first dance, candid moments.",
        ],
      },
      {
        heading: "Layouts for wedding photography",
        body: "Give portrait-orientation photos a full page, pair detail shots in grids, and use full-bleed spreads for landscape scenes like the venue or the dance floor.",
      },
      {
        heading: "Sharing with guests",
        body: "A private digital link lets family who could not attend see the day. If you want a printed album, export a PDF and confirm specifications with your printer.",
      },
    ],
    faqs: [
      { q: "How many photos go in a wedding album?", a: "Around 40 to 100 photos across 20 to 40 pages is common, depending on how many you want per spread." },
      { q: "Can I use my photographer's images?", a: "Check your photographer's licence. Most clients receive personal-use rights, which usually covers making an album." },
    ],
    related: ["anniversary-photo-album", "photo-album-templates", "photo-album-creator"],
  },
  {
    slug: "family-photo-album",
    navLabel: "Family Photo Album",
    seoTitle: "Family Photo Album: Organise Your Family Memories",
    seoDescription:
      "Create a family photo album that brings generations together. Ideas for structure, captions and combining old and new photos.",
    h1: "Family Photo Album: Memories Across Generations",
    intro:
      "A family album works best when it is organised around people and years, with captions that explain who and when, written while you still remember.",
    sections: [
      {
        heading: "Ways to organise a family album",
        body: "",
        bullets: [
          "By year: one spread per year with highlights.",
          "By person: a page or spread for each family member.",
          "By tradition: holidays, birthdays and reunions.",
          "By generation: mix scanned older photos with recent ones.",
        ],
      },
      {
        heading: "Add captions while you can",
        body: "Names, places and dates are the first things to be forgotten. A short caption under each photo makes the album more valuable for the next generation.",
      },
    ],
    faqs: [
      { q: "Can I add scanned old photos?", a: "Yes. Upload scans as images. Higher-resolution scans look better, especially when enlarged." },
      { q: "Can relatives add photos?", a: "Collaborative albums are not available yet." },
    ],
    related: ["baby-photo-album", "birthday-photo-album", "photo-album"],
  },
  {
    slug: "baby-photo-album",
    navLabel: "Baby Photo Album",
    seoTitle: "Baby Photo Album: Capture the First Year",
    seoDescription:
      "Make a baby photo album with month-by-month pages, milestones and captions. Includes layout ideas for newborn and first-year photos.",
    h1: "Baby Photo Album: The First Year, Month by Month",
    intro:
      "Babies change fast. A month-by-month layout shows growth at a glance and leaves space for the small details you would otherwise forget.",
    sections: [
      {
        heading: "Pages worth including",
        body: "",
        bullets: [
          "Newborn: hands, feet and the first days at home.",
          "Monthly pages with the same pose for easy comparison.",
          "Milestones: first smile, first foods, first steps.",
          "Family: grandparents and siblings meeting the baby.",
        ],
      },
      {
        heading: "Captions that matter later",
        body: "Add the date, weight or a one-line note about what happened. Those notes become the best part of the album.",
      },
    ],
    faqs: [
      { q: "How many pages for a first-year album?", a: "Twelve monthly spreads plus a cover and a few milestone pages is a good starting point." },
      { q: "Is it safe to upload baby photos?", a: "Albums are private by default and you can delete photos at any time." },
    ],
    related: ["family-photo-album", "birthday-photo-album", "photo-album-templates"],
  },
  {
    slug: "travel-photo-album",
    navLabel: "Travel Photo Album",
    seoTitle: "Travel Photo Album: Turn Your Trip into a Story",
    seoDescription:
      "Build a travel photo album that follows your route, with landscape spreads, map-style structure and captions for every stop.",
    h1: "Travel Photo Album: Follow the Journey",
    intro:
      "Trips come with hundreds of near-identical photos. A travel album is about choosing, grouping by place and letting your best landscapes run across a full spread.",
    sections: [
      {
        heading: "Structure by place",
        body: "",
        bullets: [
          "One section per destination, in the order you travelled.",
          "An opening spread with your favourite photo of the whole trip.",
          "Full-bleed landscapes for views, grids for food and small details.",
          "Captions with place names and dates.",
        ],
      },
      {
        heading: "Pick fewer, better photos",
        body: "Choose one standout photo per place first, then add supporting shots. Landscape orientation is usually the best album format for travel.",
      },
    ],
    faqs: [
      { q: "Can I upload photos from my phone?", a: "Yes, from the browser on your phone or computer." },
      { q: "Can I add maps?", a: "Maps are not built in yet. You can upload a screenshot of a map as an image." },
    ],
    related: ["photo-album-templates", "photo-album-creator", "photo-album"],
  },
  {
    slug: "birthday-photo-album",
    navLabel: "Birthday Photo Album",
    seoTitle: "Birthday Photo Album: Ideas for Milestone Celebrations",
    seoDescription:
      "Create a birthday photo album for a milestone year or a first birthday. Ideas for then-and-now layouts and party photo pages.",
    h1: "Birthday Photo Album: Celebrate Every Year",
    intro:
      "Birthday albums work two ways: as a record of one party, or as a gift that looks back across a lifetime.",
    sections: [
      {
        heading: "Birthday album ideas",
        body: "",
        bullets: [
          "Then and now: matching photos from different years side by side.",
          "Year-by-year: one photo per birthday from birth to today.",
          "The party: decorations, cake, guests and candid moments.",
          "Messages: add short notes from friends and family as text.",
        ],
      },
    ],
    faqs: [
      { q: "Can I make one as a gift?", a: "Yes. Build the album in your account and share it with a private link." },
    ],
    related: ["family-photo-album", "baby-photo-album", "anniversary-photo-album"],
  },
  {
    slug: "anniversary-photo-album",
    navLabel: "Anniversary Photo Album",
    seoTitle: "Anniversary Photo Album: A Couple's Story in Photos",
    seoDescription:
      "Make an anniversary photo album that follows a relationship from first photo to today, with ideas for layouts, captions and gifts.",
    h1: "Anniversary Photo Album: Your Story So Far",
    intro:
      "An anniversary album is a gift made of shared history. Arrange it by year, by place or by moments that only the two of you will understand.",
    sections: [
      {
        heading: "Ideas for the pages",
        body: "",
        bullets: [
          "The beginning: first photo together, first trip.",
          "Milestones: moving in, engagements, weddings, family.",
          "Small moments: everyday photos that show your life.",
          "A final page with a note to your partner.",
        ],
      },
    ],
    faqs: [
      { q: "How many photos should I include?", a: "One photo per year of marriage is a lovely rule for milestone anniversaries." },
    ],
    related: ["wedding-photo-album", "birthday-photo-album", "photo-album-templates"],
  },
];

export const landingBySlug = Object.fromEntries(landingPages.map((p) => [p.slug, p])) as Record<string, LandingPage>;
