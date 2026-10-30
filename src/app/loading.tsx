import { Sheet } from "@/components/PageShell";
import SloveniaOutline from "@/components/SloveniaOutline";
import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <section className="bg-night px-6 pt-[calc(max(env(safe-area-inset-top),1.25rem)+0.875rem)] pb-[46px]">
        <div className="mx-auto flex max-w-[632px] flex-col gap-3.5">
          <div className="h-[19.5px]" />
          <SloveniaOutline className="mx-auto block aspect-[341/222] w-full max-w-[339px]" />
          <div className="h-[31px]" />
        </div>
      </section>
      <Sheet>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="mt-2 h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </Sheet>
    </>
  );
}
