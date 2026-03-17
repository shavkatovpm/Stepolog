export interface Project {
  id: string;
  name: string;
  domain: string;
  desc: string;
  color: string;
  customIntents?: string;
  createdAt: string;
}

export interface Content {
  id: string;
  projectId: string;
  title: string;
  publishDate: string;
  status: "planned" | "ready" | "published";
  note: string;
  keyword: string;
  keywords2: string;
  internalLink: string;
  intent: string;
  source: string;
  facts: string;
  brandCount: string;
  mainQuestion: string;
  blogTopics: string;
  contentText?: string;
  contentType: "own" | "brand";
  createdAt: string;
  readyAt?: string;
  publishedAt?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  purpose: string;
  content: string;
  createdAt: string;
}

export interface Settings {
  promptRole: string;
  promptSeo: string;
  promptGeo: string;
  promptWriting: string;
  adminLogin: string;
  adminPassword: string;
}

export interface State {
  projects: Project[];
  contents: Content[];
  currentProjectId: string | null;
  selectedColor: string;
  customIntents: { name: string; color: string }[];
  settings: Settings;
}
