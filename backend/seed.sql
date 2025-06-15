-- seed.sql
-- 初始化 users 和 trip 資料表

BEGIN;

-- 清空並重置 users 和 trip 表
TRUNCATE TABLE trip RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Users 範例資料
INSERT INTO users (name, sos_phone_number, role, partner_id, password) VALUES
  ('test', '0912-345-678', NULL, NULL, '$2b$10$/OcFjvFSxmKMIRjkUL7tJuMavribWXJFZz2AWJNrY9DdsvOlA9nXG'), -- test
  
  -- 第一組配對：Alice (caretaker) ↔ Bob (carereceiver)
  ('Alice Chang', '0912-345-678', 'caretaker', 2, '$2b$10$FcFCGyUXynhx4z4E8ebZsOdMr0fT5c3x6T/p6tCObYC8JPeRln5u'), --passAlice1
  ('Bob Chang',   '0987-654-321', 'carereceiver', 1, '$2b$10$k5riHxqMYU4Y5RHbOn1ti.CGQ9NYseIrqxfPitPH3Bq1TpUKVfh/K'), -- passBob1

  -- 第二組配對：Carol (caretaker) ↔ David (carereceiver)
  ('Carol Wu',   '0922-111-222', 'caretaker', 4, '$2b$10$R8ZQICT2DNgJ/0g1LnwqCu5/R8jJBzos/o9.E7F5wzy.NzdZ/5CM2'), -- passCarol1
  ('David Wu',   '0933-333-444', 'carereceiver', 3, '$2b$10$R8ZQICT2DNgJ/0g1LnwqCu5/R8jJBzos/o9.E7F5wzy.NzdZ/5CM2'), -- passDavid1

  -- 第三組：單獨帳號（尚未配對）
  ('Emma Lin',   '0944-555-666', 'caretaker', NULL, '$2b$10$IccHZNu1jWhWgNmmeognW.I8/n8uhHDFJRF6i6B/UZinGSdigSD/y'), -- passEmma1
  ('Frank Lin',  '0955-777-888', 'carereceiver', NULL, '$2b$10$9Wvy01sXMoc2qRKO6/SaRu5M9ehXq6XmvUozT0HudzWDx7lWc1P9u'); -- passFrank1

-- Trip 範例資料
INSERT INTO trip (caretaker_id, carereceiver_id, bus_id, bus_name, start_station, dest_station, status, start_time, end_time) VALUES
  -- pending
  (1, 2, 100, 'Route 100 Express', 'Station A', 'Station B', 'pending', NULL, NULL),
  -- active
  (3, 4, 200, 'Route 200 Local',   'Station X', 'Station Y', 'active', NOW(), NULL),
  -- completed
  (5, 6, 300, 'Route 300 Shuttle', 'Station M', 'Station N', 'complete', NOW() - INTERVAL '1 hour', NOW());

COMMIT;
