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
}: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.btn} ${className}`}
        >
            {children}
        </button>
    );
}