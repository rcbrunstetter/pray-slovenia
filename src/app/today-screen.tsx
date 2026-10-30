"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Sheet } from "@/components/PageShell";
import PrayerBody from "@/components/PrayerBody";
import SloveniaLights from "@/components/SloveniaLights";
import { Eyebrow } from "@/components/ui";
import type { Prompt } from "@/lib/prompts";
import { createClientBrowser } from "@/lib/supabase-browser";
import { todayISO } from "@/lib/time";

export default function TodayScreen({
  date,
  dateLabel,
  prompt,
  initialTotal,
  initialHasPrayed,
  children,
}: {
  date: string;
  dateLabel: string;
  prompt: Prompt | null;
  initialTotal: number;
  initialHasPrayed: boolean;
  children: ReactNode;
}) {
  const supabase = useMemo(() => createClientBrowser(), []);
  const router = useRouter();
  const [total, setTotal] = useState(initialTotal);
  const [hasPrayed, setHasPrayed] = useState(initialHasPrayed);
  const [error, setError] = useState<string | null>(null);

  // A phone can leave this screen open for days, so catch up whenever it comes
  // back, and keep the lights current while someone is reading.
  useEffect(() => {
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      if (todayISO() !== date) {
        router.refresh();
        return;
      }
      const { data } = await supabase.from("daily_totals").select("total").eq("date", date).maybeSingle();
      if (data) setTotal(t => Math.max(t, data.total ?? 0));
    }

    const poll = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [date, router, supabase]);

  async function onPrayClick() {
    // Light up right away, and undo it if the save fails.
    setHasPrayed(true);
    setTotal(t => t + 1);
    setError(null);
    try {
      const res = await fetch("/api/pray", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error);
      if (json.alreadyPrayed) setTotal(t => t - 1);
    } catch {
      setHasPrayed(false);
      setTotal(t => t - 1);
      setError("We couldn’t save your Amen. Please try again.");
    }
  }

  return (
    <>
      <h1 className="sr-only">Pray Slovenia</h1>
      <section className="bg-night px-6 pt-[calc(max(var(--safe-top),1.25rem)+0.875rem)] pb-[46px] text-ivory">
        <div className="mx-auto flex max-w-[632px] flex-col gap-3.5">
          <div className="font-sans text-[13px] font-semibold tracking-[0.08em] text-mist">{dateLabel}</div>
          <SloveniaLights count={total} />
          <p aria-live="polite" className="text-center text-[25px] leading-[1.25] font-light">
            {total === 0 ? (
              "Be the first light over Slovenia today"
            ) : (
              <>
                <span className="font-normal text-gold">{total}</span> {total === 1 ? "light" : "lights"} over Slovenia today
              </>
            )}
          </p>
        </div>
      </section>

      <Sheet>
        <article className="flex flex-col gap-3">
          <Eyebrow>Today’s Prayer Focus</Eyebrow>
          {prompt ? (
            <PrayerBody prompt={prompt} />
          ) : (
            <p className="text-[21px] leading-[1.58] text-ink-soft italic">
              Today’s prayer is on its way. Check back soon, or take a moment to pray for Slovenia in your own words.
            </p>
          )}
        </article>

        <aside className="flex flex-col items-center gap-3 border-y border-card-line py-7 text-center">
          <span aria-hidden="true" className="size-[7px] rounded-full bg-gold shadow-[0_0_14px_5px_rgba(244,201,119,0.55)]" />
          <p className="text-[22px] leading-[1.4] text-balance text-ink italic">
            We see every Amen. On the hard days, those lights remind us we’re not doing this alone.
          </p>
          <Eyebrow>Your missionaries in Slovenia</Eyebrow>
        </aside>

        {children}
      </Sheet>

      <div className="sticky bottom-(--tabbar) z-40 border-t border-dock-line bg-night md:bottom-0">
        <div className="mx-auto flex min-h-[74px] max-w-[680px] flex-col justify-center gap-1.5 px-5 py-[11px]">
          {hasPrayed ? (
            <p role="status" className="fade-in flex min-h-[52px] items-center justify-center text-center text-[21px] leading-[1.2] text-gold italic">
              Your light is on. Thank you for praying.
            </p>
          ) : (
            <button
              type="button"
              onClick={onPrayClick}
              className="h-[52px] w-full cursor-pointer rounded-full bg-gold font-sans text-lg font-semibold text-night transition duration-150 hover:bg-[#FFE0A6] active:scale-[0.98]"
            >
              Amen
            </button>
          )}
          {error && (
            <p role="alert" className="fade-in text-center font-sans text-sm text-[#FFB59E]">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
