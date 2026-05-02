import { useState } from "react";
import type { TaskPriority } from "../../types/task";
import { supabase } from "../../shared/api/supabase";
import { useTasksContext } from "../../shared/providers/TasksProvider";
import { fromInputToISO } from "../../shared/lib/date";
import Button from "../UI/Button/Button";
import styles from "./AddTaskForm.module.css";
import { useAuth } from "../../shared/hooks/useAuth";

export default function AddTaskForm() {
    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [deadline, setDeadline] = useState<string>("");

    const { setTasks } = useTasksContext();

    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) return;

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
            deadline_notified_1h: false,
            deadline_notified_24h: false,
            completed_at: null,
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
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push`, {
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
        <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={`${styles.field} ${styles.titleInput}`}
                    type="text"
                    placeholder="Что надо сделать"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    className={`${styles.field} ${styles.select}`}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                    <option value="low">Можно неспешно 🧘</option>
                    <option value="medium">В ближайшее время ⏳</option>
                    <option value="high">Попа уже горит 🔥</option>
                </select>

                <input
                    className={`${styles.field} ${styles.date}`}
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <div className={styles.actions}>
                    <Button type="submit">
                        Добавить
                    </Button>
                </div>
            </form>
        </div>
    );
}