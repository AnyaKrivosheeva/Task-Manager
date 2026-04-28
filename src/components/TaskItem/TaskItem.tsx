import type { Task, TaskPriority } from "../../types/task";
import { priorityLabels } from "../../shared/lib/priorityLabels";
import { statusLabels } from "../../shared/lib/statusLabels";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { supabase } from "../../shared/api/supabase";
import { useTasksContext } from "../../shared/providers/TasksProvider";
import { fromISOToInput, fromInputToISO } from "../../shared/lib/date";
import styles from "./TaskItem.module.css";
import Button from "../UI/Button/Button";
import ButtonStyles from "../UI/Button/Button.module.css";

type Props = {
    task: Task;
};

const nextStatus: Record<Task["status"], Task["status"]> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "todo",
};

export default function TaskItem({ task }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { setTasks } = useTasksContext();

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [deadline, setDeadline] = useState(task.deadline ? fromISOToInput(task.deadline) : "");

    const handleSave = async () => {
        const newDeadlineISO = fromInputToISO(deadline);

        const isChanged = newDeadlineISO !== task.deadline;

        const updates = {
            title,
            priority,
            deadline: newDeadlineISO,
            deadline_notified_1h: isChanged ? false : task.deadline_notified_1h,
            deadline_notified_24h: isChanged ? false : task.deadline_notified_24h,
        };

        const { error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", task.id);

        if (error) {
            console.error(error);
            return;
        }

        setTasks(prev =>
            prev.map(t =>
                t.id === task.id
                    ? { ...t, ...updates }
                    : t
            )
        );

        setIsEditing(false);
    };

    const handleDelete = async () => {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", task.id);

        if (error) {
            console.error(error);
            return;
        }

        setTasks(prev =>
            prev.filter(t => t.id !== task.id)
        );

        setIsDeleteOpen(false);
    };

    const handleStatusChange = async () => {
        const newStatus = nextStatus[task.status];

        const updates = {
            status: newStatus,
            completed_at:
                newStatus === "done"
                    ? new Date().toISOString()
                    : null,
        };

        const { error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", task.id);

        if (error) {
            console.error(error);
            return;
        }

        setTasks(prev =>
            prev.map(t =>
                t.id === task.id
                    ? { ...t, ...updates }
                    : t
            )
        );
    };

    const handleStartEdit = () => {
        setTitle(task.title);
        setPriority(task.priority);
        setDeadline(task.deadline ? fromISOToInput(task.deadline) : "");
        setIsEditing(true);
    };

    return (
        <>
            <li ref={setNodeRef} style={dragStyle} className={styles.item} {...attributes}>
                {!isEditing ? (
                    <>
                        <span {...listeners} className={styles.drag}>
                            ☰
                        </span>

                        <div className={styles.content}>
                            <div className={styles.title}>{task.title}</div>

                            <div className={styles.meta}>
                                <span className={`${styles.badge} ${styles[task.status]}`}>
                                    {statusLabels[task.status]}
                                </span>

                                {task.status !== "done" && (
                                    <>
                                        <span className={`${styles.badge} ${styles[task.priority]}`}>
                                            {priorityLabels[task.priority]}
                                        </span>

                                        {task.deadline && (
                                            <span className={styles.deadline}>
                                                ⏰ {new Date(task.deadline).toLocaleString("ru-RU", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleStatusChange} className={ButtonStyles.task_button}>Изменить статус</Button>

                            <Button onClick={handleStartEdit} className={ButtonStyles.task_button}>Редактировать</Button>

                            <Button onClick={() => setIsDeleteOpen(true)} className={ButtonStyles.task_delete}>
                                Удалить
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className={styles.edit}>
                        <div className={styles.actions}>
                            <input
                                className={styles.input}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <select
                                className={`${styles.input} ${styles.select}`}
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as TaskPriority)
                                }
                            >
                                <option value="low">Можно неспешно 🧘</option>
                                <option value="medium">В ближайшее время ⏳</option>
                                <option value="high">Попа уже горит 🔥</option>
                            </select>

                            <input
                                className={styles.input}
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleSave} className={`${ButtonStyles.task_button} ${styles.save}`}>Сохранить</Button>
                            <Button onClick={() => setIsEditing(false)} className={`${ButtonStyles.task_button} ${styles.cancel}`}>Отмена</Button>
                        </div>
                    </div>
                )}
            </li>

            <ConfirmModal
                isOpen={isDeleteOpen}
                description="Ты точно хочешь удалить эту задачу?"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
        </>
    );
}