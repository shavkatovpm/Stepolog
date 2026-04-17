"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../modad.css";
import "./analitika.css";

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

  if (loading) {
    return (
      <div className="an-wrap">
        <div className="an-loading">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="an-wrap">
        <div className="an-error">Xatolik: {error || "Ma'lumot yo'q"}</div>
      </div>
    );
  }

  const { summary } = stats;
  const todayVsYesterday =
    summary.yesterdayViews > 0
      ? Math.round(
          ((summary.todayViews - summary.yesterdayViews) / summary.yesterdayViews) * 100
        )
      : 0;

  const maxDaily = Math.max(...stats.daily.map((d) => d.total), 1);
  const maxHourly = Math.max(...stats.hourly.map((h) => h.count), 1);
  const maxAiBot = Math.max(...stats.aiBots.map((b) => b.count), 1);
  const maxSearchBot = Math.max(...stats.searchBots.map((b) => b.count), 1);
  const maxPage = Math.max(...stats.topPages.map((p) => p.count), 1);

  const totalHumans = stats.daily.reduce((sum, d) => sum + d.humans, 0);
  const totalBots = stats.daily.reduce((sum, d) => sum + d.bots, 0);
  const totalAiBots = stats.daily.reduce((sum, d) => sum + d.aiBots, 0);

  return (
    <div className="an-wrap">
      <div className="an-header">
        <div>
          <h1 className="an-title">Analitika Stepolog</h1>
          <p className="an-subtitle">Tashriflar, botlar va foydalanuvchi xulqi</p>
        </div>
        <Link href="/modad/dashboard" className="an-back-btn">
          ← Dashboard
        </Link>
      </div>

      {/* Summary cards */}
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
          <div className="an-card-delta muted">
            O&apos;rtacha: {Math.round(summary.weekViews / 7)}/kun
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-label">30 kun</div>
          <div className="an-card-value">{summary.monthViews}</div>
          <div className="an-card-delta muted">
            O&apos;rtacha: {Math.round(summary.monthViews / 30)}/kun
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-label">Jami</div>
          <div className="an-card-value">{summary.totalViews}</div>
          <div className="an-card-delta muted">Barcha vaqt</div>
        </div>
      </div>

      {/* Today breakdown */}
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

      {/* Daily chart */}
      {stats.daily.length > 0 && (
        <div className="an-section">
          <h2 className="an-section-title">30 kunlik trend</h2>
          <div className="an-chart-legend">
            <span className="an-legend-item"><span className="an-dot human" /> Real</span>
            <span className="an-legend-item"><span className="an-dot ai" /> AI bot</span>
            <span className="an-legend-item"><span className="an-dot bot" /> Qidiruv bot</span>
          </div>
          <div className="an-chart">
            {stats.daily.map((d) => (
              <div key={d.day} className="an-bar-group" title={`${d.day}: ${d.total} tashrif`}>
                <div className="an-bar-stack">
                  <div
                    className="an-bar human"
                    style={{ height: `${(d.humans / maxDaily) * 100}%` }}
                  />
                  <div
                    className="an-bar ai"
                    style={{ height: `${(d.aiBots / maxDaily) * 100}%` }}
                  />
                  <div
                    className="an-bar bot"
                    style={{ height: `${((d.bots - d.aiBots) / maxDaily) * 100}%` }}
                  />
                </div>
                <div className="an-bar-label">{d.day.slice(5)}</div>
              </div>
            ))}
          </div>
          <div className="an-chart-totals">
            <div>Real: <strong>{totalHumans}</strong></div>
            <div>AI bot: <strong>{totalAiBots}</strong></div>
            <div>Qidiruv bot: <strong>{totalBots - totalAiBots}</strong></div>
          </div>
        </div>
      )}

      {/* AI bots */}
      <div className="an-section">
        <h2 className="an-section-title">AI botlar (ChatGPT, Claude, Perplexity...)</h2>
        {stats.aiBots.length === 0 ? (
          <div className="an-empty">Hozircha AI bot tashriflari yo&apos;q</div>
        ) : (
          <div className="an-list">
            {stats.aiBots.map((bot) => (
              <div key={bot.name} className="an-list-item">
                <div className="an-list-label">{bot.name}</div>
                <div className="an-list-bar-wrap">
                  <div
                    className="an-list-bar ai"
                    style={{ width: `${(bot.count / maxAiBot) * 100}%` }}
                  />
                </div>
                <div className="an-list-count">{bot.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search bots */}
      <div className="an-section">
        <h2 className="an-section-title">Qidiruv botlar (Google, Bing, Yandex...)</h2>
        {stats.searchBots.length === 0 ? (
          <div className="an-empty">Hozircha qidiruv bot tashriflari yo&apos;q</div>
        ) : (
          <div className="an-list">
            {stats.searchBots.map((bot) => (
              <div key={bot.name} className="an-list-item">
                <div className="an-list-label">{bot.name}</div>
                <div className="an-list-bar-wrap">
                  <div
                    className="an-list-bar bot"
                    style={{ width: `${(bot.count / maxSearchBot) * 100}%` }}
                  />
                </div>
                <div className="an-list-count">{bot.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top pages */}
      <div className="an-section">
        <h2 className="an-section-title">Eng ko&apos;p ko&apos;rilgan sahifalar (30 kun)</h2>
        {stats.topPages.length === 0 ? (
          <div className="an-empty">Hozircha ma&apos;lumot yo&apos;q</div>
        ) : (
          <div className="an-list">
            {stats.topPages.map((p) => (
              <div key={p.path} className="an-list-item">
                <div className="an-list-label path">{p.path}</div>
                <div className="an-list-bar-wrap">
                  <div
                    className="an-list-bar human"
                    style={{ width: `${(p.count / maxPage) * 100}%` }}
                  />
                </div>
                <div className="an-list-count">{p.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locale + Referers grid */}
      <div className="an-grid-2">
        <div className="an-section">
          <h2 className="an-section-title">Til bo&apos;yicha</h2>
          {stats.locales.length === 0 ? (
            <div className="an-empty">Ma&apos;lumot yo&apos;q</div>
          ) : (
            <div className="an-locales">
              {stats.locales.map((l) => (
                <div key={l.locale} className="an-locale-item">
                  <div className="an-locale-flag">
                    {l.locale === "uz" ? "🇺🇿" : l.locale === "ru" ? "🇷🇺" : "🌐"}
                  </div>
                  <div className="an-locale-info">
                    <div className="an-locale-name">
                      {l.locale === "uz" ? "O&apos;zbekcha" : l.locale === "ru" ? "Ruscha" : l.locale}
                    </div>
                    <div className="an-locale-count">{l.count} tashrif</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="an-section">
          <h2 className="an-section-title">Top manbalar</h2>
          {stats.topReferers.length === 0 ? (
            <div className="an-empty">Ma&apos;lumot yo&apos;q</div>
          ) : (
            <div className="an-referers">
              {stats.topReferers.map((r, i) => (
                <div key={i} className="an-referer-item">
                  <div className="an-referer-host">{formatReferer(r.referer)}</div>
                  <div className="an-referer-count">{r.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hourly */}
      <div className="an-section">
        <h2 className="an-section-title">Kun davomida (7 kunlik o&apos;rtacha)</h2>
        <div className="an-hourly">
          {stats.hourly.map((h) => (
            <div key={h.hour} className="an-hourly-item" title={`${h.hour}:00 — ${h.count} tashrif`}>
              <div
                className="an-hourly-bar"
                style={{ height: `${(h.count / maxHourly) * 100}%` }}
              />
              <div className="an-hourly-label">{h.hour}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
