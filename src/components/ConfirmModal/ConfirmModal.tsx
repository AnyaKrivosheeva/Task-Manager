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
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h3>{title}</h3>}
                <p>{description}</p>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={onConfirm}>
                        Да
                    </button>

                    <button onClick={onCancel}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}