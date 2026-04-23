import { useState } from "react";
import { supabase } from "../shared/api/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Пароль должен быть минимум 6 символов");
            return;
        }

        setLoading(true);

        try {
            if (mode === "register") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message);
                    return;
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message);
                    return;
                }
            }

            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Загрузка..."
                        : mode === "login"
                            ? "Войти"
                            : "Зарегистрироваться"}
                </button>
            </form>

            {error && (
                <p style={{ fontSize: "12px", color: "#d30202" }}>
                    Пароль минимум 6 символов!
                </p>
            )}

            <button
                onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError(null);
                }}
            >
                Переключить режим
            </button>
        </div >
    );
}