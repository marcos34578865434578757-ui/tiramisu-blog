import type { Metadata } from "next";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { getAllProjects } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: messages.projects.title,
    description: messages.projects.metaDescription,
  };
}

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const projects = await getAllProjects(locale);

  return (
    <Container className="py-14 sm:py-18">
      <section className="space-y-10">
        <SectionHeading
          eyebrow="Projects"
          title={messages.projects.title}
          description={messages.projects.description}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <MotionReveal key={project.slug} delay={index * 0.05}>
              <ProjectCard {...project} />
            </MotionReveal>
          ))}
        </div>
      </section>
    </Container>
  );
}
