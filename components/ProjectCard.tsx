import Image from "next/image";
import type { Project } from "@/lib/portfolio-data";

function ProjectVisual({ project }: { project: Project }) {
  if (project.image) return <div className="project-image-shell"><Image src={project.image} alt={`${project.name} preview`} fill sizes="(max-width: 680px) 100vw, 330px" loading="eager" /></div>;
  if (project.visual === "flag-workflow") {
    return <div className="project-generated-visual flag-visual" aria-label="Feature flag cleanup workflow"><div><span>flag</span><strong>checkout-v2</strong></div><i aria-hidden="true">→</i><div><span>references</span><strong>3 files</strong></div><i aria-hidden="true">→</i><div><span>result</span><strong>PR ready</strong></div></div>;
  }
  return <div className="project-generated-visual report-visual" aria-label="Reporting automation workflow"><div className="report-sheet"><span /><span /><span /></div><div className="report-arrow" aria-hidden="true">→</div><div className="report-output"><strong>95%</strong><span>on time</span></div></div>;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <ProjectVisual project={project} />
      <div className="project-card-body"><h3>{project.name}</h3><p>{project.description}</p></div>
      <div className="tag-list" aria-label={`${project.name} technologies`}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {project.links.length > 0 && <div className="project-links">{project.links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">{link.kind === "github" ? <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-6 0C5.8.1 4.7.5 4.7.5A5 5 0 0 0 4.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4M9 19c-3 .9-3-1.5-4-2" /> : <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>}</svg>
          {link.label}
        </a>
      ))}</div>}
    </article>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return <div className="project-grid">{projects.map((project) => <ProjectCard key={project.name} project={project} />)}</div>;
}
