# Future Reference — Photo Album Maker

Working notes for anyone (human or AI) continuing this project. Product intent lives in [PRD.md](PRD.md); this file holds conventions, decisions and status.

## Rules of engagement
- Next.js here is a recent major version with breaking changes: read `node_modules/next/dist/docs/` before using unfamiliar APIs (see [AGENTS.md](../AGENTS.md)).
- Server Components by default; `"use client"` only for interactivity (editor, menus, forms).
- Never hardcode prices, currencies or plan limits — read from `src/config` / DB.
- Never fabricate testimonials/reviews. Demo content must be visibly labelled and removed before launch.
- Don't promise physical printing/delivery or "print-ready" quality until implemented.
- Don't create near-duplicate country/keyword pages; each needs distinct value.
- Validate every API input with Zod; authorise every private route; store storage keys, serve signed URLs.

## Design tokens
| Token | Hex |
|---|---|
| primary / text | #292725 |
| secondary | #6F6258 |
| background | #FFFFFF |
| surface | #F8F6F3 |
| accent | #B88C65 |
| muted text | #77716B |
| border | #EAE6E1 |
| success | #27845B |
| error | #D64545 |

Tailwind utilities: `bg-surface`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-brand`, etc. (defined via `@theme` in `src/app/globals.css`).
Fonts: headings Playfair Display (`font-serif`), body/buttons Geist Sans (`font-sans`). Use serif selectively. Primary CTAs are dark charcoal; rounded corners, subtle borders, minimal shadows, no gradients/glass.

## Planned structure
```
src/
  app/
    (marketing)/        # homepage + landing pages (SSG)
    [country]/          # us | uk | au localised pages
    blog/
    (auth)/login, register
    dashboard/
    editor/[albumId]/   # separate bundle, client-heavy
    api/                # route handlers (Zod-validated)
  components/
    ui/                 # shadcn
    layout/             # Header, Footer
    marketing/          # Hero, HowItWorks, Categories, ...
    editor/
    seo/                # JsonLd, Breadcrumbs
  config/               # site, nav, markets (currency/spelling/units), pricing defaults
  lib/                  # db, auth, storage, stripe, seo helpers
  models/               # Mongo schemas
  stores/               # Zustand
docs/                   # PRD.md, REFERENCE.md
```

## Markets config
`src/config/markets.ts` is the single source for US/UK/AU: locale (`en-US`/`en-GB`/`en-AU`), currency, spelling variants, units. Example prices in the PRD are placeholders, not confirmed.

## Status log
| Date | Phase | Notes |
|---|---|---|
| 2026-11-02 | 1 | create-next-app (Next 16, React 19, Tailwind v4, TS, ESLint, src dir). PRD + reference written. Foundation + homepage done. |
| 2026-11-02 | 2 | SEO layer done: `lib/seo.ts` (canonical/hreflang/OG), JSON-LD (Organization, BreadcrumbList), sitemap/robots, 12 global landing pages, 15 country pages (5 slugs x US/UK/AU), faq/about/contact + draft legal pages. |
| 2026-11-02 | 3 | Editor built (client-only, local IndexedDB persistence). Verified with a Playwright run in Chrome (upload validation, templates, layouts, drag/select/delete, undo/redo, page add/dup/move/delete, spread + preview, PNG export, autosave + reload, mobile tabs). |

## Decisions
- Canvas library: Konva (react-konva) — revisit at Phase 3 start.
- Package manager: npm.
- Tailwind v4 is CSS-configured (no tailwind.config.js).

## SEO implementation notes
- `buildMetadata()` in `src/lib/seo.ts` is the only way pages should produce metadata.
- Content: global pages in `src/config/landing-pages.ts` (one intent per page, see header comment); country pages in `src/config/country-pages.ts`. Adding a page = adding data + it appears in routes and sitemap.
- Country routes are `/[slug]/[page]` (first segment = us|uk|au) because Next forbids sibling `[country]` and `[slug]`.
- hreflang: global pages alternate to the 3 country pages with `x-default` = global page. `photo-album-printing` has no global page, so no x-default.
- FAQ schema is deliberately NOT emitted (rich results are restricted; PRD says only when eligible). Revisit.
- Known limitation: `cacheComponents` + streaming means unknown URLs return HTTP 200 with the not-found UI and an auto-injected `noindex` meta. `dynamicParams = false` is not allowed with Cache Components. If true 404 status is needed, add a Proxy that rewrites unknown paths to a 404.
- Printing pages are "prepare a PDF" guides only. No print/delivery claims until fulfilment exists.
- Legal pages are draft + noindex: need real, reviewed text before launch. Contact is noindex until a real form/email exists.
- Set `NEXT_PUBLIC_SITE_URL` in production (canonicals/sitemap use it; default is localhost).

## Editor implementation notes (Phase 3)
- Routes: `(site)` group = marketing layout (header/footer); `(editor)` group = bare layout. `/editor/new` is the start screen, `/editor/[id]` loads the album on the client via `useParams` (`generateStaticParams` returns a dummy id because Cache Components requires one).
- Code: `src/lib/editor/` (types, presets = formats/layouts/templates/builders, images = validation + downscale, storage = IndexedDB), `src/stores/editor-store.ts` (Zustand: album, photos, selection, undo/redo), `src/components/editor/` (shell, toolbar, left/right panels, canvas-area, page-canvas (Konva), page-strip, start-screen). The editor bundle is `next/dynamic` with `ssr: false`.
- Units: 100 logical units = 1 inch. Export multiplies for 300 dpi. Formats/templates are data in `presets.ts` so print providers can add their own.
- Undo/redo snapshots the album JSON (no image data). Slider/typing edits coalesce via a key within 700 ms. History cap 100. History is not persisted.
- Photos are validated (JPG/PNG/WebP, <=25 MB, 200-12000 px), downscaled to max 2400 px and stored as Blobs in IndexedDB. HEIC is rejected with a clear message (no decoder yet).
- Cover is `pages[0]`: cannot be deleted or moved. Page numbers skip the cover.
- Crop = zoom + focus point inside the frame (non-destructive).
- Export = current page as 300 dpi PNG. NOT print-ready: no bleed/safe area/colour profile. Do not describe it as print-ready.
- Fonts are system fonts only (canvas cannot use hashed next/font names).

### Editor gaps (deliberate, for later)
- PDF export (Phase 5), stickers/elements tab, in-editor template switching, photo library reordering, in-canvas text editing (text is edited in the right panel), collaborative albums, HEIC.
- Albums live only in this browser until Phase 4 (accounts + S3/R2 + MongoDB). Move `storage.ts` behind an API at that point; the store/UI should not need to change.
- Mobile uses a tabbed bottom panel (simplified), not a separate mobile editor yet. Touch gestures were not tested on a real device.
- Not covered by automated tests in the repo yet (the Playwright run was ad hoc); add real E2E in Phase 7.

## Next steps
1. Phase 4: auth (Auth.js), MongoDB, S3/R2 uploads with signed URLs, dashboard; migrate albums from IndexedDB.
2. Pricing page (config/DB-driven) and blog routes; `/pricing`, `/blog` still 404.
3. Phase 5: PDF export (jsPDF/pdf-lib or server-side), then decide on print-ready claims.
4. Replace placeholder blocks with real imagery; add OG images.
