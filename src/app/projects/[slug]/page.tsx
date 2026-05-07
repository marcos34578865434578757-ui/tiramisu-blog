import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/blog/PostContent";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";
import { getRequestLocale } from "@/lib/locale";
import { getContentFallbackCopy, getMessages } from "@/lib/messages";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects("zh");
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const { slug } = await params;
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const fallbackCopy = project.isFallback
    ? getContentFallbackCopy(locale, project.sourceLocale)
    : null;

  return (
    <Container className="py-12 sm:py-16">
      <article className="space-y-8">
        <div
          className="min-h-[360px] rounded-[36px] bg-cover bg-center shadow-[0_30px_70px_rgba(51,65,85,0.18)]"
          style={{ backgroundImage: `url('${project.cover}')` }}
        />
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
            <span>{project.date}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{project.status}</span>
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
            {project.title}
          </h1>
          <p className="max-w-3xl text-lg leading-9 text-[var(--color-copy)]">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {fallbackCopy ? (
            <div className="rounded-[24px] border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
              {fallbackCopy.long}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.demo ? (
              <Link
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_16px_34px_rgba(143,220,194,0.26)]"
              >
                {messages.projects.demo}
              </Link>
            ) : null}
            {project.github ? (
              <Link
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--color-border)] bg-white/78 px-5 py-3 text-sm font-medium text-slate-700 shadow-[0_14px_32px_rgba(51,65,85,0.08)]"
              >
                {messages.projects.github}
              </Link>
            ) : null}
          </div>
        </header>
        <div className="glass-panel rounded-[34px] px-6 py-8 sm:px-9 sm:py-10">
          <PostContent content={project.content} />
        </div>
      </article>
    </Container>
  );
}
