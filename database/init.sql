-- PostgreSQL schema initialization
-- Run with: psql $DATABASE_URL -f db/init.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('caregiver','caretaker')),
  partner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  caregiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caretaker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bus_id VARCHAR(50) NOT NULL,
  bus_name VARCHAR(150) NOT NULL,
    
  start_station VARCHAR(150) NOT NULL,
  dest_station VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_partner ON users(partner_id);
CREATE INDEX IF NOT EXISTS idx_trips_caregiver ON trips(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_trips_caretaker ON trips(caretaker_id);

-- Sample data insertion (optional)
INSERT INTO users (name, phone_number, role, partner_id)
VALUES
  ('張媽媽', '0987654321', 'caregiver', NULL),
  ('王小明', '0912345678', 'caretaker', NULL)
ON CONFLICT DO NOTHING;
--
-- INSERT INTO trips (caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station)
-- VALUES
--   (1, 2, '208', '台北-基隆', '捷運台北車站', '基隆車站')
-- ON CONFLICT DO NOTHING;
