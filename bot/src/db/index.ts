import pg from "pg";
import { config } from "../config.ts";

export const db = new pg.Pool({ connectionString: config.databaseUrl, max: 6 });
// Baza bir lahzaga uzilsa jarayon yiqilmasin (pool qayta ulanadi)
db.on("error", (e) => console.error("[pg]", e.message));

export async function kvGet(key: string) {
  const r = await db.query<{ value: string }>("SELECT value FROM kv WHERE key = $1", [key]);
  return r.rows[0]?.value ?? null;
}

export async function kvSet(key: string, value: string) {
  await db.query("INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2", [key, value]);
}
