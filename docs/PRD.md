# Product Requirements Document — Photo Album Maker (US / UK / AU)

Status: Draft v1 · Owner: Navnit · Last updated: 2026-11-02

## 1. Summary

A commercial SaaS where users upload photos, design photo albums in a browser editor, save and share them digitally, and export PDFs. Launch markets: United States, United Kingdom, Australia. Growth is SEO-led; revenue comes from paid plans (and, later, print orders).

**Business objective:** a trustworthy, easy-to-use, SEO-driven platform that earns organic traffic in US/UK/AU and converts visitors to paying customers.

## 2. Goals and non-goals

**Goals**
1. Core album creation experience (upload → template → edit → export) works end to end before anything else is expanded.
2. Rank for photo-album keyword clusters with distinct, useful pages per intent and per market.
3. Private, secure handling of customer photos.
4. Prices, currencies and plan limits configurable per country (never hardcoded).

**Non-goals (v1)**
- Physical printing and shipping. Do not advertise or promise delivery until a print/fulfilment partner, shipping and returns are integrated. "Print-ready PDF" is only claimed once DPI, bleed, safe area, colour profile and page size are correctly handled.
- Native mobile apps.
- AI features (auto-layout / "AI album maker") — post-v1.
- Fake testimonials/reviews, ever.

## 3. Target users

| Persona | Need |
|---|---|
| Couple (wedding/anniversary) | Elegant album from wedding photos, shareable with family |
| Parent | Baby/family album, easy and quick |
| Traveller | Trip album from many photos |
| Gift giver | Personalised album for someone else |
| Hobby/pro photographer | Portfolio-style layouts, high-res export |

## 4. Markets and localisation

| | US | UK | AU |
|---|---|---|---|
| Currency | USD $ | GBP £ | AUD (A$) |
| Spelling | personalized, favorite, color | personalised, favourite, colour | personalised, favourite, colour |
| Units | inches | inches + cm | cm + inches |
| Example price points (NOT final) | 9.99 / 19.99 / 29.99 | 7.99 / 14.99 / 24.99 | 12.99 / 24.99 / 39.99 |

- URL prefixes `/us`, `/uk`, `/au`; hreflang `en-US`, `en-GB`, `en-AU`, plus `x-default` on the global page.
- Country pages must carry genuinely distinct local content (units, paper sizes such as A4 vs Letter, local occasions, pricing, regulations/consumer rights), not find-and-replace duplicates.
- Pricing lives in DB/config keyed by country + plan.

## 4a. Brand and design

Premium, editorial, minimalist. White backgrounds, soft neutral surfaces, rounded corners, subtle borders, few shadows. No gradients-heavy, glass, neon or gratuitous animation. Tokens in `docs/REFERENCE.md`.

## 5. Features

### 5.1 Marketing site (Phase 1–2)
Homepage sections: Hero, How it works (3 steps), Album categories (8), Templates, Features, Why choose us, Testimonials (demo-labelled only in dev; none published until real), FAQ, Final CTA.

Pages: Homepage, Photo Album Maker, Creator, Digital, Online, Templates, Design, Printing, Custom, Personalised, category pages (Wedding, Family, Baby, Travel, Birthday, Anniversary), Ideas, Pricing, About, Contact, FAQ, Blog, Login, Register, Dashboard, Privacy, Terms, Refund.

Rules: each page has one primary keyword/intent (see §7). Category pages only exist if they have distinct content and function. Transactional pages only for services actually offered.

### 5.2 Album editor (Phase 3) — the core product
- **Upload:** multi-file, drag-drop, preview, remove, reorder, add later. JPG/JPEG/PNG/WebP; HEIC where the pipeline supports it. Validate type, size, dimensions.
- **Layout:** left sidebar (Templates, Layouts, Backgrounds, Photos, Stickers, Text, Elements); centre canvas (page / spread preview, zoom, page nav); right sidebar (element settings, crop, fonts, background, alignment, spacing, layers).
- **Functions:** drag-drop positioning, crop, resize, rotate, text/captions, fonts, background colours/patterns, preset layouts, page duplicate/delete/reorder, undo/redo, autosave, preview mode, cover customisation, page numbers, save & continue later.
- **Formats:** square, landscape, portrait, custom; dimensions configurable so print providers can define their own.
- **Export:** page → image, album → PDF, high-res print-ready PDF (only when pipeline is correct), digital preview/share link.
- **Mobile:** dedicated simplified editor (page strip, bottom-sheet controls), not the desktop UI squeezed down.

### 5.3 Templates
Fields: id, name, slug, category, preview image, cover layout, page layouts, page count, dimensions, orientation, premium/free. Categories: Wedding, Family, Baby, Newborn, Birthday, Anniversary, Travel, Vacation, Couple, Graduation, Portfolio, Minimalist, Luxury. Start an album directly from a template.

### 5.4 Accounts and dashboard (Phase 4)
Sign up, login, Google, password reset, profile, saved projects, recent albums, uploaded photos, subscription status, download history. Dashboard: welcome, Create New Album, My Albums, Recent, Templates, Account settings, Billing. Reopen/edit saved projects. Users access only their own albums/images.

### 5.5 Pricing and payments (Phase 5)
Plans: Free (few projects, basic templates, page cap, standard export), Personal (more projects, premium templates, hi-res), Premium (advanced layouts, higher limits, print-ready export). Print tier only if fulfilment is integrated. Stripe checkout + signed webhooks, billing history. No "unlimited" claims unless operationally true.

### 5.6 Blog and admin (Phase 6)
Blog CMS fields: title, SEO title, meta description, slug, hero image + alt, content, author, published/updated dates, category, tags, related articles, FAQ, TOC. Admin: SEO management, templates, users, payments, analytics.

Initial articles: How to Make a Photo Album Online; 15 Creative Photo Album Ideas; How to Organize Digital Photos; Best Photo Album Ideas for Couples; Digital vs Printed Photo Albums; How to Create a Wedding Photo Album; Best Websites to Make Photo Albums; How to Preserve Old Family Photos.

## 6. Data model (MongoDB)

- **users**: name, email (unique), passwordHash / provider, country, preferredCurrency, createdAt
- **albums**: userId (idx), title, category, templateId, dimensions, orientation, pages[], cover, status, createdAt, updatedAt
- **templates**: name, slug (unique), category (idx), previewImage, dimensions, orientation, layouts, isPremium
- **uploadedImages**: userId, albumId (idx), originalKey, processedKey, width, height, format, fileSize, createdAt
- **payments**: userId, albumId?, amount, currency, provider, status, transactionId (unique), createdAt
- **pricing**: country, plan, currency, amount, active (config-driven prices)
- **posts**: blog CMS fields above

Store object-storage keys, not public URLs; serve via signed URLs.

## 7. SEO plan

Keyword clusters: (1) primary album keywords, (2) long-tail how-to/intent, (3) wedding, (4) family/personal occasions, (5) digital/sharing, (6) commercial.

Mapping principles:
- One primary intent per URL; long-tail → blog; wedding/family/etc. → dedicated landing pages.
- `/photo-album` hub; `/photo-album-maker` tool page; `/photo-album-creator`, `/online-photo-album`, `/digital-photo-album` must each be differentiated (avoid cannibalisation) or consolidated/canonicalised.
- Country pages: `/{us|uk|au}/photo-album`, `/photo-album-maker`, `/wedding-photo-album`, `/family-photo-album`, `/photo-album-printing` — printing pages only once printing exists (until then, framed as "print-ready PDF / where to print").
- Technical: Metadata API, canonicals, hreflang, sitemap, robots, OG/Twitter, Breadcrumb/Article/Organization schema, Product schema only for real products, FAQ schema when eligible, alt text, semantic HTML, internal links, pagination SEO, redirects.

## 8. Security and privacy

Secure uploads (type/size/dimension validation, rate limits), private object storage with signed URLs, authz on every private route, input validation (Zod), verified payment webhooks, retention and deletion policy shown to users, cleanup jobs for orphaned uploads. No use of customer photos for AI training or marketing without explicit consent.

## 9. Performance and accessibility

Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1. SSR/SSG for marketing pages, dynamic for dashboard, editor loaded as a separate route/bundle (dynamic import), next/image, optimised fonts, minimal third-party scripts. WCAG 2.1 AA: labels, keyboard nav, focus states, loading/empty/error states, confirmations.

## 10. Tech stack

Next.js (App Router) · TypeScript · React · Tailwind v4 · shadcn/ui · Lucide · MongoDB · Auth.js · Zustand · Zod + React Hook Form · Sharp · Konva (or Fabric) · S3/R2 · Stripe · Resend · Ubuntu VPS/AWS/Cloudflare with PM2 + Nginx.

## 11. Phases and acceptance

| Phase | Scope | Done when |
|---|---|---|
| 1 Foundation | Setup, design system, shadcn, header/footer, homepage, responsive | Homepage matches spec, responsive, builds clean |
| 2 SEO pages | Landing + country + category pages, metadata, sitemap, schema, linking | Unique metadata per page, valid sitemap/hreflang |
| 3 Editor | Upload, templates, canvas, manipulation, pages, undo/redo, autosave | User can build and reopen a multi-page album |
| 4 Users | Auth, dashboard, storage, projects, settings | Private per-user albums persisted in MongoDB |
| 5 Export & payments | PDF, hi-res, Stripe, webhooks, billing | Paid user exports PDF; webhooks verified |
| 6 Blog & admin | CMS, SEO, templates/users/payments admin, analytics | Admin can publish a post with full SEO fields |
| 7 Test & deploy | Unit/integration/E2E, SEO/perf/security audits, deploy | Audits pass; production runbook complete |

## 12. Open questions

- Final pricing and plan limits per market.
- Print/fulfilment partner (and whether to offer printing at all in v1).
- Konva vs Fabric (leaning Konva: React bindings via react-konva).
- HEIC conversion approach (server-side Sharp/libheif vs client-side).
- Domain/brand name finalisation.
