import type { ReactNode } from "react";

// Pages not yet rebuilt hard-code light colors, so they keep a light page
// in both modes until they move to the new design.
export default function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="bg-night px-6 pt-[calc(max(env(safe-area-inset-top),1.25rem)+0.875rem)] pb-[46px] text-center">
        <h1 className="text-[34px] leading-[1.1] text-ivory">{title}</h1>
      </header>
      <div
        className="relative mx-auto -mt-[22px] min-h-[60vh] max-w-[680px] rounded-t-[26px] bg-[#FDFAF3] px-5 pt-10 pb-16 text-[#2c2416] [color-scheme:light]"
        style={{ fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.7 }}
      >
        {children}
      </div>
    </>
  );
}
