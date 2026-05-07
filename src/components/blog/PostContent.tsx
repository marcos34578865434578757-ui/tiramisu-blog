import { renderMdx } from "@/lib/mdx";

export function PostContent({ content }: { content: string }) {
  return <div className="article-content">{renderMdx(content)}</div>;
}
