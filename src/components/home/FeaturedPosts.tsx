import type { Post } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FeaturedPostsContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturedPosts({
  posts,
  content,
}: {
  posts: Post[];
  content: FeaturedPostsContent;
}) {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="space-y-5">
        {posts.map((post, index) => (
          <MotionReveal key={post.slug} delay={index * 0.08}>
            <PostCard {...post} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
