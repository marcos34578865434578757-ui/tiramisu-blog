"use client";

import { useRouter } from "next/navigation";
import { applyLocale, useLocale, useMessages } from "@/lib/locale-client";

export function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();
  const messages = useMessages();
  const isEnglish = locale === "en";

  function toggleLocale(nextLocale: "zh" | "en") {
    if (nextLocale !== locale) {
      applyLocale(nextLocale);
      router.refresh();
    }
  }

  return (
    <div
      aria-label={messages.language.label}
      className="theme-card-soft relative inline-flex h-12 w-[110px] items-center rounded-full px-2"
      role="group"
    >
      <span
        className={[
          "absolute top-1.5 h-9 w-[48px] rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] shadow-[0_10px_24px_rgba(83,180,156,0.28)] transition-transform duration-300",
          isEnglish ? "translate-x-[50px]" : "translate-x-0",
        ].join(" ")}
      />
      <button
        type="button"
        onClick={() => toggleLocale("zh")}
        aria-label={messages.language.switchToZh}
        aria-pressed={!isEnglish}
        className={[
          "relative z-10 inline-flex h-8 w-[48px] items-center justify-center rounded-full text-sm font-semibold transition-colors",
          isEnglish ? "text-[var(--color-muted)]" : "text-slate-900",
        ].join(" ")}
      >
        {messages.language.zh}
      </button>
      <button
        type="button"
        onClick={() => toggleLocale("en")}
        aria-label={messages.language.switchToEn}
        aria-pressed={isEnglish}
        className={[
          "relative z-10 inline-flex h-8 w-[48px] items-center justify-center rounded-full text-sm font-semibold transition-colors",
          isEnglish ? "text-slate-900" : "text-[var(--color-muted)]",
        ].join(" ")}
      >
        {messages.language.en}
      </button>
    </div>
  );
}
