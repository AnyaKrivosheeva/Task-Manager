import type { TaskStatus } from "../../types/task";

export const statusLabels: Record<TaskStatus, string> = {
    todo: "Не начато",
    "in-progress": "В процессе",
    done: "Сделано",
};