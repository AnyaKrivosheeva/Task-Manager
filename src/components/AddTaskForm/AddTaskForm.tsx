import { useState } from "react";
import type { TaskPriority } from "../../types/task";
import { supabase } from "../../shared/api/supabase";
import { useTasksContext } from "../../shared/providers/TasksProvider";
import { fromInputToISO } from "../../shared/lib/date";

export default function AddTaskForm() {
    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [deadline, setDeadline] = useState<string>("");

    const { setTasks } = useTasksContext();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) return;

        const newTask = {
            id: crypto.randomUUID(),
            user_id: user.id,
            title,
            status: "todo" as const,
            priority,
            created_at: new Date().toISOString(),
            deadline: fromInputToISO(deadline),
            order: Date.now(),
            deadline_notified: false,
        };

        setTasks(prev => [...prev, newTask]);

        const { error } = await supabase
            .from("tasks")
            .insert([newTask]);

        if (error) {
            console.error(error);

            setTasks(prev => prev.filter(t => t.id !== newTask.id));
            return;
        }

        try {
            await fetch("https://aqrneetsadfpyvsmfvyh.supabase.co/functions/v1/send-push", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    type: "task_created",
                    title: "Новая задача",
                    body: title,
                    task_id: newTask.id,
                    deadline: deadline || null,
                }),
            });
        } catch (err) {
            console.error("Push error:", err);
        }

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