type TagProps = {
  children: string;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="theme-card-soft inline-flex rounded-full px-3 py-1 text-xs font-medium text-[var(--color-copy)]">
      {children}
    </span>
  );
}
