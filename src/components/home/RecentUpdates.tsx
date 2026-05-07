import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeContent } from "@/lib/home-content";

export function RecentUpdates({
  content,
  updatedAtLabel,
}: {
  content: HomeContent["currentFocus"];
  updatedAtLabel: string;
}) {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="theme-card-soft rounded-[34px] p-6 sm:p-7">
        <p className="text-base leading-8 text-[var(--color-copy)]">{content.status}</p>
        <ul className="mt-5 space-y-3">
          {content.items.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-[var(--color-border)] bg-white/50 px-4 py-3 text-sm leading-7 text-[var(--color-copy)]"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)]">
            {updatedAtLabel}
            {content.updatedAt}
          </p>
          <span className="text-sm font-medium text-[var(--color-accent)]">
            {content.badgeLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
