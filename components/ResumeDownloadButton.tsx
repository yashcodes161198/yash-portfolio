"use client";

export function ResumeDownloadButton() {
  const requestRefresh = () => {
    void fetch("/api/resume/refresh", {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // The current resume download must never depend on a refresh succeeding.
    });
  };

  return (
    <a
      className="button button-outline"
      href="/api/resume/download"
      onClick={requestRefresh}
    >
      <span>Resume</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
      </svg>
    </a>
  );
}
