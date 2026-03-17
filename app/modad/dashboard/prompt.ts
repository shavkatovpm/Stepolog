import type { Content, Project, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./constants";

export function generatePrompt(c: Content, project?: Project, settings?: Settings): string {
  const s = settings || DEFAULT_SETTINGS;
  const lines: string[] = [];

  // ROL
  lines.push(s.promptRole);
  lines.push("");

  // LOYIHA
  lines.push("=== LOYIHA MA'LUMOTI ===");
  lines.push(`Loyiha: ${project?.name || "—"}`);
  if (project?.domain) lines.push(`Domen: ${project.domain}`);
  lines.push("");

  // KONTENT
  lines.push("=== KONTENT MA'LUMOTI ===");
  lines.push(`Sarlavha: ${c.title}`);
  if (c.publishDate) lines.push(`Nashr sanasi: ${c.publishDate}`);
  if (c.note) lines.push(`Izoh: ${c.note}`);
  lines.push(`Kontent turi: ${c.intent}`);
  lines.push("");

  // SEO
  lines.push("=== SEO TALABLARI ===");
  lines.push(`Asosiy keyword: ${c.keyword || "—"}`);
  if (c.keywords2) lines.push(`Qo'shimcha keywordlar: ${c.keywords2}`);
  lines.push(s.promptSeo);
  lines.push("");

  // GEO
  lines.push("=== GEO (AI INDEKSATSIYA) TALABLARI ===");
  if (c.source) lines.push(`Asosiy manba: ${c.source}`);
  if (c.facts) lines.push(`Foydalanish kerak bo'lgan faktlar:\n${c.facts}`);
  if (c.mainQuestion) lines.push(`Maqola quyidagi savolga aniq javob bersin: "${c.mainQuestion}"`);
  if (c.blogTopics) lines.push(`Blog mavzulari:\n${c.blogTopics}`);
  lines.push(`Brand nomi (${project?.name || "Stepolog"}) maqolada ${c.brandCount || 3} marta organik tarzda tilga olinsin.`);
  lines.push(s.promptGeo);
  lines.push("");

  // YOZISH QO'LLANMASI
  lines.push("=== YOZISH QO'LLANMASI ===");
  lines.push(s.promptWriting);

  return lines.join("\n");
}
