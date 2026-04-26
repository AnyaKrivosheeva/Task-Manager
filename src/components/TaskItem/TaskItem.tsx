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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex",
        gap: "10px",
        alignItems: "center",
        cursor: "default"
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

        const { error } = await supabase
            .from("tasks")
            .update({
                status: nextStatus[task.status],
            })
            .eq("id", task.id);

        if (error) {
            console.error(error);
            return;
        }

        setTasks(prev =>
            prev.map(t =>
                t.id === task.id
                    ? { ...t, status: newStatus }
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
            <li ref={setNodeRef} style={style} {...attributes}>
                {!isEditing ? (
                    <>
                        <span {...listeners} style={{ cursor: "grab", marginRight: "8px" }}>
                            ☰
                        </span>

                        <h3>{task.title}</h3>

                        <p>Приоритет: {priorityLabels[task.priority]}</p>

                        <p>Статус: {statusLabels[task.status]}</p>

                        {task.deadline && (
                            <p>
                                Дедлайн:{" "}
                                {new Date(task.deadline).toLocaleString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                })}
                            </p>
                        )}

                        <button onClick={handleStatusChange}>Изменить статус</button>

                        <button onClick={handleStartEdit}>Редактировать</button>

                        <button onClick={() => setIsDeleteOpen(true)}>
                            Удалить
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value as TaskPriority)
                            }
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

                        <button onClick={handleSave}>Сохранить</button>
                        <button onClick={() => setIsEditing(false)}>Отмена</button>
                    </>
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