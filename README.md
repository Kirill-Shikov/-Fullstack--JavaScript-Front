# Library Aggregator

Агрегатор для поиска и бронирования книг в библиотеках.

##  Технологии

### Backend:
- NestJS
- TypeORM
- PostgreSQL
- JWT
- WebSocket (Socket.io)

### Frontend:
- React
- TypeScript
- React Router
- CSS Modules

## Запуск

1. Клонирование репозитория
2. Настройка переменных окружения
   Создать .env из шаблона .env-example (если нужно)
3. Запуск базы данных (Docker)
   docker run --name library-postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=library_db \
    -p 5432:5432 -d postgres:15
4. Запуск бэкенда
   npm install
   npm run start
5. Запуск фронтенда
   npm install
   npm start
