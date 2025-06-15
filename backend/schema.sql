DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_status') THEN
    CREATE TYPE trip_status AS ENUM ('pending', 'active', 'complete');
  END IF;
END$$;

-- 2. 建立 users table
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100)       NOT NULL,
  sos_phone_number VARCHAR(20),
  role            VARCHAR(20),
  partner_id      INTEGER            REFERENCES users(id),
  password        TEXT               NOT NULL
);

-- 3. 建立 trip table
CREATE TABLE IF NOT EXISTS trip (
  id            SERIAL          PRIMARY KEY,
  caregiver_id  INTEGER         NOT NULL REFERENCES users(id),
  caretaker_id  INTEGER         NOT NULL REFERENCES users(id),
  bus_id        INTEGER,
  bus_name      VARCHAR(100),
  start_station VARCHAR(100),
  dest_station  VARCHAR(100),
  status        trip_status     NOT NULL DEFAULT 'pending',
  start_time    TIMESTAMPTZ,
  end_time      TIMESTAMPTZ
);

-- 4. 建立 index 以加速常用查詢（可選）
CREATE INDEX IF NOT EXISTS idx_trip_caregiver ON trip(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_trip_caretaker ON trip(caretaker_id);
