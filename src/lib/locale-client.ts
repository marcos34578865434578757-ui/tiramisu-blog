"use client";

import { useSyncExternalStore } from "react";
import {
  getMessages,
  isLocale,
  localeCookieName,
  localeEvent,
  localeStorageKey,
  type Locale,
} from "@/lib/messages";

function getLocaleSnapshot(): Locale {
  if (typeof document === "undefined") {
    return "zh";
  }

  const locale = document.documentElement.dataset.locale;
  return isLocale(locale) ? locale : "zh";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === localeStorageKey) {
      onStoreChange();
    }
  };

  window.addEventListener(localeEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(localeEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function applyLocale(locale: Locale) {
  document.documentElement.dataset.locale = locale;
  document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  window.localStorage.setItem(localeStorageKey, locale);
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  window.dispatchEvent(new Event(localeEvent));
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocaleSnapshot, () => "zh");
}

export function useMessages() {
  const locale = useLocale();
  return getMessages(locale);
}

