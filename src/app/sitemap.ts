import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const baseUrl = "https://tiramisu-blog.vercel.app";

  return [
    "",
    "/blog",
    "/projects",
    "/about",
    ...posts.map((post) => `/blog/${post.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
