import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function Container({
  children,
  className,
  wide = false,
}: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        wide ? "max-w-[1500px]" : "max-w-[1180px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
