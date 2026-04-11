import type { TaskPriority } from "../../types/task";

export const priorityLabels: Record<TaskPriority, string> = {
    low: "🧘 Можно неспешно",
    medium: "⏳ В ближайшее время",
    high: "🔥 Попа уже горит",
};