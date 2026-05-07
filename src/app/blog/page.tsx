import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { POST_CATEGORIES, isPostCategory } from "@/lib/post-categories";
import { getRequestLocale } from "@/lib/locale";
import { getCategoryLabel, getMessages } from "@/lib/messages";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: messages.blog.title,
    description: messages.blog.metaDescription,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const posts = await getAllPosts(locale);
  const { category } = await searchParams;
  const activeCategory = isPostCategory(String(category ?? "")) ? category : null;
  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    <Container className="py-14 sm:py-18">
      <section className="space-y-10">
        <SectionHeading
          eyebrow="Blog"
          title={messages.blog.title}
          description={messages.blog.description}
        />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className={[
              "inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === null
                ? "bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.2)]"
                : "theme-card-soft text-[var(--color-ink)]",
            ].join(" ")}
          >
            {messages.blog.allPosts}
          </Link>
          {POST_CATEGORIES.map((item) => (
            <Link
              key={item}
              href={`/blog?category=${encodeURIComponent(item)}`}
              className={[
                "inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === item
                  ? "bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.2)]"
                  : "theme-card-soft text-[var(--color-ink)]",
              ].join(" ")}
            >
              {getCategoryLabel(item, locale)}
            </Link>
          ))}
        </div>

        <div className="space-y-5">
          {filteredPosts.map((post, index) => (
            <MotionReveal key={post.slug} delay={index * 0.05}>
              <PostCard {...post} />
            </MotionReveal>
          ))}
          {filteredPosts.length === 0 ? (
            <div className="theme-card-soft rounded-[32px] p-8 text-center text-sm text-[var(--color-muted)]">
              {messages.blog.empty}
            </div>
          ) : null}
        </div>
      </section>
    </Container>
  );
}
