-- seed.sql
-- 初始化 users 和 trip 資料表

BEGIN;

-- 清空並重置 users 和 trip 表
TRUNCATE TABLE trip RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Users 範例資料
INSERT INTO users (name, sos_phone_number, role, partner_id, password) VALUES
  -- 第一組配對：Alice (caregiver) ↔ Bob (caretaker)
  ('Alice Chang', '0912-345-678', 'caregiver', 2, 'passAlice1'),
  ('Bob Chang',   '0987-654-321', 'caretaker', 1, 'passBob1'),

  -- 第二組配對：Carol (caregiver) ↔ David (caretaker)
  ('Carol Wu',   '0922-111-222', 'caregiver', 4, 'passCarol1'),
  ('David Wu',   '0933-333-444', 'caretaker', 3, 'passDavid1'),

  -- 第三組：單獨帳號（尚未配對）
  ('Emma Lin',   '0944-555-666', 'caregiver', NULL, 'passEmma1'),
  ('Frank Lin',  '0955-777-888', 'caretaker', NULL, 'passFrank1');

-- Trip 範例資料
INSERT INTO trip (caregiver_id, caretaker_id, bus_id, bus_name, start_station, dest_station, status, start_time, end_time) VALUES
  -- pending
  (1, 2, 100, 'Route 100 Express', 'Station A', 'Station B', 'pending', NULL, NULL),
  -- active
  (3, 4, 200, 'Route 200 Local',   'Station X', 'Station Y', 'active', NOW(), NULL),
  -- completed
  (5, 6, 300, 'Route 300 Shuttle', 'Station M', 'Station N', 'complete', NOW() - INTERVAL '1 hour', NOW());

COMMIT;
