"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sheet } from "@/components/PageShell";
import PrayerBody from "@/components/PrayerBody";
import { Eyebrow, Notice, Skeleton } from "@/components/ui";
import { mergeMonth, type Prompt, type RecurringPrompt } from "@/lib/prompts";
import { createClientBrowser } from "@/lib/supabase-browser";
import { formatDate, monthBounds, shiftMonth } from "@/lib/time";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function MonthArrow({ direction, onClick }: { direction: "Previous" | "Next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${direction} month`}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-mist transition duration-150 hover:bg-tab-line hover:text-ivory active:scale-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={direction === "Previous" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

export default function CalendarView({
  today,
  manual,
  recurring,
}: {
  today: string;
  manual: Prompt[];
  recurring: RecurringPrompt[];
}) {
  const supabase = useMemo(() => createClientBrowser(), []);
  const thisMonth = today.slice(0, 7);
  const [month, setMonth] = useState(thisMonth);
  const [picked, setPicked] = useState<string | null>(today);
  const [months, setMonths] = useState<Record<string, Record<string, Prompt>>>({
    [thisMonth]: mergeMonth(thisMonth, manual, recurring),
  });
  const [failedMonth, setFailedMonth] = useState<string | null>(null);
  const requested = useRef(new Set([thisMonth]));

  const loadMonth = useCallback((key: string) => {
    if (requested.current.has(key)) return;
    requested.current.add(key);
    const { first, last } = monthBounds(key);
    supabase.from("prayer_prompts").select("*").gte("date", first).lte("date", last).then(({ data, error }) => {
      if (error) {
        requested.current.delete(key);
        setFailedMonth(key);
        return;
      }
      setFailedMonth(failed => (failed === key ? null : failed));
      setMonths(prev => ({ ...prev, [key]: mergeMonth(key, data ?? [], recurring) }));
    });
  }, [supabase, recurring]);

  // Load the months on either side too, so the arrows feel instant.
  useEffect(() => {
    loadMonth(month);
    loadMonth(shiftMonth(month, -1));
    loadMonth(shiftMonth(month, 1));
  }, [month, loadMonth]);

  function goTo(key: string) {
    setMonth(key);
    setPicked(key === thisMonth ? today : null);
  }

  const prompts = months[month];
  const { lastDay, firstWeekday } = monthBounds(month);
  const day = picked ?? (prompts && Object.keys(prompts).sort()[0]) ?? `${month}-01`;
  const prompt = prompts?.[day];

  // Always six rows, so the page doesn't jump between months.
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - firstWeekday + 1;
    return d >= 1 && d <= lastDay ? `${month}-${String(d).padStart(2, "0")}` : null;
  });

  return (
    <>
      <section className="bg-night px-5 pt-[calc(max(var(--safe-top),1.25rem)+0.5rem)] pb-[42px] text-ivory">
        <div className="mx-auto flex max-w-[420px] flex-col gap-3">
          <div className="flex items-center justify-between">
            <MonthArrow direction="Previous" onClick={() => goTo(shiftMonth(month, -1))} />
            <h1 aria-live="polite" className="text-[30px] leading-[1.1] font-light">
              {formatDate(`${month}-01`, { month: "long", year: "numeric" })}
            </h1>
            <MonthArrow direction="Next" onClick={() => goTo(shiftMonth(month, 1))} />
          </div>

          <div className="grid grid-cols-7 place-items-center gap-y-0.5">
            {WEEKDAYS.map(name => (
              <abbr key={name} title={name} className="pb-1 font-sans text-xs font-medium text-mist no-underline">
                {name[0]}
              </abbr>
            ))}
            {cells.map((date, i) => {
              if (!date) return <span key={i} aria-hidden="true" className="aspect-square w-full max-w-11" />;
              const hasPrayer = !!prompts?.[date];
              const isSelected = date === day;
              const isToday = date === today;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setPicked(date)}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={`${formatDate(date, { weekday: "long", month: "long", day: "numeric" })}${hasPrayer ? `, ${prompts[date].title}` : ""}`}
                  className={`relative flex aspect-square w-full max-w-11 cursor-pointer items-center justify-center rounded-full font-sans text-[15px] transition-colors duration-150 ${
                    isSelected
                      ? "bg-gold font-semibold text-night"
                      : hasPrayer
                        ? "text-ivory hover:bg-tab-line"
                        : "text-mist/55 hover:bg-tab-line"
                  } ${isToday && !isSelected ? "ring-1 ring-gold" : ""}`}
                >
                  {Number(date.slice(8))}
                  {hasPrayer && (
                    <span
                      aria-hidden="true"
                      className={`fade-in absolute bottom-[5px] size-1 rounded-full ${
                        isSelected ? "bg-night" : "bg-gold shadow-[0_0_6px_1px_rgba(244,201,119,0.7)]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Sheet>
        <article key={day} className="fade-in flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <Eyebrow>{formatDate(day, { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
            {day !== today && (
              <button
                type="button"
                onClick={() => goTo(thisMonth)}
                className="shrink-0 cursor-pointer font-sans text-[13px] font-semibold text-label underline underline-offset-4"
              >
                Back to today
              </button>
            )}
          </div>
          {failedMonth === month ? (
            <Notice>We couldn’t load this month. Check your connection and try again.</Notice>
          ) : !prompts ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-11 w-4/5" />
              <Skeleton className="mt-2 h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ) : prompt ? (
            <PrayerBody prompt={prompt} />
          ) : (
            <p className="text-[21px] leading-[1.58] text-ink-soft italic">No prayer has been set for this day yet.</p>
          )}
        </article>
      </Sheet>
    </>
  );
}
