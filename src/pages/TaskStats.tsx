import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";
import type { StatsPeriod } from "../types/stats";
import { useTasksContext } from "../shared/providers/TasksProvider";

type DayKey = string;

const formatDate = (date: Date): DayKey => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export default function TaskStats() {
    const { tasks } = useTasksContext();

    const [period, setPeriod] = useState<StatsPeriod>("week");

    const now = new Date();

    const { fromDate, toDate } = useMemo(() => {
        if (tasks.length === 0) return { fromDate: null, toDate: null };

        const dates = tasks.map(t => new Date(t.created_at).getTime());
        const min = new Date(Math.min(...dates));

        const baseEnd = endOfDay(now);

        switch (period) {
            case "day":
                return {
                    fromDate: startOfDay(new Date(now)),
                    toDate: baseEnd,
                };

            case "week":
                return {
                    fromDate: startOfDay(new Date(now.getTime() - 7 * 86400000)),
                    toDate: baseEnd,
                };

            case "month":
                return {
                    fromDate: startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())),
                    toDate: baseEnd,
                };

            case "all":
            default:
                return {
                    fromDate: startOfDay(min),
                    toDate: baseEnd,
                };
        }
    }, [tasks, period]);

    const filteredTasks = useMemo(() => {
        if (!fromDate || !toDate) return tasks;

        const from = fromDate.getTime();
        const to = toDate.getTime();

        return tasks.filter(t => {
            const time = new Date(t.created_at).getTime();
            return time >= from && time <= to;
        });
    }, [tasks, fromDate, toDate]);

    const grouped = useMemo(() => {
        const map: Record<
            DayKey,
            { created: number; completed: number }
        > = {};

        for (const task of filteredTasks) {
            const key = formatDate(new Date(task.created_at));

            if (!map[key]) {
                map[key] = { created: 0, completed: 0 };
            }

            map[key].created += 1;

            if (task.status === "done") {
                map[key].completed += 1;
            }
        }

        return map;
    }, [filteredTasks]);

    const datesRange = useMemo(() => {
        if (!fromDate || !toDate) return [];

        const result: string[] = [];
        const current = startOfDay(fromDate);
        const end = startOfDay(toDate);

        while (current <= end) {
            result.push(formatDate(current));
            current.setDate(current.getDate() + 1);
        }

        return result;
    }, [fromDate, toDate]);

    const chartData = useMemo(() => {
        return datesRange.map(date => ({
            date,
            created: grouped[date]?.created ?? 0,
            completed: grouped[date]?.completed ?? 0,
        }));
    }, [datesRange, grouped]);

    const statusData = useMemo(() => {
        const result = {
            todo: 0,
            "in-progress": 0,
            done: 0,
        };

        for (const t of filteredTasks) {
            result[t.status] += 1;
        }

        return [
            { name: "Надо сделать", value: result.todo, fill: "#8884d8" },
            { name: "В процессе", value: result["in-progress"], fill: "#ffc658" },
            { name: "Сделано", value: result.done, fill: "#82ca9d" },
        ];
    }, [filteredTasks]);

    const getButtonStyle = (value: StatsPeriod) => ({
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        backgroundColor: period === value ? "#7955cd" : "#fff",
        color: period === value ? "#fff" : "#000",
        fontWeight: period === value ? "bold" : "normal",
    });

    return (
        <div style={{ marginTop: "30px" }}>
            <h2>Статистика делишек</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button onClick={() => setPeriod("day")} style={getButtonStyle("day")}>
                    Сегодня
                </button>
                <button onClick={() => setPeriod("week")} style={getButtonStyle("week")}>
                    Неделя
                </button>
                <button onClick={() => setPeriod("month")} style={getButtonStyle("month")}>
                    Месяц
                </button>
                <button onClick={() => setPeriod("all")} style={getButtonStyle("all")}>
                    Все время
                </button>
            </div>

            <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
                <PieChart width={400} height={350}>
                    <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={120} label />
                    <Tooltip />
                    <Legend />
                </PieChart>

                <div style={{ width: "100%", maxWidth: "700px", margin: "30px auto", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Bar dataKey="created" fill="#7955cd" name="Создано" />
                            <Bar dataKey="completed" fill="#3ece75" name="Выполнено" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}