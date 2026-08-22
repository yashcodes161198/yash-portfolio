import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectCard";
import { projects } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected products, engineering tools, and systems built by Yash.",
};

export default function ProjectsPage() {
  return (
    <article className="page-stack inner-page">
      <header className="page-intro">
        <h1 className="display-title">my projects.</h1>
        <p>
          Public products and selected internal tools. The useful details are on
          the cards. The resume has the rest.
        </p>
      </header>
      <ProjectGrid projects={projects} />
    </article>
  );
}
