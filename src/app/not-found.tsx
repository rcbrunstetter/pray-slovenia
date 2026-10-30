import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <p className="text-[21px] leading-[1.58] text-prayer">
        We couldn’t find that page.{" "}
        <Link href="/" className="text-label underline underline-offset-4">Go back to today’s prayer.</Link>
      </p>
    </PageShell>
  );
}
