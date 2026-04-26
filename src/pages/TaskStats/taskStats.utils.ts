import type { Task } from "../../types/task";

export type DayKey = string;

export function formatDate(date: Date): DayKey {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
}

export function getStatusData(tasks: Task[]) {
    const result = {
        todo: 0,
        "in-progress": 0,
        done: 0,
    };

    for (const t of tasks) {
        result[t.status]++;
    }

    return result;
}