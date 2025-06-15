# Dockerfile for SafeTrip backend
# --------------------------------------------------
# 使用 Node.js 22 + Alpine 作為基底
# 安裝 psql client，複製程式與 SQL，並在容器啟動時執行資料庫初始化後啟動服務

FROM node:22-alpine
ENV PORT=3000
# 安裝 Postgres client
RUN apk add --no-cache postgresql-client

# 建立工作目錄
WORKDIR /app

# 複製並安裝相依
COPY package*.json ./
RUN npm install --production

# 複製程式碼與 SQL 檔到 database 資料夾
COPY . .

# 對外開放 3000 端口
EXPOSE ${PORT}

# 啟動時：等待 Postgres，就緒後執行 schema & seed，然後啟動應用

CMD ["sh", "-c", "\
    until pg_isready -h $DB_HOST -p $DB_PORT ; do echo 'Waiting for Database...'; sleep 2; done; \
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql; \
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c 'SELECT COUNT(*) FROM users;' >/dev/null 2>&1; \
    if [ $? -ne 0 ] || [ $(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc 'SELECT COUNT(*) FROM users;') -eq 0 ]; then \
        echo 'Initializing database with seed data...'; \
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f seed.sql; \
    else \
        echo 'Database already has data, skipping seed'; \
    fi; \
    exec npm run dev"]

