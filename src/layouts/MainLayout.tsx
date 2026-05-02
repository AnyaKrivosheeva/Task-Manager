import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "../shared/api/supabase";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import Button from "../components/UI/Button/Button";
import buttonStyles from "../components/UI/Button/Button.module.css";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLogoutOpen(false);
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navigation}>
                <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Список делишек</NavLink>
                <NavLink to="/stats" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Статистика</NavLink>

                <Button
                    onClick={() => setIsLogoutOpen(true)}
                    className={buttonStyles.quit}
                >
                    Выйти
                </Button>
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