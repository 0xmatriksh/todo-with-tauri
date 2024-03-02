CREATE TABLE IF NOT EXISTS todo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  done BOOLEAN
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);