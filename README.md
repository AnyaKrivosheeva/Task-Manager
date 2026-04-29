# Task Manager 🗂️
A simple task management app with drag-and-drop, statistics and notifications.

## 🛠 Tech Stack

### Frontend
- React
- Vite
- TypeScript
- React Router

### State & Architecture
- React Context API
- Feature-based folder structure

### UI & Styling
- CSS Modules
- Recharts (data visualization)
- @dnd-kit/core (drag & drop)

### Backend
- Supabase (Auth + Database + Edge Functions)
- PostgreSQL database
- Serverless functions for push notifications
- Cron jobs for scheduled reminders

### Testing
- Vitest

### Additional Features
Web Push API — браузерные push-уведомления

# 📦 Summary
Приложение построено как SPA на React + Vite, с backend-частью на Supabase, включая:
-аутентификацию
-хранение данных
-серверные функции
-push-уведомления через cron-задачи


# 🚀 Getting Started
1. Clone the repository

```bash
git clone https://github.com/AnyaKrivosheeva/Task-Manager.git
cd Task-Manager

3. Install dependencies
```bash
npm install
```bash
  pnpm install

4. Configure environment variables
Создай файл .env в корне проекта на основе .env.example

5. Run the development server
```bash
npm run dev

6. Run tests
```bash
npm run test

