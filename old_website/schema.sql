-- ============================================================================
-- HACK UTTAR PRADESH 2026 | RIWA CREATIVES OFFICIAL SQL DATABASE SCHEMA
-- Compatible with SQLite3, PostgreSQL (Neon), and MySQL
-- ============================================================================

-- 1. Attendee Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  pass_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  district TEXT NOT NULL,
  role TEXT NOT NULL,
  track TEXT NOT NULL,
  mode TEXT NOT NULL,
  google_verified INTEGER DEFAULT 0,
  google_sub TEXT,
  google_picture TEXT,
  registered_at TEXT NOT NULL,
  registered_at_ist TEXT NOT NULL,
  verification_status TEXT DEFAULT 'VERIFIED_ACTIVE',
  checked_in INTEGER DEFAULT 0,
  checked_in_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_registrations_pass_id ON registrations(pass_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_district ON registrations(district);
CREATE INDEX IF NOT EXISTS idx_registrations_track ON registrations(track);

-- 2. Pass Verification & Gate Check-in Audit Logs
CREATE TABLE IF NOT EXISTS verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pass_id TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  verifier_type TEXT NOT NULL, -- 'ATTENDEE_LOOKUP', 'GATE_CHECKIN', 'ADMIN_AUDIT'
  status_result TEXT NOT NULL, -- 'VALID', 'CHECKED_IN', 'NOT_FOUND'
  notes TEXT,
  FOREIGN KEY (pass_id) REFERENCES registrations(pass_id) ON DELETE CASCADE
);

-- 3. Automatic Notifications Log
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  pass_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  channel TEXT NOT NULL,       -- 'SIMULATED_SMTP', 'IN_APP_PASS'
  status TEXT NOT NULL,        -- 'DISPATCHED', 'QUEUED', 'DELIVERED'
  dispatched_at TEXT NOT NULL,
  FOREIGN KEY (pass_id) REFERENCES registrations(pass_id) ON DELETE CASCADE
);

-- 4. Corporate & Ecosystem Sponsor Inquiries
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT NOT NULL,          -- 'Title Presenting Partner', 'Track Arena Partner', etc.
  notes TEXT,
  created_at TEXT NOT NULL
);

