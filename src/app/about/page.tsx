import type { Metadata } from "next";
import { SocialLinkGrid } from "@/components/about/SocialLinkGrid";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: messages.about.title,
    description: messages.about.metaDescription,
  };
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const socialDescription =
    locale === "en"
      ? "You can find me on GitHub, Xiaohongshu, Bilibili, X, or reach me directly by email. I keep these links updated as part of this site's long-term public archive."
      : "你可以在 GitHub、小红书、Bilibili、X 上找到我，也可以直接通过邮箱联系我。这些入口会跟着这个站点一起长期维护。";

  return (
    <Container className="py-14 sm:py-18">
      <section className="space-y-12">
        <SectionHeading
          eyebrow="About"
          title={messages.about.title}
          description={messages.about.description}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="glass-panel rounded-[34px] p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {messages.about.personalNote}
            </p>
            <p className="mt-5 text-lg leading-9 text-[var(--color-copy)]">
              {profile.bio}
            </p>
            <div className="theme-card-soft mt-8 rounded-[28px] p-5">
              <p className="text-sm font-medium text-[var(--color-muted)]">
                {messages.about.contact}
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-3 inline-block text-xl font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                {profile.email}
              </a>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {messages.about.blocks.map((block) => (
              <div key={block.title} className="theme-card-soft rounded-[30px] p-6">
                <h2 className="text-xl font-semibold text-[var(--color-ink)]">
                  {block.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--color-copy)]">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {messages.about.socialsEyebrow}
            </p>
            <h2 className="text-3xl font-semibold text-[var(--color-ink)]">
              {messages.about.socialsTitle}
            </h2>
            <p className="text-base leading-8 text-[var(--color-copy)]">
              {socialDescription}
            </p>
          </div>
          <SocialLinkGrid socialLinks={profile.socialLinks} />
        </div>
      </section>
    </Container>
  );
}
