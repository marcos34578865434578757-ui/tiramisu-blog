import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/blog/PostContent";
import { Toc } from "@/components/blog/Toc";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";
import { getRequestLocale } from "@/lib/locale";
import {
  getCategoryLabel,
  getContentFallbackCopy,
  getMessages,
} from "@/lib/messages";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts("zh");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const { slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const adjacent = await getAdjacentPosts(slug, locale);
  const fallbackCopy = post.isFallback
    ? getContentFallbackCopy(locale, post.sourceLocale)
    : null;

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
        <article className="space-y-8">
          <div
            className="min-h-[320px] rounded-[36px] bg-cover bg-center shadow-[0_30px_70px_rgba(51,65,85,0.18)]"
            style={{ backgroundImage: `url('${post.cover}')` }}
          />
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{post.readingTime}</span>
              <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                {getCategoryLabel(post.category, locale)}
              </span>
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-lg leading-9 text-[var(--color-copy)]">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            {fallbackCopy ? (
              <div className="rounded-[24px] border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
                {fallbackCopy.long}
              </div>
            ) : null}
          </header>
          <div className="glass-panel rounded-[34px] px-6 py-8 sm:px-9 sm:py-10">
            <PostContent content={post.content} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {adjacent.previous ? (
              <Link
                href={`/blog/${adjacent.previous.slug}`}
                className="rounded-[28px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_38px_rgba(51,65,85,0.06)] hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {messages.blog.previous}
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
                  {adjacent.previous.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {adjacent.next ? (
              <Link
                href={`/blog/${adjacent.next.slug}`}
                className="rounded-[28px] border border-white/70 bg-white/62 p-5 shadow-[0_14px_38px_rgba(51,65,85,0.06)] hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {messages.blog.next}
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
                  {adjacent.next.title}
                </p>
              </Link>
            ) : null}
          </div>
        </article>
        <Toc items={post.toc} />
      </div>
    </Container>
  );
}
