"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Today",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
      </>
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
  },
  {
    href: "/team",
    label: "Team",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c1.8.8 3 2.6 3 4.6" />
      </>
    ),
  },
  {
    href: "/give",
    label: "Give",
    icon: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 h-(--tabbar) border-t border-tab-line bg-night pb-[max(var(--safe-bottom),0.5rem)] font-sans md:sticky md:top-0 md:bottom-auto md:h-16 md:border-t-0 md:border-b md:border-dock-line md:pb-0"
    >
      <div className="mx-auto flex h-full max-w-[1040px] items-center md:justify-between md:px-8">
        <Link href="/" className="hidden font-serif text-[22px] text-ivory md:block">
          Pray Slovenia
        </Link>
        <div className="grid w-full grid-cols-4 px-2 md:flex md:w-auto md:gap-2 md:px-0">
          {tabs.map(({ href, label, icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[3.25rem] flex-col items-center justify-center gap-[3px] text-xs md:h-10 md:flex-row md:gap-2 md:px-3 md:text-sm ${
                  active ? "font-semibold text-gold" : "font-medium text-mist hover:text-ivory"
                }`}
              >
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
                >
                  {icon}
                </svg>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
