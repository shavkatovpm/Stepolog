import type { Project, Content, Category } from "./types";

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (res.status === 401) {
    window.location.href = "/modad";
    throw new Error("Avtorizatsiya kerak");
  }
  return res;
}

// Auth
export async function checkAuth(): Promise<boolean> {
  const res = await fetch("/api/auth/me");
  return res.ok;
}

export async function logout() {
  await request("/api/auth/logout", { method: "POST" });
}

// Projects
export async function fetchProjects(): Promise<(Project & { _count: { contents: number } })[]> {
  const res = await request("/api/projects");
  return res.json();
}

export async function createProject(data: { name: string; domain: string; desc: string; positioning?: string; color: string; categoryId?: string | null }): Promise<Project> {
  const res = await request("/api/projects", { method: "POST", body: JSON.stringify(data) });
  return res.json();
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await request(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return res.json();
}

export async function deleteProject(id: string) {
  await request(`/api/projects/${id}`, { method: "DELETE" });
}

export async function reorderProjects(ids: string[]) {
  await request("/api/projects/reorder", { method: "PUT", body: JSON.stringify({ ids }) });
}

// Contents
export async function fetchContents(projectId?: string): Promise<Content[]> {
  const url = projectId ? `/api/contents?projectId=${projectId}` : "/api/contents";
  const res = await request(url);
  return res.json();
}

export async function createContent(data: Partial<Content> & { projectId: string }): Promise<Content> {
  const res = await request("/api/contents", { method: "POST", body: JSON.stringify(data) });
  return res.json();
}

export async function updateContent(id: string, data: Partial<Content>): Promise<Content> {
  const res = await request(`/api/contents/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return res.json();
}

export async function deleteContentApi(id: string) {
  await request(`/api/contents/${id}`, { method: "DELETE" });
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await request("/api/categories");
  return res.json();
}

export async function createCategory(data: { name: string; color: string }): Promise<Category> {
  const res = await request("/api/categories", { method: "POST", body: JSON.stringify(data) });
  return res.json();
}

export async function updateCategory(id: string, data: { name: string; color: string }): Promise<Category> {
  const res = await request(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return res.json();
}

export async function deleteCategory(id: string) {
  await request(`/api/categories/${id}`, { method: "DELETE" });
}

export async function reorderCategories(ids: string[]) {
  await request("/api/categories/reorder", { method: "PUT", body: JSON.stringify({ ids }) });
}

// Saved Prompts
export async function fetchSavedPrompts() {
  const res = await request("/api/saved-prompts");
  return res.json();
}

export async function createSavedPrompt(data: { title: string; purpose: string; content: string }) {
  const res = await request("/api/saved-prompts", { method: "POST", body: JSON.stringify(data) });
  return res.json();
}

export async function deleteSavedPrompt(id: string) {
  await request(`/api/saved-prompts/${id}`, { method: "DELETE" });
}

// Settings
export async function fetchSettings() {
  const res = await request("/api/settings");
  return res.json();
}

export async function updateSettings(data: Record<string, string>) {
  const res = await request("/api/settings", { method: "PUT", body: JSON.stringify(data) });
  return res.json();
}
