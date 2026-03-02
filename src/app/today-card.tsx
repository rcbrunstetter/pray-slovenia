"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

type Prompt = { date: string; title: string; content: string; verse?: string | null; };

export default function TodayCard({
  prompt,
  initialTotal
}: {
  prompt: Prompt | null;
  initialTotal: number;
}) {
  const supabase = createClientBrowser();
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:daily_totals")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_totals" },
        (payload) => {
          const row = payload.new as any;
          if (row?.date === new Date().toISOString().slice(0,10)) {
            setTotal(row.total ?? 0);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  async function onPrayClick() {
    const res = await fetch("/api/pray", { method: "POST" });
    const json = await res.json();
    if (res.ok && json.ok && !json.alreadyPrayed) setTotal(t => t + 1);
    else if (!res.ok) alert(json?.error ?? "Something went wrong.");
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {prompt ? (
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{prompt.title}</h2>
          {prompt.verse && <p className="text-sm text-slate-600">{prompt.verse}</p>}
          <p className="mt-2">{prompt.content}</p>
        </div>
      ) : <p>No prompt set for today yet.</p>}

      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">🙏 {total} people prayed today</div>
        <button
          onClick={onPrayClick}
          className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
        >
          I prayed today
        </button>
      </div>
    </div>
  );
}