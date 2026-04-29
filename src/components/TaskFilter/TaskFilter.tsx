import { statusLabels } from "../../shared/lib/statusLabels";
import type { FilterType } from "../../types/filter";
import type { TaskStatus } from "../../types/task";
import styles from "./TaskFilter.module.css";

type Props = {
    currentFilter: FilterType;
    onChange: (filter: FilterType) => void;
};

export default function TaskFilter({ currentFilter, onChange }: Props) {
    const statuses = Object.keys(statusLabels) as TaskStatus[];

    return (
        <div className={styles.container}>
            <button
                onClick={() => onChange("all")}
                className={`${styles.button} ${currentFilter === "all" ? styles.active : ""}`}
            >
                Все
            </button>

            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onChange(status)}
                    className={`${styles.button} ${currentFilter === status ? styles.active : ""}`}
                >
                    {statusLabels[status]}
                </button>
            ))}
        </div>
    )
}