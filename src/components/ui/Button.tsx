import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({
  href,
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-medium";
  const tone =
    variant === "primary"
      ? "bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(143,220,194,0.34)]"
      : "theme-card-soft text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]";

  return (
    <Link href={href} className={`${base} ${tone}`}>
      {children}
    </Link>
  );
}
