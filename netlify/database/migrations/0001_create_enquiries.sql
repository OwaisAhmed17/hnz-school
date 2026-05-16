CREATE TABLE IF NOT EXISTS enquiries (
  id          SERIAL PRIMARY KEY,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parent_name TEXT,
  phone       TEXT,
  email       TEXT,
  child_name  TEXT,
  grade       TEXT,
  message     TEXT
);
