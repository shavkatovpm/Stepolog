import type { Project, Content } from "./types";

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

export async function createProject(data: { name: string; domain: string; desc: string; color: string }): Promise<Project> {
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

// Settings
export async function fetchSettings() {
  const res = await request("/api/settings");
  return res.json();
}

export async function updateSettings(data: Record<string, string>) {
  const res = await request("/api/settings", { method: "PUT", body: JSON.stringify(data) });
  return res.json();
}
