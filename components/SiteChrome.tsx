"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const navLinks = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "contact", href: "/contact" },
];

const quickAnswers = {
  work: { question: "What does Yash work on?", answer: "High-scale Java and Spring Boot services, distributed systems, and practical AI tools for engineering teams." },
  proof: { question: "What is his strongest result?", answer: "A critical API path improved from 1,200 ms to 120 ms at P99. He also works on systems handling about 30M requests a day." },
  contact: { question: "How can I contact him?", answer: "Email yashk.code@gmail.com or call +91 91133 58078. The contact page has both." },
};

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [chatOpen, setChatOpen] = useState(false);
  const [answerKey, setAnswerKey] = useState<keyof typeof quickAnswers>("work");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("yash-theme", next);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">skip to content</a>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <ul className="nav-links">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return <li key={link.href}><Link className={active ? "nav-link active" : "nav-link"} href={link.href}>{link.label}</Link></li>;
            })}
          </ul>
          <div className="nav-actions">
            <button className="nav-icon-button" type="button" onClick={() => setChatOpen((open) => !open)} aria-expanded={chatOpen} aria-controls="portfolio-chat" aria-label="Toggle Yash Support">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 9h8M8 13h5" /></svg>
            </button>
            <button className="nav-icon-button theme-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /></svg>
              )}
            </button>
          </div>
        </nav>
      </header>
      <main id="main-content" className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-socials">
            <a href="https://linkedin.com/in/yash-5a56a4234" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/yashcodes161198" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:yashk.code@gmail.com">Email</a>
          </div>
          <p>© {new Date().getFullYear()} Yash</p>
        </div>
      </footer>
      {chatOpen && (
        <aside id="portfolio-chat" className="chat-panel" aria-label="Yash Support">
          <div className="chat-header"><div><span className="status-dot" aria-hidden="true" /><strong>Yash Support</strong></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></div>
          <div className="chat-body">
            <p className="chat-message assistant-message">Pick a question. I will point you to the useful part of the portfolio.</p>
            <div className="chat-prompts">
              {Object.entries(quickAnswers).map(([key, item]) => (
                <button type="button" key={key} className={answerKey === key ? "chat-prompt selected" : "chat-prompt"} onClick={() => setAnswerKey(key as keyof typeof quickAnswers)}>{item.question}</button>
              ))}
            </div>
            <p className="chat-message answer-message">{quickAnswers[answerKey].answer}</p>
          </div>
          <Link className="chat-contact-link" href="/contact" onClick={() => setChatOpen(false)}>contact Yash<span aria-hidden="true">→</span></Link>
        </aside>
      )}
    </>
  );
}
