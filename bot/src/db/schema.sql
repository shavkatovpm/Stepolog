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
