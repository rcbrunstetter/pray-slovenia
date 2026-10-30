import { Sheet } from "@/components/PageShell";
import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <section className="bg-night px-5 pt-[calc(max(env(safe-area-inset-top),1.25rem)+0.5rem)] pb-[42px]">
        <div className="mx-auto aspect-[7/7.6] w-full max-w-[420px]" />
      </section>
      <Sheet>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="mt-2 h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </Sheet>
    </>
  );
}
