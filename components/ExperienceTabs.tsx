"use client";

import Image from "next/image";
import { useState } from "react";
import { education, work, type TimelineEntry } from "@/lib/portfolio-data";

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="timeline-card"><ul className="timeline-list">
      {entries.map((entry) => (
        <li key={entry.name} className="timeline-item">
          <a className="timeline-logo" href={entry.href} target="_blank" rel="noreferrer" aria-label={entry.name}>
            {entry.logo ? <TimelineLogo logo={entry.logo} fallback={entry.initials} /> : entry.initials}
          </a>
          <div className="timeline-content"><h3>{entry.name}</h3>
            {entry.positions.map((position) => (
              <div className="position" key={`${position.title}-${position.start}`}>
                <div className="position-heading"><p>{position.title}</p><time>{position.start} - {position.end ?? "Present"}</time></div>
                <ul>{position.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul></div>
  );
}

function TimelineLogo({ logo, fallback }: { logo: NonNullable<TimelineEntry["logo"]>; fallback: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return <Image src={logo.src} alt={logo.alt} width={35} height={35} onError={() => setFailed(true)} />;
}

export function ExperienceTabs() {
  const [tab, setTab] = useState<"work" | "education">("work");
  return (
    <section className="experience-section" aria-label="Experience and education">
      <div className="tabs" role="tablist" aria-label="Experience">
        <button type="button" role="tab" aria-selected={tab === "work"} className={tab === "work" ? "tab active" : "tab"} onClick={() => setTab("work")}>Work</button>
        <button type="button" role="tab" aria-selected={tab === "education"} className={tab === "education" ? "tab active" : "tab"} onClick={() => setTab("education")}>Education</button>
      </div>
      <div role="tabpanel"><Timeline entries={tab === "work" ? work : education} /></div>
    </section>
  );
}
