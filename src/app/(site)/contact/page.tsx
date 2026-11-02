import { SimplePage } from "@/components/marketing/simple-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "How to get in touch with our team.",
  path: "/contact",
  noindex: true,
});

export default function ContactPage() {
  return (
    <SimplePage title="Contact Us" path="/contact">
      <p>A contact form is coming soon. Support details will be published here before launch.</p>
    </SimplePage>
  );
}
