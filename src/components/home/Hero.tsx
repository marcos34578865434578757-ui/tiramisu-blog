import { Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Tag } from "@/components/ui/Tag";
import type { HomeContent } from "@/lib/home-content";

export function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section className="theme-card-strong relative overflow-hidden rounded-[42px] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
        <div className="space-y-8">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
              <Sparkles size={16} />
              {content.badge}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {content.eyebrow}
              </p>
              <h1 className="text-balance max-w-4xl text-4xl font-semibold leading-[1.04] text-[var(--color-ink)] sm:text-5xl lg:text-[4.4rem]">
                {content.title}
              </h1>
              <p className="max-w-3xl text-lg leading-9 text-[var(--color-copy)] sm:text-xl">
                {content.intro}
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="flex flex-wrap gap-3">
              <Button href={content.primaryCtaHref}>{content.primaryCtaLabel}</Button>
              <Button href={content.secondaryCtaHref} variant="secondary">
                {content.secondaryCtaLabel}
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.18}>
            <div className="flex flex-wrap gap-3">
              {content.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.22}>
          <div className="theme-card-soft space-y-6 rounded-[34px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-accent)] shadow-[0_12px_24px_rgba(83,180,156,0.1)]">
                <Waves size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {content.noteLabel}
                </p>
                <p className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
                  {content.noteTitle}
                </p>
              </div>
            </div>

            <p className="text-base leading-8 text-[var(--color-copy)]">
              {content.status}
            </p>

            <div className="space-y-3 border-t border-[var(--color-border)] pt-5">
              {content.highlights.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-7 text-[var(--color-copy)]">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {content.stats.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-[24px] border border-[var(--color-border)] bg-white/45 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
