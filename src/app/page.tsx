import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { RecentUpdates } from "@/components/home/RecentUpdates";
import { Timeline } from "@/components/home/Timeline";
import { Container } from "@/components/layout/Container";
import { getHomeContent } from "@/lib/home-content";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { getFeaturedPosts } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const [posts, projects, homeContent] = await Promise.all([
    getFeaturedPosts(3, locale),
    getFeaturedProjects(3, locale),
    getHomeContent(),
  ]);

  const displayHomeContent =
    locale === "en"
      ? {
          hero: {
            ...messages.home.hero,
            tags: [...messages.home.hero.tags],
            highlights: [...messages.home.hero.highlights],
            stats: messages.home.hero.stats.map((item) => ({ ...item })),
          },
          currentFocus: {
            eyebrow: messages.home.recentUpdates.eyebrow,
            title: messages.home.recentUpdates.title,
            description: messages.home.recentUpdates.description,
            status: messages.home.recentUpdates.status,
            items: [...messages.home.recentUpdates.items],
            updatedAt: messages.home.recentUpdates.updatedAt,
            badgeLabel: messages.home.recentUpdates.badgeLabel,
          },
        }
      : homeContent;

  return (
    <Container wide className="py-8 sm:py-10">
      <div className="space-y-18 sm:space-y-24">
        <Hero content={displayHomeContent.hero} />
        <Timeline content={messages.home.timeline} />
        <FeaturedPosts posts={posts} content={messages.home.featuredPosts} />
        <FeaturedProjects projects={projects} content={messages.home.featuredProjects} />
        <RecentUpdates
          content={displayHomeContent.currentFocus}
          updatedAtLabel={messages.home.recentUpdates.updatedAtLabel}
        />
      </div>
    </Container>
  );
}
