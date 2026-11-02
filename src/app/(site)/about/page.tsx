import { SimplePage } from "@/components/marketing/simple-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description: "Why we are building a simple, private way to design photo albums online.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <SimplePage title="About Us" path="/about">
      <p>{siteConfig.name} helps people turn photos into albums they are proud of, without needing design skills.</p>
      <p>We are building for the United States, the United Kingdom and Australia, with local sizes, spelling and currencies.</p>
      <p>Your photos are yours. We will not use them to train AI or for marketing without your explicit consent.</p>
    </SimplePage>
  );
}
