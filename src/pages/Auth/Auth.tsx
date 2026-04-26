import { useState } from "react";
import { supabase } from "../../shared/api/supabase";
import { useNavigate } from "react-router-dom";
import { subscribeToPush } from "../../shared/lib/push";

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

        if (!email.trim() || !password.trim()) {
            setError("Заполни email и пароль");
            return;
        }

        if (password.length < 6) {
            setError("Пароль должен быть минимум 6 символов");
            return;
        }

        setLoading(true);

        try {
            let userId: string | null = null;

            if (mode === "register") {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message);
                    return;
                }

                userId = data.user?.id ?? null;
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message);
                    return;
                }

                userId = data.user?.id ?? null;
            }

            try {
                const permission = await Notification.requestPermission();

                if (permission === "granted") {
                    const { data: existing } = await supabase
                        .from("push_subscriptions")
                        .select("endpoint")
                        .eq("user_id", userId)
                        .maybeSingle();

                    if (existing) {
                        console.log("Already subscribed");
                        return;
                    }

                    const subscription = await subscribeToPush();

                    if (!subscription?.endpoint) return;

                    console.log("PUSH SUBSCRIPTION:", subscription);

                    const { error: upsertError } = await supabase
                        .from("push_subscriptions")
                        .upsert(
                            {
                                user_id: userId,
                                endpoint: subscription.endpoint,
                                subscription: subscription,
                            },
                            {
                                onConflict: "endpoint",
                            }
                        );

                    if (upsertError) {
                        console.error("Push save error:", upsertError);
                    }
                }
            } catch (pushError) {
                console.error("Push init failed:", pushError);
            }

            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Менеджер для твоих делишек</h1>
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
                    {error}
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