import { ChevronDown } from "lucide-react";
import { SimplePage } from "@/components/marketing/simple-page";
import { faqs } from "@/config/home";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Photo Album Maker FAQ",
  description: "Answers about creating, saving, sharing, downloading and printing photo albums.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <SimplePage title="Frequently Asked Questions" path="/faq">
      <div className="divide-y divide-border rounded-2xl border border-border">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
              {f.q}<ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 text-sm">{f.a}</p>
          </details>
        ))}
      </div>
    </SimplePage>
  );
}
