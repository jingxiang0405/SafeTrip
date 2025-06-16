DROP TABLE IF EXISTS trip CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS trip_status;

CREATE TYPE trip_status AS ENUM ('pending', 'active', 'complete');

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100)       NOT NULL,
  sos_phone_number VARCHAR(20),
  role            VARCHAR(20),
  partner_id      INTEGER            REFERENCES users(id),
  password        TEXT               NOT NULL
);

CREATE TABLE trip (
  id            SERIAL          PRIMARY KEY,
  caretaker_id  INTEGER         NOT NULL REFERENCES users(id),
  carereceiver_id  INTEGER         NOT NULL REFERENCES users(id),
  bus_id        INTEGER,
  bus_name      VARCHAR(100),
  start_station VARCHAR(100),
  dest_station  VARCHAR(100),
  status        trip_status     NOT NULL DEFAULT 'pending',
  start_time    TIMESTAMPTZ,
  end_time      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trip_caretaker ON trip(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_trip_carereceiver ON trip(carereceiver_id);
