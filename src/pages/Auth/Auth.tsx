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