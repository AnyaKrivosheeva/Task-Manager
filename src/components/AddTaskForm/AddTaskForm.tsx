import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../../store/tasksSlice";
import type { TaskPriority } from "../../types/task";

export default function AddTaskForm() {
    const dispatch = useDispatch();

    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [deadline, setDeadline] = useState<string>("");

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const newTask = {
            id: crypto.randomUUID(),
            title,
            status: "todo" as const,
            priority,
            createdAt: new Date().toISOString(),
            deadline: deadline || undefined,
        };

        dispatch(addTask(newTask));

        setTitle("");
        setPriority("medium");
        setDeadline("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Что надо сделать"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
                <option value="low">Можно неспешно</option>
                <option value="medium">В ближайшее время</option>
                <option value="high">Попа уже горит</option>
            </select>

            <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />

            <button type="submit">Добавить</button>
        </form>
    );
}