import { SimplePage, DraftNotice } from "@/components/marketing/simple-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of Service for our photo album maker.",
  path: "/terms-of-service",
  noindex: true,
});

export default function Page() {
  return (
    <SimplePage title="Terms of Service" path="/terms-of-service">
      <DraftNotice />
    </SimplePage>
  );
}
