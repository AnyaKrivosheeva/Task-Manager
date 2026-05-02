import { useState } from "react";
import { supabase } from "../../shared/api/supabase";
import { useNavigate } from "react-router-dom";
import { subscribeToPush } from "../../shared/lib/push";
import AuthForm from "../../components/AuthForm/AuthForm";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const setupPush = async (userId: string) => {
        try {
            const permission =
                Notification.permission === "granted"
                    ? "granted"
                    : await Notification.requestPermission();

            if (permission !== "granted") return;

            const subscription = await subscribeToPush();

            if (!subscription?.endpoint) return;

            const { error } = await supabase
                .from("push_subscriptions")
                .upsert(
                    {
                        user_id: userId,
                        endpoint: subscription.endpoint,
                        subscription,
                    },
                    {
                        onConflict: "user_id,endpoint",
                    }
                );

            if (error) {
                console.error("Push save error:", error);
            }
        } catch (e) {
            console.error("Push setup failed:", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return;

        setError(null);
        setLoading(true);

        try {
            if (!email.trim() || !password.trim()) {
                setError("Заполни email и пароль");
                return;
            }

            if (password.length < 6) {
                setError("Пароль должен быть минимум 6 символов");
                return;
            }

            let userId: string | null = null;

            if (mode === "login") {
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
            if (mode === "register") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message);
                    return;
                }
                const { data: userData } = await supabase.auth.getUser();

                userId = userData.user?.id ?? null;
            }

            if (!userId) {
                console.warn("Auth succeeded but userId is null");
                return;
            }

            await setupPush(userId);

            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Менеджер для твоих делишек"
            subtitle={mode === "login" ? "Вход" : "Регистрация"}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitText={mode === "login" ? "Войти" : "Зарегистрироваться"}
            footer={
                <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
                    {mode === "login"
                        ? "Нет аккаунта? Зарегистрироваться"
                        : "Уже есть аккаунт? Войти"}
                </span>
            }
        />
    );
}