type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-tight text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}
