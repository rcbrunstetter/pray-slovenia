"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import SloveniaLights from "@/components/SloveniaLights";
import { createClientBrowser } from "@/lib/supabase-browser";

type Prompt = { date: string; title: string; content: string; verse?: string | null; };

export default function TodayScreen({
  prompt,
  initialTotal,
  dateLabel,
  children,
}: {
  prompt: Prompt | null;
  initialTotal: number;
  dateLabel: string;
  children: ReactNode;
}) {
  const supabase = useMemo(() => createClientBrowser(), []);
  const [total, setTotal] = useState(initialTotal);
  const [hasPrayed, setHasPrayed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [justLit, setJustLit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pray").then(r => r.json()).then(json => {
      setHasPrayed(!!json.hasPrayed);
    }).catch(() => {
      setHasPrayed(false);
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:daily_totals")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_totals" },
        (payload) => {
          const row = payload.new as any;
          if (row?.date === new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })) {
            setTotal(row.total ?? 0);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  async function onPrayClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pray", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.ok) {
        if (!json.alreadyPrayed) {
          setTotal(t => t + 1);
          setJustLit(true);
        }
        setHasPrayed(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-night px-6 pt-[calc(max(env(safe-area-inset-top),1.25rem)+0.875rem)] pb-[46px] text-ivory">
        <div className="mx-auto flex max-w-[632px] flex-col gap-3.5">
          <div className="font-sans text-[13px] font-semibold tracking-[0.08em] text-mist">{dateLabel}</div>
          <SloveniaLights count={total} newLight={justLit} />
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

      <div className="relative mx-auto -mt-[22px] flex max-w-[680px] flex-col gap-9 rounded-t-[26px] bg-sheet px-6 pt-7 pb-11 text-ink">
        <article className="flex flex-col gap-3">
          <div className="font-sans text-[13px] font-semibold tracking-[0.08em] text-label">Today’s Prayer Focus</div>
          {prompt ? (
            <>
              <h1 className="text-[42px] leading-[1.06] font-medium tracking-[-0.015em] text-balance dark:font-normal">
                {prompt.title}
              </h1>
              {prompt.verse && <div className="text-[20px] text-ink-soft italic">{prompt.verse}</div>}
              <p className="mt-2 text-[21px] leading-[1.58] text-pretty whitespace-pre-line text-prayer">
                {prompt.content}
              </p>
            </>
          ) : (
            <p className="text-[21px] leading-[1.58] text-ink-soft italic">
              No prayer prompt set for today yet. Check back soon.
            </p>
          )}
        </article>

        <aside className="flex flex-col items-center gap-3 border-y border-card-line py-7 text-center">
          <span aria-hidden="true" className="size-[7px] rounded-full bg-gold shadow-[0_0_14px_5px_rgba(244,201,119,0.55)]" />
          <p className="text-[22px] leading-[1.4] text-balance text-ink italic">
            We see every Amen. On the hard days, those lights remind us we’re not doing this alone.
          </p>
          <p className="font-sans text-[13px] font-semibold tracking-[0.08em] text-label">
            Your missionaries in Slovenia
          </p>
        </aside>

        {children}
      </div>

      <div className="sticky bottom-(--tabbar) z-40 border-t border-dock-line bg-night md:bottom-0">
        <div className="mx-auto flex min-h-[74px] max-w-[680px] flex-col justify-center gap-1.5 px-5 py-[11px]">
          {hasPrayed === null ? (
            <span aria-hidden="true" className="h-[52px] rounded-full bg-tab-line" />
          ) : hasPrayed ? (
            <p role="status" className="flex min-h-[52px] items-center justify-center text-center text-[21px] leading-[1.2] text-gold italic">
              Your light is on. Thank you for praying.
            </p>
          ) : (
            <button
              type="button"
              onClick={onPrayClick}
              disabled={loading}
              className="h-[52px] w-full cursor-pointer rounded-full bg-gold font-sans text-lg font-semibold text-night hover:bg-[#FFE0A6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Amen
            </button>
          )}
          {error && (
            <p role="alert" className="text-center font-sans text-sm text-[#FFB59E]">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
