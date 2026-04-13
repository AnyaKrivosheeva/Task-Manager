import type { TaskStatus } from "../../types/task";

export const statusLabels: Record<TaskStatus, string> = {
    todo: "Надо сделать",
    "in-progress": "В процессе",
    done: "Сделано",
};