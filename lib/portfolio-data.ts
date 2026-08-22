export type Position = { title: string; start: string; end?: string; bullets: string[] };
export type TimelineEntry = {
  name: string;
  initials: string;
  href?: string;
  logo?: { src: string; alt: string };
  positions: Position[];
};
export type Project = {
  name: string;
  description: string;
  image?: string;
  visual?: "flag-workflow" | "report-workflow";
  tags: string[];
  links: { label: string; href: string; kind: "site" | "github" }[];
};

export const work: TimelineEntry[] = [
  {
    name: "ABC Fitness Solutions",
    initials: "A",
    href: "https://abcfitness.com",
    logo: { src: "/img/company/abc-fitness.png", alt: "ABC Fitness logo" },
    positions: [{
      title: "Software Development Engineer II",
      start: "Mar 2025",
      bullets: [
        "Cut P99 latency from 1,200 ms to 120 ms by redesigning filter semantics and rewriting hot-path SQL around index-friendly access patterns.",
        "Built organization-wide Oracle and BackTrak MCP tools for guarded, AI-assisted diagnostics across development, beta, staging, and production.",
        "Removed dozens of stale feature flags and saved 10+ engineering hours a month with a Jira-linked, test-verified cleanup agent.",
      ],
    }],
  },
  {
    name: "Beehyv Software Solutions",
    initials: "B",
    href: "https://www.beehyv.com",
    logo: { src: "/img/company/beehyv.png", alt: "BeeHyv logo" },
    positions: [{
      title: "Software Development Engineer, Full Stack",
      start: "Aug 2022",
      end: "Mar 2025",
      bullets: [
        "Sustained 99.9% authentication availability with circuit-breaker failover and response caching for an OTP service.",
        "Cut payroll-report generation time by 95% through SQL tuning and targeted indexes.",
        "Built a Kafka and Amazon MSK architecture delivering about 10K notifications a day.",
      ],
    }],
  },
];

export const education: TimelineEntry[] = [{
  name: "Indian Institute of Technology Ropar",
  initials: "I",
  href: "https://www.iitrpr.ac.in",
  logo: { src: "/img/company/iit-ropar.png", alt: "IIT Ropar logo" },
  positions: [{
    title: "Bachelor of Technology",
    start: "2017",
    end: "2021",
    bullets: ["Built the foundation I still use daily: algorithms, system design, databases, and distributed systems."],
  }],
}];

export const projects: Project[] = [
  {
    name: "Google DSA Interview Prep",
    description: "A Next.js platform for tracking about 770 Google interview problems, running timed mock interviews, and scheduling revision with SM-2.",
    image: "/img/google-dsa-site.png",
    tags: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    links: [
      { label: "Website", href: "https://google-dsa.vercel.app", kind: "site" },
      { label: "Source", href: "https://github.com/yashcodes161198/GoogleDSA", kind: "github" },
    ],
  },
  {
    name: "CaptureTheFlag",
    description: "An agentic engineering tool that finds stale LaunchDarkly flags, traces code references, runs tests, and opens Jira-linked cleanup pull requests.",
    visual: "flag-workflow",
    tags: ["Spring Boot", "React", "Redis", "LaunchDarkly", "GitHub API"],
    links: [],
  },
  {
    name: "HTTP Server From Scratch",
    description: "A multithreaded Java HTTP server with custom request parsing, strict validation, response construction, and a test-first design.",
    image: "/img/http-server.png",
    tags: ["Java", "HTTP/1.1", "Multithreading", "TDD"],
    links: [{ label: "Source", href: "https://github.com/yashcodes161198/simple-java-http-server", kind: "github" }],
  },
  {
    name: "Log Monitoring Application",
    description: "Streams append-only updates from 100 GB log files to multiple subscribers without loading the file into memory.",
    image: "/img/log-monitor.png",
    tags: ["Spring Boot", "React", "WebSockets", "WatchService"],
    links: [{ label: "Source", href: "https://github.com/yashcodes161198/LogMonitor", kind: "github" }],
  },
  {
    name: "Reporting Automation Platform",
    description: "A one-week full-stack LLM build that collects team metrics and generates reviewable Excel, PowerPoint, and email updates for leaders.",
    visual: "report-workflow",
    tags: ["OpenAI API", "Structured outputs", "Quartz", "React", "Spring Boot"],
    links: [],
  },
];

export const featuredProjects = projects.slice(0, 2);
