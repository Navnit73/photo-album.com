export const siteConfig = {
  name: "Albumry",
  tagline: "Create Beautiful Photo Albums Online",
  description:
    "Turn your favourite memories into beautiful personalized photo albums. Upload your photos, choose a design, customize every page, and create an album worth keeping forever.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const mainNav = [
  { label: "Photo Album Maker", href: "/photo-album-maker" },
  { label: "Templates", href: "/photo-album-templates" },
  { label: "Wedding", href: "/wedding-photo-album" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
] as const;

export const footerNav = {
  Product: [
    { label: "Photo Album Maker", href: "/photo-album-maker" },
    { label: "Digital Photo Album", href: "/digital-photo-album" },
    { label: "Templates", href: "/photo-album-templates" },
    { label: "Pricing", href: "/pricing" },
  ],
  Albums: [
    { label: "Wedding", href: "/wedding-photo-album" },
    { label: "Family", href: "/family-photo-album" },
    { label: "Baby", href: "/baby-photo-album" },
    { label: "Travel", href: "/travel-photo-album" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
} as const;
