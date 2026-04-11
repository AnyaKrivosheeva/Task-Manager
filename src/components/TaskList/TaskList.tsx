import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import TaskItem from "../TaskItem/TaskItem";

export default function TaskList() {
    const tasks = useSelector((state: RootState) => state.tasks.items);

    return (
        <div>
            <h2>Список делишек</h2>

            {tasks.length === 0
                ? (<p>Пока нет делишек</p>)
                : (
                    <ul>
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                )
            }
        </div>
    );
}