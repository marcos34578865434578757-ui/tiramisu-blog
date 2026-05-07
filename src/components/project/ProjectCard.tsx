import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Tag } from "@/components/ui/Tag";
import { getContentFallbackCopy } from "@/lib/messages";

export async function ProjectCard({
  slug,
  title,
  description,
  tags,
  status,
  date,
  cover,
  requestedLocale,
  sourceLocale,
  isFallback,
}: Project) {
  const fallbackCopy = isFallback
    ? getContentFallbackCopy(requestedLocale, sourceLocale)
    : null;

  return (
    <Link
      href={`/projects/${slug}`}
      className="theme-card-soft group flex h-full flex-col overflow-hidden rounded-[32px] hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(51,65,85,0.1)]"
    >
      <div
        className="h-60 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${cover}')` }}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {status}
          </span>
          <span className="text-sm text-[var(--color-muted)]">{date}</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {title}
          </h3>
          <p className="text-base leading-8 text-[var(--color-copy)]">{description}</p>
          {fallbackCopy ? (
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {fallbackCopy.short}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
