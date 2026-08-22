import Link from "next/link";
import { ExperienceTabs } from "@/components/ExperienceTabs";
import { PhotoStack } from "@/components/PhotoStack";
import { ProjectGrid } from "@/components/ProjectCard";
import { ResumeDownloadButton } from "@/components/ResumeDownloadButton";
import { featuredProjects } from "@/lib/portfolio-data";

export default function Home() {
  return (
    <article className="page-stack home-page">
      <section className="hero-section" aria-labelledby="intro-heading">
        <PhotoStack />
        <div className="hero-copy">
          <h1 id="intro-heading" className="display-title hero-title">
            hi, yash here. <span aria-hidden="true">👋</span>
          </h1>
          <p className="hero-location">senior software engineer from Hyderabad, India 🇮🇳</p>
          <p className="hero-description">
            Backend by profession, full-stack by practice. I build Java systems
            that handle real traffic, then use AI where it removes real work.
          </p>
          <p className="hero-proof">Current scale: about 30M requests a day and 20M monthly active members.</p>
          <div className="hero-actions">
            <ResumeDownloadButton />
            <a className="icon-link" href="https://linkedin.com/in/yash-5a56a4234" target="_blank" rel="noreferrer" aria-label="Yash on LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v9M6 6.5v.01M10 18v-5a4 4 0 0 1 8 0v5M10 9v9" /></svg>
            </a>
            <a className="icon-link" href="https://github.com/yashcodes161198" target="_blank" rel="noreferrer" aria-label="Yash on GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-6 0C5.8.1 4.7.5 4.7.5A5 5 0 0 0 4.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4M9 19c-3 .9-3-1.5-4-2" /></svg>
            </a>
            <a className="icon-link" href="mailto:yashk.code@gmail.com" aria-label="Email Yash" title="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 7l8 6 8-6" /></svg>
            </a>
          </div>
        </div>
      </section>
      <ExperienceTabs />
      <section className="section-stack" aria-labelledby="featured-heading">
        <div className="section-heading-row">
          <h2 id="featured-heading" className="display-title section-title">featured projects</h2>
          <Link className="text-link arrow-link" href="/projects">view more<span aria-hidden="true">→</span></Link>
        </div>
        <ProjectGrid projects={featuredProjects} />
      </section>
    </article>
  );
}
