import Link from "next/link";
import type { PostFrontmatter } from "@/lib/posts";
import { Tag } from "@/components/ui/Tag";
import { getRequestLocale } from "@/lib/locale";
import { getCategoryLabel, getContentFallbackCopy, type Locale } from "@/lib/messages";

type PostCardProps = {
  slug: string;
  requestedLocale: Locale;
  sourceLocale: Locale;
  availableLocales: Locale[];
  isFallback: boolean;
} & PostFrontmatter;

export async function PostCard({
  slug,
  title,
  date,
  description,
  category,
  tags,
  readingTime,
  cover,
  requestedLocale,
  sourceLocale,
  isFallback,
}: PostCardProps) {
  const locale = await getRequestLocale();
  const fallbackCopy = isFallback
    ? getContentFallbackCopy(requestedLocale, sourceLocale)
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="theme-card-soft group grid gap-6 rounded-[32px] p-5 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(51,65,85,0.1)] md:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div
        className="min-h-[200px] rounded-[24px] bg-cover bg-center shadow-[0_20px_40px_rgba(51,65,85,0.12)]"
        style={{ backgroundImage: `url('${cover}')` }}
      />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
          <span>{date}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{readingTime}</span>
          <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {getCategoryLabel(category, locale)}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {title}
          </h3>
          <p className="max-w-2xl text-base leading-8 text-[var(--color-copy)]">
            {description}
          </p>
          {fallbackCopy ? (
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {fallbackCopy.short}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
