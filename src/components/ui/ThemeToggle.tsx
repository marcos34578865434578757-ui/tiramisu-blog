"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useMessages } from "@/lib/locale-client";

type ThemeMode = "light" | "dark";

const storageKey = "theme-preference";
const themeEvent = "codex-theme-change";

function getThemeSnapshot(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  const theme = document.documentElement.dataset.theme;
  return theme === "dark" ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      onStoreChange();
    }
  };

  window.addEventListener(themeEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(themeEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(storageKey, theme);
  window.dispatchEvent(new Event(themeEvent));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "light");
  const messages = useMessages();
  const isDark = theme === "dark";

  function toggleTheme() {
    applyTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      aria-label={isDark ? messages.theme.switchToLight : messages.theme.switchToDark}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="theme-card-soft relative inline-flex h-12 w-[114px] items-center rounded-full px-2"
    >
      <span
        className={[
          "absolute top-1.5 h-9 w-[50px] rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] shadow-[0_10px_24px_rgba(83,180,156,0.28)] transition-transform duration-300",
          isDark ? "translate-x-[52px]" : "translate-x-0",
        ].join(" ")}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2">
        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            isDark ? "text-[var(--color-muted)]" : "text-slate-900",
          ].join(" ")}
        >
          <SunMedium size={18} />
        </span>
        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            isDark ? "text-slate-900" : "text-[var(--color-muted)]",
          ].join(" ")}
        >
          <MoonStar size={18} />
        </span>
      </span>
    </button>
  );
}
