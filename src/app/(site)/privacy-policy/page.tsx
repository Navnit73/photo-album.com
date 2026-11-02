import { SimplePage, DraftNotice } from "@/components/marketing/simple-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for our photo album maker.",
  path: "/privacy-policy",
  noindex: true,
});

export default function Page() {
  return (
    <SimplePage title="Privacy Policy" path="/privacy-policy">
      <DraftNotice />
    </SimplePage>
  );
}
