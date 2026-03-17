"use client";

import type { Project, Content } from "../types";

export default function StatsView({
  projects,
  contents,
  onOpenProject,
}: {
  projects: Project[];
  contents: Content[];
  onOpenProject: (id: string) => void;
}) {
  const planned = contents.filter((c) => c.status === "planned").length;
  const ready = contents.filter((c) => c.status === "ready").length;
  const published = contents.filter((c) => c.status === "published").length;
  const total = contents.length;

  // Contents per month (last 6 months)
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("uz", { month: "short" });
    const count = contents.filter((c) => c.createdAt?.startsWith(key)).length;
    months.push({ label, count });
  }
  const maxMonth = Math.max(...months.map((m) => m.count), 1);

  // Intent breakdown
  const intents = [
    { key: "informational", label: "Informational", color: "var(--m-blue)", count: contents.filter((c) => c.intent === "informational").length },
    { key: "commercial", label: "Commercial", color: "var(--m-green)", count: contents.filter((c) => c.intent === "commercial").length },
    { key: "navigational", label: "Navigational", color: "var(--m-orange)", count: contents.filter((c) => c.intent === "navigational").length },
  ];

  // Per project stats
  const projectStats = projects.map((p) => {
    const pContents = contents.filter((c) => c.projectId === p.id);
    return {
      ...p,
      total: pContents.length,
      planned: pContents.filter((c) => c.status === "planned").length,
      ready: pContents.filter((c) => c.status === "ready").length,
      published: pContents.filter((c) => c.status === "published").length,
    };
  });
  const maxProjectTotal = Math.max(...projectStats.map((p) => p.total), 1);

  // Top keywords
  const kwMap: Record<string, number> = {};
  contents.forEach((c) => {
    if (c.keyword) kwMap[c.keyword] = (kwMap[c.keyword] || 0) + 1;
  });
  const topKeywords = Object.entries(kwMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="m-view">
      <div className="m-page-header">
        <div className="m-page-title">STATISTIKA</div>
        <div className="m-page-sub">Barcha loyihalar bo&apos;yicha umumiy ko&apos;rsatkichlar</div>
      </div>

      {/* Summary cards */}
      <div className="m-stats-cards">
        <div className="m-stat-card">
          <span className="m-stat-card-n">{projects.length}</span>
          <span className="m-stat-card-l">Loyihalar</span>
        </div>
        <div className="m-stat-card">
          <span className="m-stat-card-n">{total}</span>
          <span className="m-stat-card-l">Jami kontent</span>
        </div>
        <div className="m-stat-card">
          <span className="m-stat-card-n" style={{ color: "var(--m-yellow)" }}>{planned}</span>
          <span className="m-stat-card-l">Rejada</span>
        </div>
        <div className="m-stat-card">
          <span className="m-stat-card-n" style={{ color: "var(--m-blue)" }}>{ready}</span>
          <span className="m-stat-card-l">Tayyor</span>
        </div>
        <div className="m-stat-card">
          <span className="m-stat-card-n" style={{ color: "var(--m-green)" }}>{published}</span>
          <span className="m-stat-card-l">Joylashtirildi</span>
        </div>
      </div>

      {/* Status distribution bar */}
      <div className="m-stats-section">
        <div className="m-stats-section-title">Holat taqsimoti</div>
        <div className="m-status-bar-wrap">
          {total > 0 ? (
            <div className="m-status-bar">
              <div className="m-status-bar-seg" style={{ width: `${(planned / total) * 100}%`, background: "var(--m-yellow)" }} />
              <div className="m-status-bar-seg" style={{ width: `${(ready / total) * 100}%`, background: "var(--m-blue)" }} />
              <div className="m-status-bar-seg" style={{ width: `${(published / total) * 100}%`, background: "var(--m-green)" }} />
            </div>
          ) : (
            <div className="m-status-bar"><div className="m-status-bar-seg" style={{ width: "100%", background: "var(--m-border2)" }} /></div>
          )}
          <div className="m-status-bar-legend">
            <span><span className="m-legend-dot" style={{ background: "var(--m-yellow)" }} /> Rejada {total > 0 ? Math.round((planned / total) * 100) : 0}%</span>
            <span><span className="m-legend-dot" style={{ background: "var(--m-blue)" }} /> Tayyor {total > 0 ? Math.round((ready / total) * 100) : 0}%</span>
            <span><span className="m-legend-dot" style={{ background: "var(--m-green)" }} /> Joylashtirildi {total > 0 ? Math.round((published / total) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      <div className="m-stats-grid">
        {/* Monthly chart */}
        <div className="m-stats-section">
          <div className="m-stats-section-title">Oylik kontent dinamikasi</div>
          <div className="m-bar-chart">
            {months.map((m, i) => (
              <div className="m-bar-col" key={i}>
                <span className="m-bar-val">{m.count}</span>
                <div className="m-bar" style={{ height: `${(m.count / maxMonth) * 100}%` }} />
                <span className="m-bar-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent breakdown */}
        <div className="m-stats-section">
          <div className="m-stats-section-title">Kontent turlari</div>
          <div className="m-intent-chart">
            {intents.map((item) => (
              <div className="m-intent-row" key={item.key}>
                <div className="m-intent-label">
                  <span className="m-legend-dot" style={{ background: item.color }} />
                  {item.label}
                </div>
                <div className="m-intent-bar-track">
                  <div className="m-intent-bar-fill" style={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%", background: item.color }} />
                </div>
                <span className="m-intent-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="m-stats-grid">
        {/* Per project */}
        <div className="m-stats-section">
          <div className="m-stats-section-title">Loyihalar bo&apos;yicha</div>
          {projectStats.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--m-text3)", padding: "20px 0" }}>Hali loyiha yo&apos;q</div>
          ) : (
            <div className="m-project-bars">
              {projectStats.map((p) => (
                <div className="m-project-bar-row" key={p.id} onClick={() => onOpenProject(p.id)}>
                  <div className="m-project-bar-info">
                    <div className={`m-project-dot m-${p.color}`} />
                    <span className="m-project-bar-name">{p.name}</span>
                    <span className="m-project-bar-total">{p.total}</span>
                  </div>
                  <div className="m-project-stacked-bar">
                    <div style={{ width: `${(p.planned / maxProjectTotal) * 100}%`, background: "var(--m-yellow)" }} />
                    <div style={{ width: `${(p.ready / maxProjectTotal) * 100}%`, background: "var(--m-blue)" }} />
                    <div style={{ width: `${(p.published / maxProjectTotal) * 100}%`, background: "var(--m-green)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top keywords */}
        <div className="m-stats-section">
          <div className="m-stats-section-title">Top keywordlar</div>
          {topKeywords.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--m-text3)", padding: "20px 0" }}>Hali keyword yo&apos;q</div>
          ) : (
            <div className="m-keywords-list">
              {topKeywords.map(([kw, count], i) => (
                <div className="m-keyword-item" key={kw}>
                  <span className="m-keyword-rank">{i + 1}</span>
                  <span className="m-keyword-text">{kw}</span>
                  <span className="m-keyword-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
