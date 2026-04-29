import Button from "../UI/Button/Button";
import styles from "./ConfirmModal.module.css";
import buttonStyles from "../UI/Button/Button.module.css";

type Props = {
    isOpen: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    isOpen,
    title,
    description = "Вы уверены?",
    onConfirm,
    onCancel,
}: Props) {
    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            onClick={onCancel}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h3 className={styles.title}>{title}</h3>}
                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <Button onClick={onConfirm} className={buttonStyles.danger}>
                        Да
                    </Button>

                    <Button onClick={onCancel} className={buttonStyles.gray}>
                        Отмена
                    </Button>
                </div>
            </div>
        </div>
    );
}