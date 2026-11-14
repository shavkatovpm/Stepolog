-- Stepolog bot bazasi
CREATE TABLE IF NOT EXISTS sources (
  id         serial PRIMARY KEY,
  field      text NOT NULL,              -- 'marketing', ...
  name       text NOT NULL,
  feed_url   text NOT NULL UNIQUE,
  lang       text NOT NULL DEFAULT 'en',
  active     boolean NOT NULL DEFAULT true,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id           serial PRIMARY KEY,
  source_id    int NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  url          text NOT NULL UNIQUE,
  title        text NOT NULL,
  excerpt      text NOT NULL DEFAULT '',
  published_at timestamptz,
  verdict      text NOT NULL DEFAULT 'pending', -- pending | skip | keep
  score        int,
  reason       text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS articles_verdict_idx ON articles (verdict);

CREATE TABLE IF NOT EXISTS posts (
  id             serial PRIMARY KEY,
  article_id     int NOT NULL UNIQUE REFERENCES articles(id) ON DELETE CASCADE,
  field          text NOT NULL,
  text           text NOT NULL,            -- Telegram HTML
  original_text  text NOT NULL,            -- AI yozgan birinchi variant (tuzatishlardan o'rganish uchun)
  status         text NOT NULL DEFAULT 'draft', -- draft | published | rejected
  score          int NOT NULL DEFAULT 0,
  admin_msg_id   bigint,
  channel_msg_id bigint,
  created_at     timestamptz NOT NULL DEFAULT now(),
  published_at   timestamptz
);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts (status, published_at);

CREATE TABLE IF NOT EXISTS users (
  tg_id      bigint PRIMARY KEY,
  first_name text,
  username   text,
  fields     text[] NOT NULL DEFAULT '{marketing}',
  digest     boolean NOT NULL DEFAULT true,
  blocked    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Pullik kanal obunalari (3-bosqich, hozircha jadval tayyor turadi)
CREATE TABLE IF NOT EXISTS subscriptions (
  id         serial PRIMARY KEY,
  tg_id      bigint NOT NULL REFERENCES users(tg_id),
  field      text NOT NULL,
  months     int NOT NULL,
  amount     int NOT NULL,
  status     text NOT NULL DEFAULT 'pending', -- pending | active | expired | rejected
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv (
  key   text PRIMARY KEY,
  value text NOT NULL
);

-- v2: ishonchlilik mezonlari
ALTER TABLE sources  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'media'; -- official | media | blog
ALTER TABLE articles ADD COLUMN IF NOT EXISTS base_score int;  -- soha bo'yicha ball (AI)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS flags jsonb;     -- umumiy mezon belgilari (AI)

-- v3: foydalanuvchi kabineti
ALTER TABLE users ADD COLUMN IF NOT EXISTS digest_time text NOT NULL DEFAULT '20:00';
ALTER TABLE users ADD COLUMN IF NOT EXISTS state text;                 -- kutilayotgan kiritish: await_site | await_receipt:<sub_id>
ALTER TABLE users ADD COLUMN IF NOT EXISTS autopost_wait boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS field_votes (               -- yopiq sohalarga "menga kerak"
  tg_id      bigint NOT NULL REFERENCES users(tg_id) ON DELETE CASCADE,
  field      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tg_id, field)
);

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS receipt_file_id text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS admin_msg_id bigint;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS reminded boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS user_sites (                -- user kuzatayotgan saytlar
  id         serial PRIMARY KEY,
  tg_id      bigint NOT NULL REFERENCES users(tg_id) ON DELETE CASCADE,
  url        text NOT NULL,
  feed_url   text NOT NULL,
  title      text NOT NULL,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tg_id, feed_url)
);

CREATE TABLE IF NOT EXISTS user_site_items (
  id         serial PRIMARY KEY,
  site_id    int NOT NULL REFERENCES user_sites(id) ON DELETE CASCADE,
  url        text NOT NULL,
  title      text NOT NULL,
  excerpt    text NOT NULL DEFAULT '',
  sent       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, url)
);
