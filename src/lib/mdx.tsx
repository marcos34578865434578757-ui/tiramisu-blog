import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

function headingId(children: ReactNode) {
  return String(children)
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5 -]/g, "")
    .replace(/\s+/g, "-");
}

type HeadingProps = ComponentPropsWithoutRef<"h2">;

export const mdxComponents: MDXRemoteProps["components"] = {
  h2: ({ children, ...props }: HeadingProps) => (
    <h2 id={headingId(children)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 id={headingId(children)} {...props}>
      {children}
    </h3>
  ),
  a: ({ className, ...props }) => (
    <a
      className={["font-medium", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  img: ({ alt, className, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={[
        "my-8 block h-auto max-w-full rounded-[1.75rem] border border-white/70 shadow-[0_24px_70px_rgba(51,65,85,0.15)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
};

export function getMdxOptions() {
  return {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    },
  };
}

export function renderMdx(source: string) {
  return (
    <MDXRemote source={source} options={getMdxOptions()} components={mdxComponents} />
  );
}
