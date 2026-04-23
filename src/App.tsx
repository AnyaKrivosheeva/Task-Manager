import AddTaskForm from "./components/AddTaskForm/AddTaskForm"
import TaskList from "./components/TaskList/TaskList"
import TaskStats from "./components/TaskStats/TaskStats"
import { Routes, Route, Navigate, NavLink } from "react-router-dom";

function App() {
  return (
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
