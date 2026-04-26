import { describe, it, expect } from "vitest";
import { formatDate, getStatusData } from "./taskStats.utils";
import type { Task } from "../../types/task";

describe("TaskStats utils", () => {
    it("formats date correctly", () => {
        const date = new Date("2024-01-01T10:00:00Z");

        expect(formatDate(date)).toBe("2024-01-01");
    });

    it("counts tasks by status correctly", () => {
        const tasks: Task[] = [
            {
                id: "1",
                user_id: "u1",
                title: "Task 1",
                description: "desc",
                status: "todo",
                priority: "medium",
                created_at: "2024-01-01T10:00:00Z",
                deadline: null,
                order: 1,
                deadline_notified_1h: false,
                deadline_notified_24h: false,
            },
            {
                id: "2",
                user_id: "u1",
                title: "Task 2",
                description: "desc",
                status: "todo",
                priority: "medium",
                created_at: "2024-01-01T11:00:00Z",
                deadline: null,
                order: 2,
                deadline_notified_1h: false,
                deadline_notified_24h: false,
            },
            {
                id: "3",
                user_id: "u1",
                title: "Task 3",
                description: "desc",
                status: "done",
                priority: "high",
                created_at: "2024-01-01T12:00:00Z",
                deadline: null,
                order: 3,
                deadline_notified_1h: true,
                deadline_notified_24h: true,
            },
        ];

        const result = getStatusData(tasks);

        expect(result.todo).toBe(2);
        expect(result.done).toBe(1);
        expect(result["in-progress"]).toBe(0);
    });
});