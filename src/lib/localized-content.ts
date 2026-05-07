import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/messages";

export type LocalizedEntry = {
  slug: string;
  zh?: string;
  en?: string;
  legacy?: string;
};

const localizedFilePattern = /^(.*?)(?:\.(zh|en))?\.mdx$/;

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getLocalizedFilePath(
  directory: string,
  slug: string,
  locale: Locale,
) {
  return path.join(directory, `${slug}.${locale}.mdx`);
}

export function getLegacyFilePath(directory: string, slug: string) {
  return path.join(directory, `${slug}.mdx`);
}

export async function collectLocalizedEntries(directory: string) {
  const files = await fs.readdir(directory);
  const map = new Map<string, LocalizedEntry>();

  for (const fileName of files) {
    if (!fileName.endsWith(".mdx")) {
      continue;
    }

    const match = localizedFilePattern.exec(fileName);
    if (!match) {
      continue;
    }

    const slug = match[1];
    const locale = match[2] as Locale | undefined;
    const current = map.get(slug) ?? { slug };

    if (locale === "zh") {
      current.zh = fileName;
    } else if (locale === "en") {
      current.en = fileName;
    } else {
      current.legacy = fileName;
    }

    map.set(slug, current);
  }

  return [...map.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getAvailableLocales(entry: LocalizedEntry): Locale[] {
  const locales: Locale[] = [];

  if (entry.zh || entry.legacy) {
    locales.push("zh");
  }

  if (entry.en) {
    locales.push("en");
  }

  return locales;
}

export function resolveLocalizedFile(
  directory: string,
  entry: LocalizedEntry,
  requestedLocale: Locale,
) {
  const preferredFile =
    requestedLocale === "zh"
      ? entry.zh ?? entry.legacy
      : entry.en;

  if (preferredFile) {
    return {
      filePath: path.join(directory, preferredFile),
      sourceLocale: requestedLocale,
      requestedLocale,
      availableLocales: getAvailableLocales(entry),
      isFallback: false,
    };
  }

  const fallbackFile =
    requestedLocale === "zh"
      ? entry.en
      : entry.zh ?? entry.legacy;

  if (!fallbackFile) {
    return null;
  }

  return {
    filePath: path.join(directory, fallbackFile),
    sourceLocale: requestedLocale === "zh" ? "en" : "zh",
    requestedLocale,
    availableLocales: getAvailableLocales(entry),
    isFallback: true,
  } as const;
}

export async function renameLocalizedSlugFiles(
  directory: string,
  previousSlug: string,
  nextSlug: string,
) {
  if (!previousSlug || previousSlug === nextSlug) {
    return;
  }

  const renames: Array<{ from: string; to: string }> = [];
  const zhFile = getLocalizedFilePath(directory, previousSlug, "zh");
  const enFile = getLocalizedFilePath(directory, previousSlug, "en");
  const legacyFile = getLegacyFilePath(directory, previousSlug);

  if (await fileExists(zhFile)) {
    renames.push({
      from: zhFile,
      to: getLocalizedFilePath(directory, nextSlug, "zh"),
    });
  }

  if (await fileExists(enFile)) {
    renames.push({
      from: enFile,
      to: getLocalizedFilePath(directory, nextSlug, "en"),
    });
  }

  if (await fileExists(legacyFile)) {
    renames.push({
      from: legacyFile,
      to: getLocalizedFilePath(directory, nextSlug, "zh"),
    });
  }

  for (const rename of renames) {
    if (rename.from === rename.to) {
      continue;
    }

    await fs.rm(rename.to, { force: true });
    await fs.rename(rename.from, rename.to);
  }
}

export async function deleteLocalizedSlugFiles(directory: string, slug: string) {
  await Promise.all([
    fs.rm(getLocalizedFilePath(directory, slug, "zh"), { force: true }),
    fs.rm(getLocalizedFilePath(directory, slug, "en"), { force: true }),
    fs.rm(getLegacyFilePath(directory, slug), { force: true }),
  ]);
}
