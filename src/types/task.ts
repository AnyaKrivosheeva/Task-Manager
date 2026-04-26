export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    created_at: string;
    deadline: string | null;
    order: number;
    deadline_notified_1h: boolean;
    deadline_notified_24h: boolean;
}