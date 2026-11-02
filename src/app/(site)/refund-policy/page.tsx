import { SimplePage, DraftNotice } from "@/components/marketing/simple-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Refund Policy",
  description: "Refund Policy for our photo album maker.",
  path: "/refund-policy",
  noindex: true,
});

export default function Page() {
  return (
    <SimplePage title="Refund Policy" path="/refund-policy">
      <DraftNotice />
    </SimplePage>
  );
}
