import AddTaskForm from "./components/AddTaskForm/AddTaskForm"
import TaskList from "./components/TaskList/TaskList"
import TaskStats from "./pages/TaskStats"
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import { TasksProvider } from "./shared/providers/TasksProvider";
import { AuthProvider } from "./shared/providers/AuthProvider";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <Routes>

          {/* AUTH */}
          <Route element={<AuthLayout />}>
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              }
            />
          </Route>

          {/* PROTECTED */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={
                <>
                  <AddTaskForm />
                  <TaskList />
                </>
              }
            />

            <Route path="/stats" element={<TaskStats />} />
          </Route>

        </Routes>
      </TasksProvider>
    </AuthProvider>

  )
}

export default App
