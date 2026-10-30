import Link from "next/link";
import type { ReactNode } from "react";
import SloveniaOutline from "@/components/SloveniaOutline";

export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto -mt-[22px] flex w-full max-w-[680px] flex-1 flex-col gap-9 rounded-t-[26px] bg-sheet px-6 pt-7 pb-11 text-ink">
      {children}
    </div>
  );
}

export default function PageShell({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <>
      <header className="relative overflow-hidden bg-night px-6 pt-[calc(max(var(--safe-top),1.25rem)+1.5rem)] pb-[58px] text-center text-ivory">
        <SloveniaOutline className="pointer-events-none absolute top-[calc(50%-11px)] left-1/2 w-[190px] -translate-x-1/2 -translate-y-1/2 opacity-60" />
        {back && (
          <div className="relative mx-auto mb-3 max-w-[632px] text-left">
            <Link href={back.href} className="font-sans text-sm font-medium text-mist transition-colors hover:text-ivory">
              ‹ {back.label}
            </Link>
          </div>
        )}
        <h1 className="relative text-[38px] leading-[1.08] font-light tracking-[-0.01em]">{title}</h1>
        {subtitle && <p className="relative mt-1.5 text-[19px] leading-[1.3] text-mist italic">{subtitle}</p>}
      </header>
      <Sheet>{children}</Sheet>
    </>
  );
}
