"use client";

import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <PageShell title="Something went wrong">
      <p className="text-[21px] leading-[1.58] text-prayer">
        This page didn’t load. Check your connection and try again.
      </p>
      <Button onClick={reset} className="self-start">Try again</Button>
    </PageShell>
  );
}
