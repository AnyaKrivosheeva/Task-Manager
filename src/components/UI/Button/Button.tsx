import styles from "./Button.module.css";

type Props = {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

export default function Button({
    onClick,
    className = "",
    children,
    type = "button",
    disabled = false,
}: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.btn} ${className}`}
        >
            {children}
        </button>
    );
}