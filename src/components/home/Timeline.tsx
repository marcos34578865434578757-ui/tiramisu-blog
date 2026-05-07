import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type TimelineContent = {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  milestones: ReadonlyArray<{
    title: string;
    body: string;
  }>;
};

export function Timeline({ content }: { content: TimelineContent }) {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-5 lg:grid-cols-4">
        {content.milestones.map((item, index) => (
          <MotionReveal key={item.title} delay={index * 0.06}>
            <div className="theme-card-soft h-full rounded-[28px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {content.stepLabel} {index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-[var(--color-copy)]">
                {item.body}
              </p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
