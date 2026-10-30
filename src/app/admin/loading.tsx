import PageShell from "@/components/PageShell";
import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <PageShell title={" "}>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-[14px]" />
        <Skeleton className="h-24 w-full rounded-[14px]" />
        <Skeleton className="h-24 w-full rounded-[14px]" />
      </div>
    </PageShell>
  );
}
