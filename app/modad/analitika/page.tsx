"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../modad.css";
import "./analitika.css";

type SectionId =
  | "overview"
  | "traffic"
  | "pages"
  | "bots"
  | "users"
  | "sources"
  | "hours";

interface BotBreakdown {
  name: string;
  count: number;
}

interface PagePath {
  path: string;
  count: number;
}

interface LocaleData {
  locale: string;
  count: number;
}

interface DailyData {
  day: string;
  total: number;
  humans: number;
  bots: number;
  aiBots: number;
}

interface HourlyData {
  hour: number;
  count: number;
}

interface Stats {
  summary: {
    totalViews: number;
    todayViews: number;
    yesterdayViews: number;
    weekViews: number;
    monthViews: number;
    todayBots: number;
    todayAiBots: number;
    todayHumans: number;
  };
  aiBots: BotBreakdown[];
  searchBots: BotBreakdown[];
  topPages: PagePath[];
  locales: LocaleData[];
  daily: DailyData[];
  topReferers: Array<{ referer: string; count: number }>;
  hourly: HourlyData[];
}

const SECTIONS: { id: SectionId; icon: string; label: string; desc: string }[] = [
  { id: "overview", icon: "📊", label: "Umumiy", desc: "Asosiy ko'rsatkichlar" },
  { id: "traffic", icon: "📈", label: "Tashriflar", desc: "Kunlik va oylik trend" },
  { id: "pages", icon: "📄", label: "Sahifalar", desc: "Eng ko'p ko'rilgan" },
  { id: "bots", icon: "🤖", label: "Botlar", desc: "AI va qidiruv botlari" },
  { id: "users", icon: "👥", label: "Foydalanuvchilar", desc: "Til va segment" },
  { id: "sources", icon: "🔗", label: "Manbalar", desc: "Qayerdan kelgan" },
  { id: "hours", icon: "🕐", label: "Soatlar", desc: "Kun davomida" },
];

function formatReferer(referer: string): string {
  try {
    const url = new URL(referer);
    return url.hostname;
  } catch {
    return referer || "Direct";
  }
}

export default function AnalitikaPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<SectionId>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analytics/stats");
        if (res.status === 401) {
          router.push("/modad");
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  return (
    <div className="an-app">
      {/* Top bar */}
      <div className="an-topbar">
        <div className="an-topbar-left">
          <button
            className="an-mobile-toggle"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
          <div className="an-topbar-title">
            <span className="an-topbar-icon">📈</span>
            <span>Analitika Stepolog</span>
          </div>
        </div>
        <button className="an-back-btn" onClick={() => router.push("/modad/dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="an-layout">
        {/* Inner sidebar */}
        <aside className={`an-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
          <div className="an-sidebar-title">BO&apos;LIMLAR</div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`an-nav-item ${section === s.id ? "active" : ""}`}
              onClick={() => {
                setSection(s.id);
                setMobileSidebarOpen(false);
              }}
            >
              <span className="an-nav-icon">{s.icon}</span>
              <div className="an-nav-text">
                <div className="an-nav-label">{s.label}</div>
                <div className="an-nav-desc">{s.desc}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="an-main">
          {loading && <div className="an-loading">Yuklanmoqda...</div>}
          {error && <div className="an-error">Xatolik: {error}</div>}
          {stats && !loading && !error && (
            <>
              {section === "overview" && <OverviewSection stats={stats} />}
              {section === "traffic" && <TrafficSection stats={stats} />}
              {section === "pages" && <PagesSection stats={stats} />}
              {section === "bots" && <BotsSection stats={stats} />}
              {section === "users" && <UsersSection stats={stats} />}
              {section === "sources" && <SourcesSection stats={stats} />}
              {section === "hours" && <HoursSection stats={stats} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

function OverviewSection({ stats }: { stats: Stats }) {
  const { summary } = stats;
  const todayVsYesterday =
    summary.yesterdayViews > 0
      ? Math.round(
          ((summary.todayViews - summary.yesterdayViews) / summary.yesterdayViews) * 100
        )
      : 0;
  const maxDaily = Math.max(...stats.daily.map((d) => d.total), 1);

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Umumiy ko&apos;rinish</h1>
        <p className="an-view-subtitle">Asosiy ko&apos;rsatkichlar bir joyda</p>
      </div>

      <div className="an-summary">
        <div className="an-card">
          <div className="an-card-label">Bugun</div>
          <div className="an-card-value">{summary.todayViews}</div>
          <div className={`an-card-delta ${todayVsYesterday >= 0 ? "pos" : "neg"}`}>
            {todayVsYesterday >= 0 ? "↑" : "↓"} {Math.abs(todayVsYesterday)}% (kecha: {summary.yesterdayViews})
          </div>
        </div>
        <div className="an-card">
          <div className="an-card-label">7 kun</div>
          <div className="an-card-value">{summary.weekViews}</div>
          <div className="an-card-delta muted">O&apos;rtacha: {Math.round(summary.weekViews / 7)}/kun</div>
        </div>
        <div className="an-card">
          <div className="an-card-label">30 kun</div>
          <div className="an-card-value">{summary.monthViews}</div>
          <div className="an-card-delta muted">O&apos;rtacha: {Math.round(summary.monthViews / 30)}/kun</div>
        </div>
        <div className="an-card">
          <div className="an-card-label">Jami</div>
          <div className="an-card-value">{summary.totalViews}</div>
          <div className="an-card-delta muted">Barcha vaqt</div>
        </div>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Bugungi taqsimot</h2>
        <div className="an-today-grid">
          <div className="an-today-card human">
            <div className="an-today-icon">👤</div>
            <div className="an-today-count">{summary.todayHumans}</div>
            <div className="an-today-label">Real foydalanuvchi</div>
          </div>
          <div className="an-today-card ai">
            <div className="an-today-icon">🤖</div>
            <div className="an-today-count">{summary.todayAiBots}</div>
            <div className="an-today-label">AI bot</div>
          </div>
          <div className="an-today-card bot">
            <div className="an-today-icon">🔍</div>
            <div className="an-today-count">{summary.todayBots - summary.todayAiBots}</div>
            <div className="an-today-label">Qidiruv bot</div>
          </div>
        </div>
      </div>

      {stats.daily.length > 0 && (
        <div className="an-section">
          <h2 className="an-section-title">30 kunlik trend</h2>
          <MiniLegend />
          <div className="an-chart">
            {stats.daily.map((d) => (
              <div key={d.day} className="an-bar-group" title={`${d.day}: ${d.total} tashrif`}>
                <div className="an-bar-stack">
                  <div className="an-bar human" style={{ height: `${(d.humans / maxDaily) * 100}%` }} />
                  <div className="an-bar ai" style={{ height: `${(d.aiBots / maxDaily) * 100}%` }} />
                  <div className="an-bar bot" style={{ height: `${((d.bots - d.aiBots) / maxDaily) * 100}%` }} />
                </div>
                <div className="an-bar-label">{d.day.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrafficSection({ stats }: { stats: Stats }) {
  const maxDaily = Math.max(...stats.daily.map((d) => d.total), 1);
  const totalHumans = stats.daily.reduce((sum, d) => sum + d.humans, 0);
  const totalBots = stats.daily.reduce((sum, d) => sum + d.bots, 0);
  const totalAiBots = stats.daily.reduce((sum, d) => sum + d.aiBots, 0);

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Tashriflar</h1>
        <p className="an-view-subtitle">Kunlik trend va vaqt bo&apos;yicha taqsimot</p>
      </div>

      <div className="an-summary-3">
        <div className="an-card"><div className="an-card-label">Real</div><div className="an-card-value green">{totalHumans}</div><div className="an-card-delta muted">30 kun ichida</div></div>
        <div className="an-card"><div className="an-card-label">AI bot</div><div className="an-card-value yellow">{totalAiBots}</div><div className="an-card-delta muted">30 kun ichida</div></div>
        <div className="an-card"><div className="an-card-label">Qidiruv bot</div><div className="an-card-value blue">{totalBots - totalAiBots}</div><div className="an-card-delta muted">30 kun ichida</div></div>
      </div>

      {stats.daily.length > 0 ? (
        <>
          <div className="an-section">
            <h2 className="an-section-title">Kunlik trend (stacked)</h2>
            <MiniLegend />
            <div className="an-chart tall">
              {stats.daily.map((d) => (
                <div key={d.day} className="an-bar-group" title={`${d.day}: ${d.total} (real: ${d.humans}, AI: ${d.aiBots}, qidiruv: ${d.bots - d.aiBots})`}>
                  <div className="an-bar-stack">
                    <div className="an-bar human" style={{ height: `${(d.humans / maxDaily) * 100}%` }} />
                    <div className="an-bar ai" style={{ height: `${(d.aiBots / maxDaily) * 100}%` }} />
                    <div className="an-bar bot" style={{ height: `${((d.bots - d.aiBots) / maxDaily) * 100}%` }} />
                  </div>
                  <div className="an-bar-label">{d.day.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="an-section">
            <h2 className="an-section-title">Batafsil jadval</h2>
            <div className="an-table-wrap">
              <table className="an-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Jami</th>
                    <th>Real</th>
                    <th>AI bot</th>
                    <th>Qidiruv bot</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.daily].reverse().map((d) => (
                    <tr key={d.day}>
                      <td>{d.day}</td>
                      <td><strong>{d.total}</strong></td>
                      <td className="green">{d.humans}</td>
                      <td className="yellow">{d.aiBots}</td>
                      <td className="blue">{d.bots - d.aiBots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="an-empty">Hozircha ma&apos;lumot yo&apos;q</div>
      )}
    </div>
  );
}

function PagesSection({ stats }: { stats: Stats }) {
  const maxPage = Math.max(...stats.topPages.map((p) => p.count), 1);
  const byType = stats.topPages.reduce(
    (acc, p) => {
      if (p.path.startsWith("/blog") || p.path.startsWith("/ru/blog")) acc.blog += p.count;
      else if (p.path.startsWith("/learn") || p.path.startsWith("/ru/learn")) acc.learn += p.count;
      else if (p.path.startsWith("/kasblar") || p.path.startsWith("/ru/kasblar")) acc.kasblar += p.count;
      else if (p.path.startsWith("/about") || p.path.startsWith("/ru/about")) acc.about += p.count;
      else acc.other += p.count;
      return acc;
    },
    { blog: 0, learn: 0, kasblar: 0, about: 0, other: 0 }
  );
  const total = Object.values(byType).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Sahifalar</h1>
        <p className="an-view-subtitle">Eng ko&apos;p ko&apos;rilgan sahifalar va bo&apos;limlar</p>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Bo&apos;limlar bo&apos;yicha (30 kun, real odamlar)</h2>
        <div className="an-bucket-grid">
          <div className="an-bucket"><div className="an-bucket-label">📝 Blog</div><div className="an-bucket-value">{byType.blog}</div><div className="an-bucket-pct">{Math.round((byType.blog / total) * 100)}%</div></div>
          <div className="an-bucket"><div className="an-bucket-label">📚 Startap asoslari</div><div className="an-bucket-value">{byType.learn}</div><div className="an-bucket-pct">{Math.round((byType.learn / total) * 100)}%</div></div>
          <div className="an-bucket"><div className="an-bucket-label">💼 Kasblar</div><div className="an-bucket-value">{byType.kasblar}</div><div className="an-bucket-pct">{Math.round((byType.kasblar / total) * 100)}%</div></div>
          <div className="an-bucket"><div className="an-bucket-label">ℹ️ Haqimizda</div><div className="an-bucket-value">{byType.about}</div><div className="an-bucket-pct">{Math.round((byType.about / total) * 100)}%</div></div>
          <div className="an-bucket"><div className="an-bucket-label">🏠 Boshqa</div><div className="an-bucket-value">{byType.other}</div><div className="an-bucket-pct">{Math.round((byType.other / total) * 100)}%</div></div>
        </div>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Top 15 sahifa (30 kun)</h2>
        {stats.topPages.length === 0 ? (
          <div className="an-empty">Hozircha ma&apos;lumot yo&apos;q</div>
        ) : (
          <div className="an-list">
            {stats.topPages.map((p) => (
              <div key={p.path} className="an-list-item">
                <div className="an-list-label path">{p.path}</div>
                <div className="an-list-bar-wrap">
                  <div className="an-list-bar human" style={{ width: `${(p.count / maxPage) * 100}%` }} />
                </div>
                <div className="an-list-count">{p.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BotsSection({ stats }: { stats: Stats }) {
  const maxAiBot = Math.max(...stats.aiBots.map((b) => b.count), 1);
  const maxSearchBot = Math.max(...stats.searchBots.map((b) => b.count), 1);
  const totalAi = stats.aiBots.reduce((s, b) => s + b.count, 0);
  const totalSearch = stats.searchBots.reduce((s, b) => s + b.count, 0);

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Botlar</h1>
        <p className="an-view-subtitle">AI va qidiruv botlari sayt bo&apos;yicha</p>
      </div>

      <div className="an-summary-2">
        <div className="an-card ai-card">
          <div className="an-card-label">AI botlar (30 kun)</div>
          <div className="an-card-value yellow">{totalAi}</div>
          <div className="an-card-delta muted">{stats.aiBots.length} turdagi bot</div>
        </div>
        <div className="an-card search-card">
          <div className="an-card-label">Qidiruv botlar (30 kun)</div>
          <div className="an-card-value blue">{totalSearch}</div>
          <div className="an-card-delta muted">{stats.searchBots.length} turdagi bot</div>
        </div>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">🤖 AI botlar (ChatGPT, Claude, Perplexity...)</h2>
        {stats.aiBots.length === 0 ? (
          <div className="an-empty">Hozircha AI bot tashriflari yo&apos;q — sayt sitemap ga kiritilgach keladi</div>
        ) : (
          <div className="an-list">
            {stats.aiBots.map((bot) => (
              <div key={bot.name} className="an-list-item">
                <div className="an-list-label">{bot.name}</div>
                <div className="an-list-bar-wrap">
                  <div className="an-list-bar ai" style={{ width: `${(bot.count / maxAiBot) * 100}%` }} />
                </div>
                <div className="an-list-count">{bot.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="an-section">
        <h2 className="an-section-title">🔍 Qidiruv botlar (Google, Bing, Yandex...)</h2>
        {stats.searchBots.length === 0 ? (
          <div className="an-empty">Hozircha qidiruv bot tashriflari yo&apos;q</div>
        ) : (
          <div className="an-list">
            {stats.searchBots.map((bot) => (
              <div key={bot.name} className="an-list-item">
                <div className="an-list-label">{bot.name}</div>
                <div className="an-list-bar-wrap">
                  <div className="an-list-bar bot" style={{ width: `${(bot.count / maxSearchBot) * 100}%` }} />
                </div>
                <div className="an-list-count">{bot.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersSection({ stats }: { stats: Stats }) {
  const totalLocale = stats.locales.reduce((s, l) => s + l.count, 0) || 1;
  const uz = stats.locales.find((l) => l.locale === "uz")?.count || 0;
  const ru = stats.locales.find((l) => l.locale === "ru")?.count || 0;
  const totalHumans = stats.daily.reduce((s, d) => s + d.humans, 0);
  const totalAiBots = stats.daily.reduce((s, d) => s + d.aiBots, 0);
  const totalBots = stats.daily.reduce((s, d) => s + d.bots, 0);
  const humanPct = totalHumans + totalBots > 0 ? Math.round((totalHumans / (totalHumans + totalBots)) * 100) : 0;

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Foydalanuvchilar</h1>
        <p className="an-view-subtitle">Til, segment va real odamlar ulushi</p>
      </div>

      <div className="an-summary-2">
        <div className="an-card">
          <div className="an-card-label">Real odam ulushi</div>
          <div className="an-card-value green">{humanPct}%</div>
          <div className="an-card-delta muted">{totalHumans} odam / {totalBots} bot</div>
        </div>
        <div className="an-card">
          <div className="an-card-label">AI vs qidiruv</div>
          <div className="an-card-value">{totalAiBots} / {totalBots - totalAiBots}</div>
          <div className="an-card-delta muted">30 kun ichida</div>
        </div>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Til bo&apos;yicha taqsimot (30 kun, real odamlar)</h2>
        {stats.locales.length === 0 ? (
          <div className="an-empty">Ma&apos;lumot yo&apos;q</div>
        ) : (
          <>
            <div className="an-locale-bar-wrap">
              <div className="an-locale-bar uz" style={{ width: `${(uz / totalLocale) * 100}%` }}>
                🇺🇿 UZ {uz > 0 && `(${Math.round((uz / totalLocale) * 100)}%)`}
              </div>
              <div className="an-locale-bar ru" style={{ width: `${(ru / totalLocale) * 100}%` }}>
                🇷🇺 RU {ru > 0 && `(${Math.round((ru / totalLocale) * 100)}%)`}
              </div>
            </div>
            <div className="an-locales">
              {stats.locales.map((l) => (
                <div key={l.locale} className="an-locale-item">
                  <div className="an-locale-flag">
                    {l.locale === "uz" ? "🇺🇿" : l.locale === "ru" ? "🇷🇺" : "🌐"}
                  </div>
                  <div className="an-locale-info">
                    <div className="an-locale-name">
                      {l.locale === "uz" ? "O'zbekcha" : l.locale === "ru" ? "Ruscha" : l.locale}
                    </div>
                    <div className="an-locale-count">{l.count} tashrif ({Math.round((l.count / totalLocale) * 100)}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SourcesSection({ stats }: { stats: Stats }) {
  const total = stats.topReferers.reduce((s, r) => s + r.count, 0) || 1;
  const max = Math.max(...stats.topReferers.map((r) => r.count), 1);

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Manbalar</h1>
        <p className="an-view-subtitle">Foydalanuvchilar qayerdan keladi</p>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Top refererlar (30 kun, real odamlar)</h2>
        {stats.topReferers.length === 0 ? (
          <div className="an-empty">Hozircha manbalar haqida ma&apos;lumot yo&apos;q. Ko&apos;pchilik to&apos;g&apos;ridan-to&apos;g&apos;ri kirishadi.</div>
        ) : (
          <div className="an-list">
            {stats.topReferers.map((r, i) => (
              <div key={i} className="an-list-item">
                <div className="an-list-label">{formatReferer(r.referer)}</div>
                <div className="an-list-bar-wrap">
                  <div className="an-list-bar human" style={{ width: `${(r.count / max) * 100}%` }} />
                </div>
                <div className="an-list-count">{r.count} ({Math.round((r.count / total) * 100)}%)</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="an-section">
        <h2 className="an-section-title">💡 Izoh</h2>
        <div className="an-info-box">
          <p>Manba (referer) — foydalanuvchi sizning saytga qaysi saytdan o&apos;tib kelganini ko&apos;rsatadi.</p>
          <ul>
            <li><strong>google.com</strong> — Google qidiruvdan</li>
            <li><strong>t.me</strong> — Telegram kanaldan</li>
            <li><strong>instagram.com</strong> — Instagram dan</li>
            <li><strong>Direct</strong> — to&apos;g&apos;ridan-to&apos;g&apos;ri URL kiritib kirgan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function HoursSection({ stats }: { stats: Stats }) {
  const maxHourly = Math.max(...stats.hourly.map((h) => h.count), 1);
  const peak = stats.hourly.reduce(
    (max, h) => (h.count > max.count ? h : max),
    { hour: 0, count: 0 }
  );
  const total = stats.hourly.reduce((s, h) => s + h.count, 0);
  const avg = Math.round(total / 24);

  return (
    <div className="an-section-wrap">
      <div className="an-view-header">
        <h1 className="an-view-title">Soatlar</h1>
        <p className="an-view-subtitle">Kun davomida tashriflar (7 kunlik o&apos;rtacha)</p>
      </div>

      <div className="an-summary-3">
        <div className="an-card">
          <div className="an-card-label">Peak soat</div>
          <div className="an-card-value">{peak.hour}:00</div>
          <div className="an-card-delta muted">{peak.count} tashrif</div>
        </div>
        <div className="an-card">
          <div className="an-card-label">Har soat o&apos;rta</div>
          <div className="an-card-value">{avg}</div>
          <div className="an-card-delta muted">tashrif</div>
        </div>
        <div className="an-card">
          <div className="an-card-label">Jami (7 kun)</div>
          <div className="an-card-value">{total}</div>
          <div className="an-card-delta muted">real foydalanuvchi</div>
        </div>
      </div>

      <div className="an-section">
        <h2 className="an-section-title">Soatlik taqsimot</h2>
        <div className="an-hourly tall">
          {stats.hourly.map((h) => (
            <div
              key={h.hour}
              className={`an-hourly-item ${h.hour === peak.hour ? "peak" : ""}`}
              title={`${h.hour}:00 — ${h.count} tashrif`}
            >
              <div className="an-hourly-count">{h.count || ""}</div>
              <div className="an-hourly-bar" style={{ height: `${(h.count / maxHourly) * 100}%` }} />
              <div className="an-hourly-label">{h.hour}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniLegend() {
  return (
    <div className="an-chart-legend">
      <span className="an-legend-item"><span className="an-dot human" /> Real</span>
      <span className="an-legend-item"><span className="an-dot ai" /> AI bot</span>
      <span className="an-legend-item"><span className="an-dot bot" /> Qidiruv bot</span>
    </div>
  );
}
