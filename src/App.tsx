import AddTaskForm from "./components/AddTaskForm/AddTaskForm"
import TaskList from "./components/TaskList/TaskList"
import TaskStats from "./pages/TaskStats"
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Auth from "./pages/Auth";
import { TasksProvider } from "./shared/providers/TasksProvider";

function App() {

  return (
    <TasksProvider>
      <div style={{ padding: "20px" }}>

        <nav style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              padding: "6px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              backgroundColor: isActive ? "#7955cd" : "#eee",
              color: isActive ? "#fff" : "#000",
            })}
          >
            Список делишек
          </NavLink>
          <NavLink
            to="/stats"
            style={({ isActive }) => ({
              padding: "6px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              backgroundColor: isActive ? "#7955cd" : "#eee",
              color: isActive ? "#fff" : "#000",
            })}
          >
            Статистика
          </NavLink>
          <NavLink
            to="/auth"
            style={({ isActive }) => ({
              padding: "6px 12px",
              marginLeft: "50px",
              borderRadius: "6px",
              textDecoration: "none",
              backgroundColor: isActive ? "#7955cd" : "#eee",
              color: isActive ? "#fff" : "#000",
            })}
          >
            Вход / Регистрация
          </NavLink>
        </nav>

        <Routes>
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
          <Route path="/auth" element={<Auth />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </TasksProvider>
  )
}

export default App
