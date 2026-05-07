import type { Project } from "@/lib/projects";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";

type FeaturedProjectsContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturedProjects({
  projects,
  content,
}: {
  projects: Project[];
  content: FeaturedProjectsContent;
}) {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project, index) => (
          <MotionReveal key={project.slug} delay={index * 0.08}>
            <ProjectCard {...project} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
