import {
  Upload, Palette, Download, MousePointerClick, LayoutTemplate, ImageIcon,
  Type, Share2, FileOutput, Lock, Wand2, Layers, Sparkles,
} from "lucide-react";

export const steps = [
  { icon: Upload, title: "Upload Your Photos", text: "Drag and drop photos from your device. JPG, PNG and WebP are supported." },
  { icon: Palette, title: "Customize Your Album", text: "Pick a template, arrange layouts, add captions and choose backgrounds." },
  { icon: Download, title: "Download or Print Your Album", text: "Share a digital album or export a PDF of your finished design." },
];

export const categories = [
  { name: "Wedding Albums", href: "/wedding-photo-album", tone: "bg-[#e9dfd3]" },
  { name: "Family Albums", href: "/family-photo-album", tone: "bg-[#dfe3da]" },
  { name: "Baby Albums", href: "/baby-photo-album", tone: "bg-[#ece4df]" },
  { name: "Travel Albums", href: "/travel-photo-album", tone: "bg-[#d9e0e3]" },
  { name: "Birthday Albums", href: "/birthday-photo-album", tone: "bg-[#eadfd9]" },
  { name: "Anniversary Albums", href: "/anniversary-photo-album", tone: "bg-[#e6e0ea]" },
  { name: "Couple Albums", href: "/couple-photo-album", tone: "bg-[#ebdfe0]" },
  { name: "Graduation Albums", href: "/graduation-photo-album", tone: "bg-[#e3e3d6]" },
];

export const templates = [
  { name: "Classic Ivory", category: "Wedding", pages: 24, orientation: "Portrait" },
  { name: "Golden Hour", category: "Travel", pages: 20, orientation: "Landscape" },
  { name: "First Year", category: "Baby", pages: 30, orientation: "Square" },
  { name: "Sunday Table", category: "Family", pages: 20, orientation: "Landscape" },
  { name: "Quiet Minimal", category: "Minimalist", pages: 16, orientation: "Square" },
  { name: "Noir Edition", category: "Luxury", pages: 28, orientation: "Portrait" },
];

export const features = [
  { icon: Upload, title: "Easy photo uploading", text: "Add many photos at once and add more any time." },
  { icon: MousePointerClick, title: "Drag-and-drop editor", text: "Place, resize, crop and rotate photos on the page." },
  { icon: LayoutTemplate, title: "Professional templates", text: "Start from a designed layout instead of a blank page." },
  { icon: Layers, title: "Multiple layouts", text: "Switch page layouts without losing your photos." },
  { icon: ImageIcon, title: "Custom backgrounds", text: "Solid colours and subtle patterns for every page." },
  { icon: Type, title: "Text and captions", text: "Tell the story with fonts you can customise." },
  { icon: Share2, title: "Digital album sharing", text: "Share a private link with family and friends." },
  { icon: FileOutput, title: "High-resolution export", text: "Export pages as images or the album as a PDF." },
];

export const reasons = [
  { icon: Wand2, title: "Simple online creation", text: "No advanced design skills required." },
  { icon: Sparkles, title: "Professional-looking designs", text: "Thoughtful typography and spacing built in." },
  { icon: Layers, title: "Flexible layouts", text: "Customise templates to fit your story." },
  { icon: Lock, title: "Secure photo storage", text: "Your albums are private by default." },
];

export const faqs = [
  { q: "How do I make a photo album online?", a: "Upload your photos, choose a template, arrange them on each page, then save, share or export your album." },
  { q: "Which photo formats can I upload?", a: "JPG, JPEG, PNG and WebP. HEIC support depends on our processing pipeline and will be noted in the editor." },
  { q: "Can I save and finish my album later?", a: "Yes. Albums autosave to your account so you can reopen and keep editing." },
  { q: "Can I share my album?", a: "Yes. Digital albums can be shared with a private link." },
  { q: "Can I download or print my album?", a: "You can export pages and PDFs. Physical printing is not available yet; we will announce it when it is." },
];

