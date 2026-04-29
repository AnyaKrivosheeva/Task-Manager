type Props = {
    title: React.ReactNode;
    subtitle?: string;

    email: string;
    password: string;

    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;

    onSubmit: (e: React.SubmitEvent) => void;

    loading?: boolean;
    error?: string | null;

    submitText: string;

    footer?: React.ReactNode;
};

import Button from "../UI/Button/Button";
import styles from "./Auth.module.css";
import ButtonStyles from "../UI/Button/Button.module.css";

export default function AuthForm({
    title,
    subtitle,
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    loading,
    error,
    submitText,
    footer,
}: Props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>{title}</h1>

                {subtitle && (
                    <h2 className={styles.subtitle}>{subtitle}</h2>
                )}

                <form onSubmit={onSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                    />

                    <input
                        className={styles.input}
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                    />

                    <Button type="submit" className={ButtonStyles.auth}>
                        {loading ? "Загрузка..." : submitText}
                    </Button>
                </form>

                {error && <p className={styles.error}>{error}</p>}

                {footer && <div className={styles.switch}>{footer}</div>}
            </div>
        </div>
    );
}