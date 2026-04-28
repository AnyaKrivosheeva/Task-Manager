import TaskItem from "../TaskItem/TaskItem";
import { useState } from "react";
import type { FilterType } from "../../types/filter";
import TaskFilter from "../TaskFilter/TaskFilter";
import TaskSearch from "../TaskSearch/TaskSearch";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { supabase } from "../../shared/api/supabase";
import { useTasksContext } from "../../shared/providers/TasksProvider";
import styles from "./TaskList.module.css";

export default function TaskList() {
    const { tasks, setTasks } = useTasksContext();

    const [filter, setFilter] = useState<FilterType>("all");
    const [search, setSearch] = useState<string>("");

    const filteredTasks = tasks.filter((task) => {
        const matchStatus =
            filter === "all" ? true : task.status === filter;

        const matchSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchStatus && matchSearch;
    });

    const sortedTasks = [...filteredTasks].sort(
        (a, b) => a.order - b.order
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = sortedTasks.findIndex(t => t.id === active.id);
        const newIndex = sortedTasks.findIndex(t => t.id === over.id);

        const reordered = arrayMove(sortedTasks, oldIndex, newIndex).map(
            (task, index) => ({
                ...task,
                order: index,
            })
        );

        setTasks(prev =>
            prev.map(task => {
                const updated = reordered.find(t => t.id === task.id);
                return updated ? updated : task;
            })
        );

        const { error } = await supabase
            .from("tasks")
            .upsert(
                reordered.map(t => ({
                    id: t.id,
                    order: t.order,
                    user_id: t.user_id,
                }))
            );

        if (error) {
            console.error("Ошибка при сохранении порядка:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Твои делишки</h2>

            <div className={styles.controls}>
                <TaskFilter currentFilter={filter} onChange={setFilter} />
                <TaskSearch value={search} onChange={setSearch} />
            </div>

            {filteredTasks.length === 0
                ? (<p className={styles.empty}>Пока нет делишек 📭</p>)
                : (
                    <div className={styles.listWrapper}>
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={sortedTasks.map(t => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <ul className={styles.list}>
                                    {sortedTasks.map(task => (
                                        <TaskItem key={task.id} task={task} />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    </div>
                )
            }
        </div>
    );
}