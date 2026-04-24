import AddTaskForm from "./components/AddTaskForm/AddTaskForm"
import TaskList from "./components/TaskList/TaskList"
import TaskStats from "./pages/TaskStats"
import { Routes, Route, Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import Auth from "./pages/Auth";
import { TasksProvider } from "./shared/providers/TasksProvider";
import { supabase } from "./shared/api/supabase";
import { useEffect, useState } from "react";
import ConfirmModal from "./components/ConfirmModal/ConfirmModal";
import type { User } from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/auth";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogoutOpen(false);
    navigate("/auth");
  };

  return (
    <TasksProvider>
      <div style={{ padding: "20px" }}>

        {!isAuthPage && user && (
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

            <button
              onClick={() => setIsLogoutOpen(true)}
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#eee",
                cursor: "pointer",
              }}
            >
              Выйти
            </button>
          </nav>
        )}

        <Routes>
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" />}
          />

          <Route
            path="/"
            element={
              user ? (
                <>
                  <AddTaskForm />
                  <TaskList />
                </>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          <Route
            path="/stats"
            element={user ? <TaskStats /> : <Navigate to="/auth" />}
          />

          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/auth"} />}
          />
        </Routes>

        <ConfirmModal
          isOpen={isLogoutOpen}
          description="Вы точно хотите выйти?"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutOpen(false)}
        />
      </div>
    </TasksProvider>
  )
}

export default App
