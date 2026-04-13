import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import TaskItem from "../TaskItem/TaskItem";
import { useState } from "react";
import type { FilterType } from "../../types/filter";
import TaskFilter from "../TaskFilter/TaskFilter";
import TaskSearch from "../TaskSearch/TaskSearch";

export default function TaskList() {
    const [filter, setFilter] = useState<FilterType>("all");
    const [search, setSearch] = useState<string>("");

    const tasks = useSelector((state: RootState) => state.tasks.items);

    const filteredTasks = tasks.filter((task) => {
        const matchStatus =
            filter === "all" ? true : task.status === filter;

        const matchSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchStatus && matchSearch;
    });

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
                    <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {filteredTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                )
            }
        </div>
    );
}