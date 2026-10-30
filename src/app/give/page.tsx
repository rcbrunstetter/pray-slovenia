import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageShell from "@/components/PageShell";
import { Eyebrow, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Give" };

const gifts: { text: string; icon: ReactNode }[] = [
  {
    text: "Supports our ministry efforts in Slovenia",
    icon: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  },
  {
    text: "Funds outreach events and Bible distribution",
    icon: <path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2zM12 6.5v14" />,
  },
  {
    text: "Helps plant and strengthen local churches",
    icon: <path d="M12 3v5M9.5 5.5h5M5 21v-7l7-6 7 6v7zM10 21v-5h4v5" />,
  },
  {
    text: "Mobilizes global prayer for the Slovenian people",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5s1.3-6.1 3.8-8.5z" />
      </>
    ),
  },
];

export default function GivePage() {
  return (
    <PageShell title="Give">
      <section className="flex flex-col gap-3">
        <Eyebrow>Support the Mission</Eyebrow>
        <h2 className="text-[34px] leading-[1.1] font-medium tracking-[-0.01em] text-balance dark:font-normal">
          Partner With Us in Prayer &amp; Giving
        </h2>
        <p className="mt-1 text-[21px] leading-[1.58] text-pretty text-prayer">
          We are so thankful for your continued giving to the Lottie Moon Christmas Offering and Cooperative Program. If
          you would like to support our team further with projects large and small, use the link below! We are
          incredibly grateful for your giving to support our ministry among Slovene people.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle>How Your Gift Helps</SectionTitle>
        <ul className="mt-2 flex flex-col divide-y divide-card-line">
          {gifts.map(({ text, icon }) => (
            <li key={text} className="flex items-center gap-3.5 py-3.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-label"
              >
                {icon}
              </svg>
              <span className="text-[19px] leading-[1.35] text-update">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 text-center">
        <a
          href="https://www.imb.org/give/projects-teams/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[52px] items-center justify-center rounded-full bg-gold font-sans text-lg font-semibold text-night transition duration-150 hover:bg-[#FFE0A6] active:scale-[0.98]"
        >
          Give Now
        </a>
        <p className="font-sans text-[13px] font-medium text-meta">You will be directed to the IMB secure giving page.</p>
      </div>
    </PageShell>
  );
}
