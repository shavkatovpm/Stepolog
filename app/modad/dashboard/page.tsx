"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "../modad.css";

import type { Content, Project, Settings, State } from "./types";
import {
  DEFAULT_SETTINGS, STATUS_CONFIG, INTENT_LABELS,
  COLORS, COLOR_HEX,
  DEFAULT_PROMPT_ROLE, DEFAULT_PROMPT_SEO, DEFAULT_PROMPT_GEO, DEFAULT_PROMPT_WRITING,
} from "./constants";
import { generatePrompt } from "./prompt";
import * as api from "./api";
import DatePicker from "./components/DatePicker";
import IntentSelect from "./components/IntentSelect";
import CredentialsEditor from "./components/CredentialsEditor";
import DetailRow from "./components/DetailRow";
import StatsView from "./components/StatsView";

function getDateColor(publishDate: string, status: string): string {
  if (!publishDate) return "var(--m-text3)";
  if (status === "published") return "var(--m-green)";
  const today = new Date().toISOString().split("T")[0];
  if (publishDate === today) return "var(--m-yellow)";
  if (publishDate < today) return "var(--m-red)";
  return "var(--m-text3)";
}

function getStatusDisplay(status: string, publishDate: string): { label: string; color: string } {
  if (status === "published") return { label: "Joylashtirildi", color: "var(--m-green)" };
  if (status === "ready") return { label: "Tayyor", color: "var(--m-blue)" };
  // planned
  if (publishDate) {
    const today = new Date().toISOString().split("T")[0];
    if (publishDate < today) return { label: "Kechikdi", color: "var(--m-red)" };
    if (publishDate === today) return { label: "Bugun", color: "var(--m-yellow)" };
  }
  return { label: "Rejada", color: "var(--m-text3)" };
}

export default function ModadDashboard() {
  const router = useRouter();
  const [state, setState] = useState<State>({
    projects: [],
    contents: [],
    currentProjectId: null,
    selectedColor: "color-1",
    customIntents: [],
    settings: { ...DEFAULT_SETTINGS },
  });
  const [currentView, setCurrentView] = useState<"kanban" | "table">("table");
  const [currentPage, setCurrentPage] = useState<"projects" | "stats" | "settings">("projects");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editContentId, setEditContentId] = useState<string | null>(null);
  const [cardModalId, setCardModalId] = useState<string | null>(null);
  const [promptModalId, setPromptModalId] = useState<string | null>(null);
  const [pasteModalId, setPasteModalId] = useState<string | null>(null);

  // Form state
  const [pName, setPName] = useState("");
  const [pDomain, setPDomain] = useState("");
  const [pDesc, setPDesc] = useState("");

  const [cTitle, setCTitle] = useState("");
  const [cDate, setCDate] = useState("");
  const [cStatus, setCStatus] = useState<Content["status"]>("planned");
  const [cNote, setCNote] = useState("");
  const [cKeyword, setCKeyword] = useState("");
  const [cKeywords2, setCKeywords2] = useState("");
  const [cInternalLink, setCInternalLink] = useState("");
  const [cIntent, setCIntent] = useState("informational");
  const [contentStep, setContentStep] = useState(0);
  const [cSource, setCSource] = useState("");
  const [cFacts, setCFacts] = useState("");
  const [cBrandCount, setCBrandCount] = useState("");
  const [cMainQuestion, setCMainQuestion] = useState("");
  const [cBlogTopics, setCBlogTopics] = useState<string[]>([""]);

  const [pasteText, setPasteText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteProjectConfirmId, setDeleteProjectConfirmId] = useState<string | null>(null);
  const [projectMenuId, setProjectMenuId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragProjectId, setDragProjectId] = useState<string | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  // ===== LOAD DATA =====
  const loadData = useCallback(async () => {
    try {
      const [projectsRaw, contents, settingsRaw] = await Promise.all([
        api.fetchProjects(),
        api.fetchContents(),
        api.fetchSettings(),
      ]);
      const projects: Project[] = projectsRaw.map((p) => ({
        id: p.id, name: p.name, domain: p.domain,
        desc: p.desc, color: p.color, customIntents: p.customIntents, createdAt: p.createdAt,
      }));
      setState((s) => {
        const currentProj = s.currentProjectId ? projects.find((p) => p.id === s.currentProjectId) : null;
        const intents: { name: string; color: string }[] = currentProj?.customIntents ? JSON.parse(currentProj.customIntents) : s.customIntents;
        return {
          ...s, projects, contents, customIntents: intents,
          settings: {
            promptRole: settingsRaw.promptRole || DEFAULT_SETTINGS.promptRole,
            promptSeo: settingsRaw.promptSeo || DEFAULT_SETTINGS.promptSeo,
            promptGeo: settingsRaw.promptGeo || DEFAULT_SETTINGS.promptGeo,
            promptWriting: settingsRaw.promptWriting || DEFAULT_SETTINGS.promptWriting,
            adminLogin: "", adminPassword: "",
          },
        };
      });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    async function init() {
      const ok = await api.checkAuth();
      if (!ok) { router.push("/modad"); return; }
      await loadData();
      setLoading(false);
    }
    init();
  }, [router, loadData]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  // ===== PROJECTS =====
  function openProjectModal() {
    setEditProjectId(null);
    setPName(""); setPDomain(""); setPDesc("");
    setState((s) => ({ ...s, selectedColor: "color-1" }));
    setProjectModalOpen(true);
  }

  function openEditProject(id: string) {
    const p = state.projects.find((pr) => pr.id === id);
    if (!p) return;
    setEditProjectId(id);
    setPName(p.name); setPDomain(p.domain); setPDesc(p.desc);
    setState((s) => ({ ...s, selectedColor: p.color }));
    setProjectMenuId(null);
    setProjectModalOpen(true);
  }

  async function saveProject() {
    if (!pName.trim()) { showToast("Loyiha nomini kiriting!"); return; }
    setSaving(true);
    try {
      if (editProjectId) {
        await api.updateProject(editProjectId, { name: pName.trim(), domain: pDomain.trim(), desc: pDesc.trim(), color: state.selectedColor });
        showToast("✓ Loyiha tahrirlandi");
      } else {
        await api.createProject({ name: pName.trim(), domain: pDomain.trim(), desc: pDesc.trim(), color: state.selectedColor });
        showToast("✓ Loyiha qo'shildi");
      }
      setEditProjectId(null);
      setProjectModalOpen(false);
      await loadData();
    } finally { setSaving(false); }
  }

  async function deleteProject(id: string) {
    setSaving(true);
    try {
      await api.deleteProject(id);
      setState((s) => ({ ...s, currentProjectId: s.currentProjectId === id ? null : s.currentProjectId }));
      setDeleteProjectConfirmId(null);
      showToast("Loyiha o'chirildi");
      await loadData();
    } finally { setSaving(false); }
  }

  function openProject(id: string) {
    const project = state.projects.find((p) => p.id === id);
    const intents: { name: string; color: string }[] = project?.customIntents ? JSON.parse(project.customIntents) : [];
    setState((s) => ({ ...s, currentProjectId: id, customIntents: intents }));
    setCurrentPage("projects");
  }

  function handleProjectDrop(targetId: string) {
    if (!dragProjectId || dragProjectId === targetId) return;
    const projects = [...state.projects];
    const fromIdx = projects.findIndex((p) => p.id === dragProjectId);
    const toIdx = projects.findIndex((p) => p.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = projects.splice(fromIdx, 1);
    projects.splice(toIdx, 0, moved);
    setState((s) => ({ ...s, projects }));
    setDragProjectId(null);
    setDragOverProjectId(null);
    api.reorderProjects(projects.map((p) => p.id));
  }

  function showProjects() {
    setState((s) => ({ ...s, currentProjectId: null }));
    setCurrentPage("projects");
  }

  // ===== CONTENT =====
  function openContentModal() {
    setEditContentId(null); setContentStep(0);
    setCTitle(""); setCDate(new Date().toISOString().split("T")[0]);
    setCStatus("planned"); setCNote(""); setCKeyword(""); setCKeywords2("");
    setCInternalLink(""); setCIntent(""); setCSource("");
    setCFacts(""); setCBrandCount(""); setCMainQuestion(""); setCBlogTopics([""]);
    setContentModalOpen(true);
  }

  function openEditContentModal(id: string) {
    setContentStep(0);
    const c = state.contents.find((x) => x.id === id);
    if (!c) return;
    setEditContentId(id);
    setCTitle(c.title); setCDate(c.publishDate); setCStatus(c.status as Content["status"]);
    setCNote(c.note); setCKeyword(c.keyword); setCKeywords2(c.keywords2);
    setCInternalLink(c.internalLink); setCIntent(c.intent); setCSource(c.source);
    setCFacts(c.facts); setCBrandCount(c.brandCount); setCMainQuestion(c.mainQuestion);
    setCBlogTopics(c.blogTopics ? c.blogTopics.split("\n") : [""]);
    setContentModalOpen(true);
  }

  async function saveContent() {
    if (!cTitle.trim()) { showToast("Sarlavhani kiriting!"); return; }
    setSaving(true);
    try {
      const data = {
        title: cTitle.trim(), publishDate: cDate, status: cStatus, note: cNote.trim(),
        keyword: cKeyword.trim(), keywords2: cKeywords2.trim(), internalLink: cInternalLink.trim(),
        intent: cIntent, source: cSource.trim(), facts: cFacts.trim(),
        brandCount: cBrandCount || "3", mainQuestion: cMainQuestion.trim(),
        blogTopics: cBlogTopics.map(t => t.trim()).filter(Boolean).join("\n"),
      };
      if (editContentId) {
        await api.updateContent(editContentId, data);
        showToast("✓ Kontent yangilandi");
      } else {
        await api.createContent({ ...data, projectId: state.currentProjectId! });
        showToast("✓ Kontent qo'shildi");
      }
      setContentModalOpen(false);
      await loadData();
    } finally { setSaving(false); }
  }

  async function deleteContent(id: string) {
    setSaving(true);
    try {
      await api.deleteContentApi(id);
      setDeleteConfirmId(null);
      setCardModalId(null);
      showToast("Kontent o'chirildi");
      await loadData();
    } finally { setSaving(false); }
  }

  async function changeStatus(id: string, status: Content["status"]) {
    setSaving(true);
    try {
      await api.updateContent(id, { status });
      showToast("✓ Holat o'zgartirildi");
      await loadData();
    } finally { setSaving(false); }
  }

  async function saveContentText(id: string, text: string) {
    await api.updateContent(id, { contentText: text });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    showToast("✓ Nusxa olindi!");
  }

  // ===== PASTE MODAL =====
  function openPasteModal(id: string) {
    setPasteText("");
    setPasteModalId(id);
  }

  async function confirmPaste() {
    if (!pasteModalId) return;
    setSaving(true);
    try {
      await api.updateContent(pasteModalId, { status: "ready", contentText: pasteText });
      setPasteModalId(null);
      setCardModalId(null);
      showToast("✓ Kontent saqlandi, holat: Tayyor");
      await loadData();
    } finally { setSaving(false); }
  }

  // ===== SETTINGS =====
  async function updateSettingsField(key: string, value: string) {
    setState((s) => ({ ...s, settings: { ...s.settings, [key]: value } }));
    await api.updateSettings({ [key]: value });
  }

  async function addCustomIntent(name: string, color: string) {
    if (!state.currentProjectId) return;
    const updated = [...state.customIntents, { name, color }];
    setState((s) => ({ ...s, customIntents: updated }));
    await api.updateProject(state.currentProjectId, { customIntents: JSON.stringify(updated) });
    await loadData();
  }

  async function removeCustomIntent(name: string) {
    if (!state.currentProjectId) return;
    const updated = state.customIntents.filter((i) => i.name !== name);
    setState((s) => ({ ...s, customIntents: updated }));
    await api.updateProject(state.currentProjectId, { customIntents: JSON.stringify(updated) });
    await loadData();
  }

  function getIntentColor(intent: string): string {
    const found = state.customIntents.find((i) => i.name === intent);
    return found?.color || "var(--m-text3)";
  }

  async function resetPrompts() {
    await api.updateSettings({ promptRole: DEFAULT_PROMPT_ROLE, promptSeo: DEFAULT_PROMPT_SEO, promptGeo: DEFAULT_PROMPT_GEO, promptWriting: DEFAULT_PROMPT_WRITING });
    setState((s) => ({ ...s, settings: { ...s.settings, promptRole: DEFAULT_PROMPT_ROLE, promptSeo: DEFAULT_PROMPT_SEO, promptGeo: DEFAULT_PROMPT_GEO, promptWriting: DEFAULT_PROMPT_WRITING } }));
    showToast("Barcha shablonlar qayta tiklandi");
  }

  async function updateCredentials(login: string, password: string) {
    await api.updateSettings({ adminLogin: login, adminPassword: password });
    showToast("✓ Kirish ma'lumotlari yangilandi");
  }

  // ===== COMPUTED =====
  const currentProject = state.projects.find((p) => p.id === state.currentProjectId);
  const projectContents = state.contents
    .filter((c) => c.projectId === state.currentProjectId)
    .sort((a, b) => (a.publishDate || "").localeCompare(b.publishDate || ""));
  const cardContent = cardModalId ? state.contents.find((c) => c.id === cardModalId) : null;
  const promptContent = promptModalId ? state.contents.find((c) => c.id === promptModalId) : null;
  const pasteContent = pasteModalId ? state.contents.find((c) => c.id === pasteModalId) : null;
  const deleteContent_ = deleteConfirmId ? state.contents.find((c) => c.id === deleteConfirmId) : null;
  const deleteProject_ = deleteProjectConfirmId ? state.projects.find((p) => p.id === deleteProjectConfirmId) : null;

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  async function handleLogout() {
    await api.logout();
    router.push("/modad");
  }

  // Prevent accidental back navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ===== PDF EXPORT =====
  function exportPDF() {
    if (!currentProject || projectContents.length === 0) { showToast("Eksport uchun kontent yo'q"); return; }
    const statusLabels: Record<string, string> = { planned: "Rejada", ready: "Tayyor", published: "Joylashtirildi" };
    const rows = projectContents.map((c) =>
      `<tr><td>${c.title}</td><td>${c.publishDate || "—"}</td><td>${statusLabels[c.status] || c.status}</td><td>${c.keyword || "—"}</td><td>${INTENT_LABELS[c.intent] || c.intent || "—"}</td></tr>`
    ).join("");
    const planned = projectContents.filter((c) => c.status === "planned").length;
    const ready = projectContents.filter((c) => c.status === "ready").length;
    const published = projectContents.filter((c) => c.status === "published").length;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${currentProject.name} — Kontent rejasi</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;color:#111;padding:32px;font-size:13px;}h1{font-size:22px;margin-bottom:4px;}.sub{color:#666;font-size:12px;margin-bottom:20px;}.stats{display:flex;gap:20px;margin-bottom:20px;}.stat{background:#f5f5f5;border-radius:8px;padding:10px 16px;text-align:center;}.stat-n{font-size:20px;font-weight:800;display:block;}.stat-l{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.06em;}table{width:100%;border-collapse:collapse;margin-top:4px;}th{background:#f5f5f5;text-align:left;padding:10px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#666;border-bottom:2px solid #ddd;}td{padding:10px 12px;border-bottom:1px solid #eee;font-size:12px;}tr:nth-child(even){background:#fafafa;}.footer{margin-top:24px;font-size:10px;color:#aaa;text-align:center;}</style></head><body>
  <h1>${currentProject.name}</h1>
  <div class="sub">${currentProject.domain || ""} — Kontent rejasi · ${new Date().toLocaleDateString("uz")}</div>
  <div class="stats">
    <div class="stat"><span class="stat-n">${projectContents.length}</span><span class="stat-l">Jami</span></div>
    <div class="stat"><span class="stat-n">${planned}</span><span class="stat-l">Rejada</span></div>
    <div class="stat"><span class="stat-n">${ready}</span><span class="stat-l">Tayyor</span></div>
    <div class="stat"><span class="stat-n">${published}</span><span class="stat-l">Joylashtirildi</span></div>
  </div>
  <table><thead><tr><th>Mavzu</th><th>Chiqish sanasi</th><th>Holat</th><th>Keyword</th><th>Turi</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="footer">Stepolog.uz — ${new Date().toISOString().split("T")[0]}</div>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) { showToast("Popup bloklangan — ruxsat bering"); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 300);
  }

  if (loading) {
    return (
      <div className="modad-app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--m-text3)", fontSize: 14 }}>Yuklanmoqda...</div>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className="modad-app" onClick={() => setProjectMenuId(null)}>
      {/* TOPBAR */}
      <div className="m-topbar">
        <div className="m-topbar-left">
          <div className="m-logo" onClick={showProjects} style={{ cursor: "pointer" }}>STEPOLOG</div>
        </div>
        <div className="m-topbar-right">
          {!state.currentProjectId && (
            <button className="m-btn-new-project" onClick={openProjectModal}>
              <span>+</span> Yangi Loyiha
            </button>
          )}
          <button className="m-btn-logout" onClick={() => setLogoutConfirmOpen(true)}>Chiqish</button>
        </div>
      </div>

      <div className="m-layout">
        {/* SIDEBAR */}
        <aside className="m-sidebar">
          <div className="m-sidebar-section">
            <div className="m-sidebar-label">Loyihalar</div>
            <div>
              {state.projects.length === 0 ? (
                <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--m-text3)" }}>Hali loyiha yo&apos;q</div>
              ) : (
                state.projects.map((p) => {
                  const count = state.contents.filter((c) => c.projectId === p.id).length;
                  return (
                    <div
                      key={p.id}
                      className={`m-project-item ${state.currentProjectId === p.id ? "active" : ""}${dragOverProjectId === p.id ? " drag-over" : ""}`}
                      draggable
                      onDragStart={(e) => { setDragProjectId(p.id); e.dataTransfer.effectAllowed = "move"; }}
                      onDragOver={(e) => { e.preventDefault(); setDragOverProjectId(p.id); }}
                      onDragLeave={() => setDragOverProjectId(null)}
                      onDrop={(e) => { e.preventDefault(); handleProjectDrop(p.id); }}
                      onDragEnd={() => { setDragProjectId(null); setDragOverProjectId(null); }}
                      onClick={() => openProject(p.id)}
                    >
                      <div style={{ cursor: "grab", display: "flex", alignItems: "center", color: "var(--m-text3)", fontSize: 10, flexShrink: 0 }}>⠿</div>
                      <div className={`m-project-dot m-${p.color}`} />
                      <span className="m-project-name">{p.name}</span>
                      <span className="m-project-count">{count}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="m-sidebar-footer">
            <div className={`m-sidebar-nav-item ${!state.currentProjectId && currentPage === "stats" ? "active" : ""}`} onClick={() => { setState((s) => ({ ...s, currentProjectId: null })); setCurrentPage("stats"); }}>
              <span>📊</span> Statistika
            </div>
            <div className={`m-sidebar-nav-item ${!state.currentProjectId && currentPage === "settings" ? "active" : ""}`} onClick={() => { setState((s) => ({ ...s, currentProjectId: null })); setCurrentPage("settings"); }}>
              <span>⚙️</span> Sozlamalar
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="m-main">
          {/* PROJECTS VIEW */}
          {!state.currentProjectId && currentPage === "projects" && (
            <div className="m-view">
              <div className="m-page-header">
                <div className="m-page-title">BARCHA LOYIHALAR</div>
                <div className="m-page-sub">Loyihani tanlang yoki yangi loyiha qo&apos;shing</div>
              </div>
              <div className="m-projects-grid">
                {state.projects.map((p, i) => {
                  const contents = state.contents.filter((c) => c.projectId === p.id);
                  const ready = contents.filter((c) => c.status === "ready" || c.status === "published").length;
                  const today = new Date().toISOString().split("T")[0];
                  const todayCount = contents.filter((c) => c.publishDate === today && c.status !== "published").length;
                  const overdueCount = contents.filter((c) => c.publishDate && c.publishDate < today && c.status !== "published").length;
                  return (
                    <div key={p.id} className="m-project-card" style={{ animationDelay: `${i * 0.07}s`, "--card-color": COLOR_HEX[p.color] || "var(--m-border)" } as React.CSSProperties} onClick={() => openProject(p.id)}>
                      <div className="m-pc-header">
                        <div className="m-pc-dot-wrap">
                          <div className={`m-pc-dot m-${p.color}`} />
                          <span className="m-pc-domain">{p.domain || "domen yo'q"}</span>
                          {overdueCount > 0 && <span className="m-pc-badge m-pc-badge-red">{overdueCount}</span>}
                          {todayCount > 0 && <span className="m-pc-badge m-pc-badge-yellow">{todayCount}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                          <button className="m-pc-menu" onClick={(e) => { e.stopPropagation(); setProjectMenuId(projectMenuId === p.id ? null : p.id); }}>⋯</button>
                          {projectMenuId === p.id && (
                            <div className="m-dropdown" onClick={(e) => e.stopPropagation()}>
                              <button className="m-dropdown-item" onClick={() => openEditProject(p.id)}>Tahrirlash</button>
                              <button className="m-dropdown-item m-dropdown-danger" onClick={() => { setProjectMenuId(null); setDeleteProjectConfirmId(p.id); }}>O&apos;chirish</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="m-pc-name">{p.name}</div>
                      <div className="m-pc-desc">{p.desc || "Tavsif qo'shilmagan"}</div>
                      <div className="m-pc-stats">
                        <div className="m-pc-stat"><span className="m-pc-stat-n">{contents.length}</span><span className="m-pc-stat-l">Kontent</span></div>
                        <div className="m-pc-stat"><span className="m-pc-stat-n">{ready}</span><span className="m-pc-stat-l">Tayyor</span></div>
                      </div>
                    </div>
                  );
                })}
                <div className="m-add-project-card" onClick={openProjectModal}>
                  <div className="m-add-icon">+</div>
                  <div className="m-add-label">Yangi loyiha qo&apos;sh</div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECT DETAIL VIEW */}
          {state.currentProjectId && currentProject && (
            <div className="m-view">
              <div className="m-detail-header">
                <button className="m-back-btn" onClick={showProjects}>← Orqaga</button>
                <div className="m-detail-title-row">
                  <div className="m-detail-project-name">{currentProject.name}</div>
                  <div className="m-detail-domain">{currentProject.domain}</div>
                </div>
                <div className="m-detail-actions">
                  <div className="m-view-toggle">
                    <button className={`m-vt-btn ${currentView === "kanban" ? "active" : ""}`} onClick={() => setCurrentView("kanban")}>⊞ Kanban</button>
                    <button className={`m-vt-btn ${currentView === "table" ? "active" : ""}`} onClick={() => setCurrentView("table")}>☰ Jadval</button>
                  </div>
                  <button className="m-btn-action m-btn-ghost" onClick={exportPDF}>↓ PDF</button>
                  <button className="m-btn-add-content" onClick={openContentModal}>+ Kontent qo&apos;sh</button>
                </div>
              </div>

              {/* Stats */}
              <div className="m-kanban-stats">
                {(["planned", "ready", "published"] as const).map((key) => (
                  <div className="m-ks" key={key}>
                    <span className="m-ks-n" style={{ color: STATUS_CONFIG[key].color }}>{projectContents.filter((c) => c.status === key).length}</span>
                    <span className="m-ks-l">{STATUS_CONFIG[key].label}</span>
                  </div>
                ))}
                <div className="m-ks">
                  <span className="m-ks-n">{projectContents.length}</span>
                  <span className="m-ks-l">Jami</span>
                </div>
              </div>

              {/* KANBAN VIEW */}
              {currentView === "kanban" && (
                <div className="m-kanban">
                  {(["planned", "ready", "published"] as const).map((key) => {
                    const cards = projectContents.filter((c) => c.status === key);
                    return (
                      <div className="m-kanban-col" key={key}>
                        <div className="m-col-header">
                          <div className="m-col-title">
                            <div className="m-col-dot" style={{ background: STATUS_CONFIG[key].color }} />
                            {STATUS_CONFIG[key].label}
                          </div>
                          <span className="m-col-count">{cards.length}</span>
                        </div>
                        <div className="m-col-cards">
                          {cards.length === 0 ? (
                            <div className="m-empty-col"><button className="m-btn-action m-btn-ghost" onClick={openContentModal}>+ Kontent qo&apos;shish</button></div>
                          ) : (
                            cards.map((c) => (
                              <div key={c.id} className="m-content-card" onClick={() => setCardModalId(c.id)}>
                                <div className="m-cc-top">
                                  <span className="m-cc-intent" style={{ background: `${getIntentColor(c.intent)}22`, color: getIntentColor(c.intent) }}>{c.intent || "—"}</span>
                                  <span className="m-cc-date" style={{ color: getDateColor(c.publishDate, c.status) }}>{c.publishDate || "—"}</span>
                                </div>
                                <div className="m-cc-title">{c.title}</div>
                                {c.keyword && <div className="m-cc-keyword">🔑 {c.keyword}</div>}
                                {key === "ready" && c.contentText && <div style={{ marginTop: 8, fontSize: 10, color: "var(--m-blue)", fontWeight: 700 }}>✓ Kontent saqlangan</div>}
                                {key === "ready" && !c.contentText && <div style={{ marginTop: 8, fontSize: 10, color: "var(--m-yellow)", fontWeight: 600 }}>⚠ Kontent matni yo&apos;q</div>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TABLE VIEW */}
              {currentView === "table" && (
                <>
                <div className="m-table-wrap">
                  <table>
                    <thead><tr><th>Mavzu</th><th>Chiqish sanasi</th><th>Holat</th><th>Keyword</th><th>Turi</th></tr></thead>
                    <tbody>
                      {projectContents.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--m-text3)" }}>Hali kontent yo&apos;q</td></tr>
                      ) : (
                        projectContents.map((c) => (
                          <tr key={c.id} onClick={() => setCardModalId(c.id)}>
                            <td className="m-td-title">{c.title}</td>
                            <td className="m-td-date" style={{ color: getDateColor(c.publishDate, c.status) }}>{c.publishDate || "—"}</td>
                            <td>
                              {(() => { const s = getStatusDisplay(c.status, c.publishDate); return (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: s.color }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0, display: "inline-block" }} />
                                {s.label}
                              </span>
                              ); })()}
                            </td>
                            <td className="m-td-keyword">{c.keyword || "—"}</td>
                            <td><span className="m-cc-intent" style={{ fontSize: 10, background: `${getIntentColor(c.intent)}22`, color: getIntentColor(c.intent) }}>{c.intent || "—"}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="m-table-wrap" style={{ marginTop: -1 }}>
                  <table>
                    <tbody>
                      <tr onClick={openContentModal} style={{ cursor: "pointer" }}>
                        <td colSpan={5} style={{ color: "var(--m-text3)", fontSize: 13, fontWeight: 600, padding: "12px 16px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 18, height: 18, border: "1.5px dashed var(--m-border2)", borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--m-text3)" }}>+</span>
                            Yangi kontent qo&apos;shish
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </>
              )}
            </div>
          )}

          {/* STATS VIEW */}
          {currentPage === "stats" && !state.currentProjectId && (
            <StatsView projects={state.projects} contents={state.contents} onOpenProject={openProject} />
          )}

          {/* SETTINGS VIEW */}
          {currentPage === "settings" && !state.currentProjectId && (
            <div className="m-view">
              <div className="m-page-header"><div className="m-page-title">SOZLAMALAR</div></div>
              <div style={{ padding: "24px 0", display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Prompt shablonlari */}
                {([
                  { key: "promptRole", icon: "🎭", title: "PROMPT: ROL", desc: "AI ga beriladigan asosiy rol ta'rifi.", minH: 80 },
                  { key: "promptSeo", icon: "🔍", title: "PROMPT: SEO TALABLARI", desc: "SEO bo'yicha qo'shimcha ko'rsatmalar.", minH: 100 },
                  { key: "promptGeo", icon: "🤖", title: "PROMPT: GEO (AI INDEKSATSIYA)", desc: "AI indeksatsiya uchun ko'rsatmalar.", minH: 100 },
                  { key: "promptWriting", icon: "✍️", title: "PROMPT: YOZISH QO'LLANMASI", desc: "Kontent yozish uslubi va formati.", minH: 120 },
                ] as const).map(({ key, icon, title, desc, minH }) => (
                  <div className="m-form-section" key={key}>
                    <div className="m-form-section-title"><span className="m-form-section-icon">{icon}</span> {title}</div>
                    <p style={{ fontSize: 12, color: "var(--m-text3)", marginBottom: 10 }}>{desc}</p>
                    <textarea
                      className="m-form-textarea"
                      style={{ minHeight: minH, fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                      value={state.settings[key]}
                      onBlur={(e) => updateSettingsField(key, e.target.value)}
                      onChange={(e) => setState((s) => ({ ...s, settings: { ...s.settings, [key]: e.target.value } }))}
                    />
                  </div>
                ))}

                <button className="m-btn-action m-btn-ghost" style={{ fontSize: 12 }} onClick={resetPrompts}>
                  Barcha shablonlarni standart holatga qaytarish
                </button>

                {/* Login/Parol */}
                <div className="m-form-section">
                  <div className="m-form-section-title"><span className="m-form-section-icon">🔐</span> KIRISH MA&apos;LUMOTLARI</div>
                  <CredentialsEditor currentLogin={state.settings.adminLogin} currentPassword={state.settings.adminPassword} onSave={updateCredentials} />
                </div>

                {/* Chiqish */}
                <div className="m-form-section">
                  <div className="m-form-section-title"><span className="m-form-section-icon">🚪</span> SESSIYA</div>
                  <button className="m-btn-action m-btn-ghost" onClick={() => setLogoutConfirmOpen(true)}>Chiqish</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== PROJECT MODAL ===== */}
      <div className={`m-modal-overlay ${projectModalOpen ? "open" : ""}`} onClick={() => setProjectModalOpen(false)}>
        <div className="m-modal" onClick={(e) => e.stopPropagation()}>
          <div className="m-modal-header">
            <div className="m-modal-title">{editProjectId ? "LOYIHANI TAHRIRLASH" : "YANGI LOYIHA"}</div>
            <button className="m-modal-close" onClick={() => setProjectModalOpen(false)}>✕</button>
          </div>
          <div className="m-modal-body">
            <div className="m-form-grid">
              <div className="m-form-group"><label className="m-form-label">Loyiha nomi *</label><input className="m-form-input" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Masalan: Stepolog.uz" /></div>
              <div className="m-form-group"><label className="m-form-label">Domen</label><input className="m-form-input" value={pDomain} onChange={(e) => setPDomain(e.target.value)} placeholder="stepolog.uz" /></div>
              <div className="m-form-group m-form-full"><label className="m-form-label">Tavsif</label><input className="m-form-input" value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Loyiha haqida qisqacha..." /></div>
              <div className="m-form-group m-form-full">
                <label className="m-form-label">Rang</label>
                <div className="m-color-picker">
                  {COLORS.map((c) => (<div key={c} className={`m-color-option m-${c} ${state.selectedColor === c ? "selected" : ""}`} onClick={() => setState((s) => ({ ...s, selectedColor: c }))} />))}
                </div>
              </div>
            </div>
          </div>
          <div className="m-modal-footer">
            <button className="m-btn-cancel" onClick={() => setProjectModalOpen(false)} disabled={saving}>Bekor</button>
            <button className="m-btn-save" onClick={saveProject} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
          </div>
        </div>
      </div>

      {/* ===== CONTENT MODAL (WIZARD) ===== */}
      <div className={`m-modal-overlay ${contentModalOpen ? "open" : ""}`}>
        <div className="m-modal m-modal-wizard" onClick={(e) => e.stopPropagation()}>
          <div className="m-modal-header m-wizard-header">
            <div className="m-wizard-top-row">
              <div className="m-modal-title">{editContentId ? "KONTENTNI TAHRIRLASH" : "KONTENT QO\u0027SH"}</div>
              <div className="m-wizard-section-name">{["📋 Umumiy ma\u0027lumot", "🔍 SEO ma\u0027lumotlari", "🤖 AI indeksatsiya"][contentStep]}</div>
            </div>
            <div className="m-steps">
              {["Umumiy", "SEO", "GEO"].map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {i > 0 && <div className={`m-step-line ${contentStep > i - 1 ? "done" : ""}`} />}
                  <div className={`m-step ${contentStep === i ? "active" : ""} ${contentStep > i ? "done" : ""}`} onClick={() => setContentStep(i)}>
                    <span className="m-step-num">{contentStep > i ? "✓" : i + 1}</span>
                    <span className="m-step-label">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="m-modal-body">
            {contentStep === 0 && (
              <div className="m-form-section" style={{ marginBottom: 0 }}>
                <div className="m-form-grid">
                  <div className="m-form-group m-form-full"><label className="m-form-label">Kontent sarlavhasi *</label><input className="m-form-input" value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Masalan: O'zbekistonda startap qanday ochiladi?" /></div>
                  <div className="m-form-group"><label className="m-form-label">Chiqish sanasi *</label><DatePicker value={cDate} onChange={setCDate} /></div>
                  <div className="m-form-group"><label className="m-form-label">Holat</label><select className="m-form-select" value={cStatus} onChange={(e) => setCStatus(e.target.value as Content["status"])}><option value="planned">📋 Rejada</option><option value="ready">✅ Tayyor</option><option value="published">🚀 Joylashtirildi</option></select></div>
                  <div className="m-form-group m-form-full"><label className="m-form-label">Izoh</label><input className="m-form-input" value={cNote} onChange={(e) => setCNote(e.target.value)} placeholder="Qo'shimcha eslatma..." /></div>
                </div>
              </div>
            )}
            {contentStep === 1 && (
              <div className="m-form-section" style={{ marginBottom: 0 }}>
                <div className="m-form-grid">
                  <div className="m-form-group"><label className="m-form-label">Asosiy keyword *</label><input className="m-form-input" value={cKeyword} onChange={(e) => setCKeyword(e.target.value)} placeholder="startap ochish o'zbekiston" /></div>
                  <div className="m-form-group"><label className="m-form-label">Kontent turi *</label><IntentSelect value={cIntent} onChange={setCIntent} customIntents={state.customIntents} onAdd={addCustomIntent} onRemove={removeCustomIntent} /></div>
                  <div className="m-form-group m-form-full"><label className="m-form-label">Qo&apos;shimcha keywordlar</label><input className="m-form-input" value={cKeywords2} onChange={(e) => setCKeywords2(e.target.value)} placeholder="biznes ochish, startap ro'yxatdan o'tkazish, ... (vergul bilan)" /></div>
                  <div className="m-form-group m-form-full">
                    <label className="m-form-label">Blog mavzulari</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {cBlogTopics.map((topic: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ color: "var(--m-text3)", fontSize: 12, minWidth: 20 }}>{i + 1}.</span>
                          <input className="m-form-input" value={topic} onChange={(e) => { const updated = [...cBlogTopics]; updated[i] = e.target.value; setCBlogTopics(updated); }} placeholder={`Mavzu ${i + 1}`} />
                          {cBlogTopics.length > 1 && <button type="button" className="m-btn-action m-btn-ghost" style={{ padding: "4px 8px", fontSize: 14 }} onClick={() => setCBlogTopics(cBlogTopics.filter((_: string, j: number) => j !== i))}>✕</button>}
                        </div>
                      ))}
                      <button type="button" className="m-btn-action m-btn-ghost" style={{ alignSelf: "flex-start", marginLeft: 26, fontSize: 13 }} onClick={() => setCBlogTopics([...cBlogTopics, ""])}>+ Mavzu qo&apos;shish</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {contentStep === 2 && (
              <div className="m-form-section" style={{ marginBottom: 0 }}>
                <div className="m-form-grid">
                  <div className="m-form-group m-form-full"><label className="m-form-label">Asosiy manba</label><input className="m-form-input" value={cSource} onChange={(e) => setCSource(e.target.value)} placeholder="gov.uz, lex.uz, stat.uz ..." /></div>
                  <div className="m-form-group m-form-full"><label className="m-form-label">Faktlar / statistika</label><textarea className="m-form-textarea" value={cFacts} onChange={(e) => setCFacts(e.target.value)} placeholder="Masalan: O'zbekistonda 2023 yilda 12,000 dan ortiq startap ro'yxatdan o'tgan..." /></div>
                  <div className="m-form-group"><label className="m-form-label">Brand nomi soni</label><input className="m-form-input" type="number" value={cBrandCount} onChange={(e) => setCBrandCount(e.target.value)} placeholder="3" min={1} max={20} /></div>
                  <div className="m-form-group"><label className="m-form-label">Asosiy savol</label><input className="m-form-input" value={cMainQuestion} onChange={(e) => setCMainQuestion(e.target.value)} placeholder="O'zbekistonda startap qanday ochiladi?" /></div>
                </div>
              </div>
            )}
          </div>
          <div className="m-modal-footer">
            {contentStep > 0 ? <button className="m-btn-action m-btn-ghost" onClick={() => setContentStep(contentStep - 1)} disabled={saving}>← Orqaga</button> : <button className="m-btn-cancel" onClick={() => setContentModalOpen(false)} disabled={saving}>Bekor</button>}
            {contentStep < 2 ? <button className="m-btn-save" onClick={() => { if (contentStep === 0 && !cTitle.trim()) { showToast("Sarlavhani kiriting!"); return; } if (contentStep === 1 && !cIntent.trim()) { showToast("Kontent turini tanlang!"); return; } setContentStep(contentStep + 1); }}>Keyingi →</button> : <button className="m-btn-save" onClick={saveContent} disabled={saving}>{saving ? "Saqlanmoqda..." : editContentId ? "Yangilash" : "Saqlash"}</button>}
          </div>
        </div>
      </div>

      {/* ===== CARD DETAIL MODAL ===== */}
      <div className={`m-modal-overlay ${cardContent ? "open" : ""}`} onClick={() => setCardModalId(null)}>
        <div className="m-modal" style={{ maxWidth: 780 }} onClick={(e) => e.stopPropagation()}>
          {cardContent && (
            <>
              <div className="m-modal-header">
                <div style={{ flex: 1 }}>
                  <div className="m-modal-title" style={{ fontSize: 20 }}>{cardContent.title}</div>
                  <div style={{ fontSize: 11, color: "var(--m-text3)", marginTop: 3 }}>
                    {(() => { const s = getStatusDisplay(cardContent.status, cardContent.publishDate); return <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>; })()}
                    {cardContent.publishDate && <> &nbsp;·&nbsp; 📅 {cardContent.publishDate}</>}
                    {cardContent.keyword && <> &nbsp;·&nbsp; 🔑 {cardContent.keyword}</>}
                  </div>
                </div>
                <button className="m-modal-close" onClick={() => setCardModalId(null)}>✕</button>
              </div>
              <div className="m-modal-body">
                <div className="m-date-row">
                  <DetailRow label="Chiqish sanasi" value={cardContent.publishDate} />
                  <DetailRow label="Yaratilgan" value={typeof cardContent.createdAt === 'string' ? cardContent.createdAt.split("T")[0] : ""} />
                  {cardContent.readyAt && <DetailRow label="Tayyor bo'lgan" value={typeof cardContent.readyAt === 'string' ? cardContent.readyAt.split("T")[0] : ""} />}
                  {cardContent.publishedAt && <DetailRow label="Joylashtirilgan" value={typeof cardContent.publishedAt === 'string' ? cardContent.publishedAt.split("T")[0] : ""} />}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
                  <div>
                    <div className="m-detail-section-title">🔍 SEO</div>
                    <DetailRow label="Asosiy keyword" value={cardContent.keyword} />
                    <DetailRow label="Qo'shimcha keywordlar" value={cardContent.keywords2} />
                    <DetailRow label="Kontent turi" value={INTENT_LABELS[cardContent.intent] || cardContent.intent} />
                  </div>
                  <div>
                    <div className="m-detail-section-title">🤖 GEO</div>
                    <DetailRow label="Manba sayt" value={cardContent.source} />
                    <DetailRow label="Brand nomi soni" value={cardContent.brandCount} />
                    <DetailRow label="Asosiy savol" value={cardContent.mainQuestion} />
                  </div>
                </div>
                {cardContent.facts && <div style={{ marginBottom: 14 }}><DetailRow label="Faktlar / statistika" value="" /><div className="m-facts-box">{cardContent.facts}</div></div>}
                {cardContent.note && <DetailRow label="Izoh" value={cardContent.note} />}
                {cardContent.status === "ready" && <div><div className="m-detail-section-title">Tayyor kontent matni</div><textarea className="m-card-textarea" placeholder="AI yozgan tayyor blog matnini shu yerga paste qiling..." defaultValue={cardContent.contentText || ""} onBlur={(e) => saveContentText(cardContent.id, e.target.value)} /></div>}
                {cardContent.status === "published" && cardContent.contentText && <div><div className="m-detail-section-title">Joylashtirilgan kontent</div><div className="m-facts-box" style={{ maxHeight: 300 }}>{cardContent.contentText}</div></div>}
              </div>
              <div className="m-modal-footer">
                <button className="m-btn-action m-btn-dim" style={{ marginRight: "auto" }} disabled={saving} onClick={() => { setCardModalId(null); setTimeout(() => setDeleteConfirmId(cardContent.id), 100); }}>O&apos;chirish</button>
                <button className="m-btn-action m-btn-ghost" disabled={saving} onClick={() => { setCardModalId(null); setTimeout(() => openEditContentModal(cardContent.id), 100); }}>Tahrirlash</button>
                {cardContent.status === "planned" && <button className="m-btn-action m-btn-blue" disabled={saving} onClick={() => { setCardModalId(null); setTimeout(() => openPasteModal(cardContent.id), 100); }}>✓ Tayyor</button>}
                {cardContent.status === "ready" && (
                  <>
                    <button className="m-btn-action m-btn-ghost" disabled={saving} onClick={() => { setCardModalId(null); changeStatus(cardContent.id, "planned"); }}>← Rejaga</button>
                    <button className="m-btn-action m-btn-ghost" onClick={() => cardContent.contentText && copyToClipboard(cardContent.contentText)}>Nusxa</button>
                    <button className="m-btn-action m-btn-green" disabled={saving} onClick={() => { setCardModalId(null); changeStatus(cardContent.id, "published"); }}>Joylashtir</button>
                  </>
                )}
                {cardContent.status === "published" && (
                  <>
                    <button className="m-btn-action m-btn-ghost" onClick={() => cardContent.contentText && copyToClipboard(cardContent.contentText)}>Nusxa</button>
                    <button className="m-btn-action m-btn-ghost" disabled={saving} onClick={() => { setCardModalId(null); changeStatus(cardContent.id, "ready"); }}>← Tayyorga</button>
                  </>
                )}
                <button className="m-btn-action m-btn-purple" onClick={() => { setCardModalId(null); setTimeout(() => setPromptModalId(cardContent.id), 100); }}>✦ Prompt</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== PROMPT MODAL ===== */}
      <div className={`m-modal-overlay ${promptContent ? "open" : ""}`} onClick={() => setPromptModalId(null)}>
        <div className="m-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
          {promptContent && (
            <>
              <div className="m-modal-header"><div className="m-modal-title">TAYYOR PROMPT</div><button className="m-modal-close" onClick={() => setPromptModalId(null)}>✕</button></div>
              <div className="m-modal-body">
                <p style={{ fontSize: 12, color: "var(--m-text3)", marginBottom: 14 }}>Quyidagi promptni nusxa olib ChatGPT yoki Claude ga yapishtirishingiz mumkin:</p>
                <div className="m-prompt-box">{generatePrompt(promptContent as Content, state.projects.find((p) => p.id === promptContent.projectId), state.settings)}</div>
              </div>
              <div className="m-modal-footer">
                <button className="m-btn-cancel" onClick={() => setPromptModalId(null)}>Yopish</button>
                <button className="m-copy-btn" onClick={() => { const project = state.projects.find((p) => p.id === promptContent.projectId); copyToClipboard(generatePrompt(promptContent as Content, project, state.settings)); }}>📋 Nusxa olish</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== PASTE MODAL ===== */}
      <div className={`m-modal-overlay ${pasteContent ? "open" : ""}`} onClick={() => setPasteModalId(null)}>
        <div className="m-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
          {pasteContent && (
            <>
              <div className="m-modal-header"><div className="m-modal-title">TAYYOR BLOGNI JOYLASHTIRING</div><button className="m-modal-close" onClick={() => setPasteModalId(null)}>✕</button></div>
              <div className="m-modal-body">
                <p style={{ fontSize: 13, color: "var(--m-text2)", marginBottom: 6 }}>{pasteContent.title}</p>
                <p style={{ fontSize: 12, color: "var(--m-text3)", marginBottom: 14 }}>AI yozgan tayyor blog matnini quyiga paste qiling:</p>
                <textarea className="m-card-textarea" style={{ minHeight: 260 }} placeholder="Tayyor blog matnini bu yerga paste qiling..." value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
              </div>
              <div className="m-modal-footer"><button className="m-btn-cancel" onClick={() => setPasteModalId(null)} disabled={saving}>Bekor</button><button className="m-btn-save" onClick={confirmPaste} disabled={saving}>{saving ? "Saqlanmoqda..." : "✓ Joyladim"}</button></div>
            </>
          )}
        </div>
      </div>

      {/* ===== DELETE CONTENT CONFIRM ===== */}
      <div className={`m-modal-overlay ${deleteContent_ ? "open" : ""}`} onClick={() => setDeleteConfirmId(null)}>
        <div className="m-modal m-delete-modal" onClick={(e) => e.stopPropagation()}>
          {deleteContent_ && (
            <>
              <div className="m-delete-icon">✕</div>
              <div className="m-delete-title">Kontentni o&apos;chirish</div>
              <div className="m-delete-desc"><strong>&quot;{deleteContent_.title}&quot;</strong> kontenti butunlay o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.</div>
              <div className="m-delete-actions">
                <button className="m-btn-action m-btn-ghost" onClick={() => setDeleteConfirmId(null)} disabled={saving}>Bekor</button>
                <button className="m-btn-action m-btn-danger" onClick={() => deleteContent(deleteContent_.id)} disabled={saving}>{saving ? "O'chirilmoqda..." : "O'chirish"}</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== DELETE PROJECT CONFIRM ===== */}
      <div className={`m-modal-overlay ${deleteProject_ ? "open" : ""}`} onClick={() => setDeleteProjectConfirmId(null)}>
        <div className="m-modal m-delete-modal" onClick={(e) => e.stopPropagation()}>
          {deleteProject_ && (
            <>
              <div className="m-delete-icon">✕</div>
              <div className="m-delete-title">Loyihani o&apos;chirish</div>
              <div className="m-delete-desc"><strong>&quot;{deleteProject_.name}&quot;</strong> loyihasi va uning barcha kontentlari butunlay o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.</div>
              <div className="m-delete-actions">
                <button className="m-btn-action m-btn-ghost" onClick={() => setDeleteProjectConfirmId(null)} disabled={saving}>Bekor</button>
                <button className="m-btn-action m-btn-danger" onClick={() => deleteProject(deleteProject_.id)} disabled={saving}>{saving ? "O'chirilmoqda..." : "O'chirish"}</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* LOGOUT CONFIRM */}
      <div className={`m-modal-overlay ${logoutConfirmOpen ? "open" : ""}`} onClick={() => setLogoutConfirmOpen(false)}>
        <div className="m-modal m-delete-modal" onClick={(e) => e.stopPropagation()}>
          <div className="m-delete-icon">🚪</div>
          <div className="m-delete-title">CHIQISHNI TASDIQLANG</div>
          <div className="m-delete-desc">Admin paneldan chiqishni xohlaysizmi?</div>
          <div className="m-delete-actions">
            <button className="m-btn-cancel" onClick={() => setLogoutConfirmOpen(false)}>Bekor qilish</button>
            <button className="m-btn-action m-btn-danger" onClick={handleLogout}>Ha, chiqish</button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`m-toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
