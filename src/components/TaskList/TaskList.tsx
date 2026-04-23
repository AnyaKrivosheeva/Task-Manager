import TaskItem from "../TaskItem/TaskItem";
import { useState } from "react";
import type { FilterType } from "../../types/filter";
import TaskFilter from "../TaskFilter/TaskFilter";
import TaskSearch from "../TaskSearch/TaskSearch";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

import { supabase } from "../../shared/api/supabase";
import { useTasksContext } from "../../shared/providers/TasksProvider";

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

        const newOrder = arrayMove(sortedTasks, oldIndex, newIndex).map(
            (task, index) => ({
                ...task,
                order: index,
            })
        );

        setTasks(newOrder);

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) return;

        const updates = newOrder.map(task => ({
            id: task.id,
            order: task.order,
            user_id: user.id,
        }));

        const { error } = await supabase
            .from("tasks")
            .upsert(updates);

        if (error) {
            console.error("Ошибка при сохранении порядка:", error);
        }
    };

    return (
        <div>
            <h2>Список делишек</h2>

            <div style={{ display: "flex", gap: "150px", marginBottom: "10px", alignItems: "center" }}>

                <TaskSearch value={search} onChange={setSearch} />
                <TaskFilter currentFilter={filter} onChange={setFilter} />
            </div>

            {filteredTasks.length === 0
                ? (<p>Пока нет делишек</p>)
                : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {sortedTasks.map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>

                )
            }
        </div>
    );
}