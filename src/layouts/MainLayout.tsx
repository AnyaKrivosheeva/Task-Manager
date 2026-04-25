import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../shared/api/supabase";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";

export default function MainLayout() {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLogoutOpen(false);
        navigate("/auth");
    };

    const getLinkStyle = (isActive: boolean) => ({
        padding: "6px 12px",
        borderRadius: "6px",
        textDecoration: "none",
        backgroundColor: isActive ? "#7955cd" : "#eee",
        color: isActive ? "#fff" : "#000",
    });

    return (
        <div style={{ padding: "20px" }}>
            <nav style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <NavLink to="/" style={({ isActive }) => getLinkStyle(isActive)}>Список делишек</NavLink>
                <NavLink to="/stats" style={({ isActive }) => getLinkStyle(isActive)}>Статистика</NavLink>

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

            <Outlet />

            <ConfirmModal
                isOpen={isLogoutOpen}
                description="Вы точно хотите выйти?"
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutOpen(false)}
            />
        </div>
    );
}