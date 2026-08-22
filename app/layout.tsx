import type { Metadata, Viewport } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Yash | Senior Software Engineer", template: "%s | Yash" },
  description: "Senior software engineer building high-scale Java systems, full-stack products, and practical AI tools.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Yash | Senior Software Engineer",
    description: "High-scale Java systems, full-stack products, and practical AI tools.",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Yash, Senior software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash | Senior Software Engineer",
    description: "High-scale Java systems, full-stack products, and practical AI tools.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

const themeScript = `
  try {
    const saved = localStorage.getItem('yash-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
