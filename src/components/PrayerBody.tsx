import type { Prompt } from "@/lib/prompts";

export default function PrayerBody({ prompt }: { prompt: Prompt }) {
  return (
    <>
      <h2 className="text-[42px] leading-[1.06] font-medium tracking-[-0.015em] text-balance dark:font-normal">
        {prompt.title}
      </h2>
      {prompt.verse && <div className="text-[20px] text-ink-soft italic">{prompt.verse}</div>}
      <p className="mt-2 text-[21px] leading-[1.58] text-pretty whitespace-pre-line text-prayer">{prompt.content}</p>
    </>
  );
}
