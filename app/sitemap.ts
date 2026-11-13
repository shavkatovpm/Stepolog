import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://stepolog.uz", lastModified: new Date(), priority: 1 }];
}
