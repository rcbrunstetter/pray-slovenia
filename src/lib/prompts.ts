import { monthBounds } from "@/lib/time";

export type Prompt = { date: string; title: string; content: string; verse?: string | null; };
export type RecurringPrompt = { id: string; day_of_month: number; title: string; content: string; verse?: string | null; };
export type PrayerRequest = { id: number; title: string; content: string; is_urgent: boolean; is_active: boolean; created_at: string; };

// A prompt set for a specific date wins over the recurring one for that day.
export function mergeMonth(month: string, manual: Prompt[], recurring: RecurringPrompt[]): Record<string, Prompt> {
  const { lastDay } = monthBounds(month);
  const merged: Record<string, Prompt> = {};

  recurring.forEach(r => {
    if (r.day_of_month <= lastDay) {
      const date = `${month}-${String(r.day_of_month).padStart(2, "0")}`;
      merged[date] = { date, title: r.title, content: r.content, verse: r.verse };
    }
  });
  manual.forEach(p => { merged[p.date] = p; });

  return merged;
}
