🛠 Tech Stack

Frontend
React — основной UI-фреймворк
Vite — быстрый dev-сервер и сборка
TypeScript — статическая типизация
React Router — клиентский роутинг

UI & UX
CSS Modules — изолированная стилизация компонентов
Recharts — визуализация статистики
@dnd-kit/core — drag-and-drop сортировка задач

Backend & Infrastructure
Supabase:
-PostgreSQL база данных
-Аутентификация
-Хранение push-подписок

Serverless функции (Supabase Edge Functions)
-отправка push-уведомлений

Cron jobs
-триггер отправки уведомлений (дедлайны задач)

Testing
Vitest — юнит-тестирование

Additional Features
Web Push API — браузерные push-уведомления

📦 Summary
Приложение построено как SPA на React + Vite, с backend-частью на Supabase, включая:
-аутентификацию
-хранение данных
-серверные функции
-push-уведомления через cron-задачи


🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/your-project.git
cd your-project

2. Install dependencies
npm install  /  pnpm install

3. Configure environment variables
Создай файл .env в корне проекта на основе .env.example

4. Run the development server
npm run dev

5. Run tests
npm run test

