import type { Task, TaskPriority } from "../../types/task";
import { useDispatch } from "react-redux";
import { priorityLabels } from "../../shared/lib/priorityLabels";
import { statusLabels } from "../../shared/lib/statusLabels";
import { updateTask, deleteTask, setTaskStatus } from "../../store/tasksSlice";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    task: Task;
};

const nextStatus: Record<Task["status"], Task["status"]> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "todo",
};

export default function TaskItem({ task }: Props) {
    const dispatch = useDispatch();

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

    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [deadline, setDeadline] = useState(task.deadline || "");

    const handleSave = () => {
        dispatch(
            updateTask({
                ...task,
                title,
                priority,
                deadline: deadline || undefined,
            })
        );

        setIsEditing(false);
    };

    const handleStartEdit = () => {
        setTitle(task.title);
        setPriority(task.priority);
        setDeadline(task.deadline || "");
        setIsEditing(true);
    };

    return (
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
                                dateStyle: "short",
                                timeStyle: "short",
                            })}
                        </p>
                    )}

                    <button
                        onClick={() =>
                            dispatch(
                                setTaskStatus({
                                    id: task.id,
                                    status: nextStatus[task.status],
                                })
                            )
                        }
                    >
                        Изменить статус
                    </button>

                    <button onClick={handleStartEdit}>Редактировать</button>

                    <button onClick={() => dispatch(deleteTask(task.id))}>
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
    );
}