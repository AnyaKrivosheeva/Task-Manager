import { statusLabels } from "../../shared/lib/statusLabels";
import type { FilterType } from "../../types/filter";
import type { TaskStatus } from "../../types/task";

type Props = {
    currentFilter: FilterType;
    onChange: (filter: FilterType) => void;
};

export default function TaskFilter({ currentFilter, onChange }: Props) {
    const statuses = Object.keys(statusLabels) as TaskStatus[];

    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
                onClick={() => onChange("all")}
                style={{
                    cursor: "pointer",
                    fontWeight: currentFilter === "all" ? "bold" : "normal",
                }}
            >
                Все
            </button>

            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onChange(status)}
                    style={{
                        cursor: "pointer",
                        fontWeight: currentFilter === status ? "bold" : "normal",
                    }}
                >
                    {statusLabels[status]}
                </button>
            ))}
        </div>
    )
}