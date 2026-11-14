// Jadvallarni yaratadi va manbalarni qo'shadi: npm run db:init
import { readFileSync } from "node:fs";
import { db } from "./index.ts";
import { SOURCES } from "../sources.ts";

const sql = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
await db.query(sql);

for (const s of SOURCES) {
  await db.query(
    `INSERT INTO sources (field, name, feed_url, lang) VALUES ($1, $2, $3, $4)
     ON CONFLICT (feed_url) DO UPDATE SET name = $2, field = $1, lang = $4`,
    [s.field, s.name, s.feed, s.lang],
  );
}

console.log(`Tayyor: jadvallar va ${SOURCES.length} ta manba.`);
await db.end();
