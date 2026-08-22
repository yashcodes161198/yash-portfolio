import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/projects", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.7,
  }));
}
