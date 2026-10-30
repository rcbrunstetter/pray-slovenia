import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-card-line bg-card px-3.5 py-3 font-sans text-base text-ink transition-colors placeholder:text-meta focus:border-label focus:outline-none read-only:text-meta";

const buttonClass = {
  primary: "h-12 bg-gold px-6 text-base font-semibold text-night hover:bg-[#FFE0A6]",
  ghost: "h-10 border border-card-line px-4 text-[15px] font-medium text-ink-soft hover:border-label",
  danger: "h-10 border border-card-line px-4 text-[15px] font-medium text-urgent hover:border-urgent",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonClass }) {
  return (
    <button
      type="button"
      {...props}
      className={`cursor-pointer rounded-full font-sans transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass[variant]} ${className}`}
    />
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-sans text-[13px] font-semibold tracking-[0.08em] text-label">{children}</div>;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[14px] border border-card-line bg-card p-[18px] ${className}`}>{children}</div>;
}

export function CardLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`block rounded-[14px] border border-card-line bg-card p-[18px] transition duration-150 hover:border-label active:scale-[0.99] ${className}`}
    />
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[28px] leading-[1.15] font-medium dark:font-normal">{children}</h2>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[13px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function Notice({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`fade-in rounded-xl border px-4 py-3 font-sans text-[15px] leading-snug ${
        tone === "error" ? "border-urgent text-urgent" : "border-card-line text-label"
      }`}
    >
      {children}
    </p>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-lg bg-card-line ${className}`} />;
}
