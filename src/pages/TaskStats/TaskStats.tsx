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
import type { StatsPeriod } from "../../types/stats";
import { useTasksContext } from "../../shared/providers/TasksProvider";
import { formatDate, getStatusData } from "./taskStats.utils";
import type { DayKey } from "./taskStats.utils";
import Button from "../../components/UI/Button/Button";
import styles from "./TaskStats.module.css";
import { periodLabels } from "../../shared/lib/periodLabels";

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
            const created = new Date(t.created_at).getTime();
            const completed = t.completed_at
                ? new Date(t.completed_at).getTime()
                : null;

            return (
                (created >= from && created <= to) ||
                (completed !== null && completed >= from && completed <= to)
            );
        });
    }, [tasks, fromDate, toDate]);

    const isEmpty = filteredTasks.length === 0;

    const grouped = useMemo(() => {
        const map: Record<
            DayKey,
            { created: number; completed: number }
        > = {};

        for (const task of filteredTasks) {
            const createdKey = formatDate(new Date(task.created_at));

            if (!map[createdKey]) {
                map[createdKey] = { created: 0, completed: 0 };
            }

            map[createdKey].created += 1;

            if (task.completed_at) {
                const completedKey = formatDate(new Date(task.completed_at));

                if (!map[completedKey]) {
                    map[completedKey] = { created: 0, completed: 0 };
                }

                map[completedKey].completed += 1;
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
        const result = getStatusData(filteredTasks);

        return [
            { name: "Надо сделать", value: result.todo, fill: "#677dd2" },
            { name: "В процессе", value: result["in-progress"], fill: "#ffc658" },
            { name: "Сделано", value: result.done, fill: "#82ca9d" },
        ];
    }, [filteredTasks]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Статистика делишек</h2>

            <div className={styles.filters}>
                {Object.entries(periodLabels).map(([key, label]) => {
                    const p = key as StatsPeriod;

                    return (
                        <Button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={[
                                styles.btn,
                                period === p && styles.btn_active,
                            ].filter(Boolean).join(" ")}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>

            {isEmpty
                ? (
                    <div className={styles.empty}>
                        За выбранный период задач нет 📭
                    </div>
                )
                : (
                    < div className={styles.charts}>
                        <PieChart width={400} height={350}>
                            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={120} label />
                            <Tooltip />
                            <Legend />
                        </PieChart>

                        <div className={styles.barWrapper}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                                    <XAxis dataKey="date" angle={-30} textAnchor="end" height={80} />
                                    <YAxis allowDecimals={false} tickCount={3} />
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={40} />

                                    <Bar dataKey="created" fill="#677dd2" radius={[6, 6, 0, 0]} maxBarSize={30} name="Создано" />
                                    <Bar dataKey="completed" fill="#82ca9d" radius={[6, 6, 0, 0]} maxBarSize={30} name="Выполнено" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
        </div >
    );
}