import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import type { StatsPeriod } from "../../types/stats";

export default function TaskStats() {
    const tasks = useSelector((state: RootState) => state.tasks.items);

    const [period, setPeriod] = useState<StatsPeriod>("week");

    const { fromDate, toDate } = useMemo(() => {
        if (tasks.length === 0) return { fromDate: null, toDate: null };

        const dates = tasks.map(t => new Date(t.createdAt).getTime());

        const min = new Date(Math.min(...dates));
        const max = new Date(Math.max(...dates));

        if (period === "week") {
            const now = new Date();
            return {
                fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
                toDate: now,
            };
        }

        if (period === "month") {
            const now = new Date();
            return {
                fromDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                toDate: now,
            };
        }

        return {
            fromDate: min,
            toDate: max,
        };
    }, [period, tasks]);

    const filteredByTime = useMemo(() => {
        if (!fromDate || !toDate) return tasks;

        return tasks.filter(task => {
            const date = new Date(task.createdAt);
            return date >= fromDate && date <= toDate;
        });
    }, [tasks, fromDate, toDate]);

    const statusData = useMemo(() => [
        {
            name: "Надо сделать",
            value: filteredByTime.filter(t => t.status === "todo").length,
            fill: "#8884d8",
        },
        {
            name: "В процессе",
            value: filteredByTime.filter(t => t.status === "in-progress").length,
            fill: "#ffc658",
        },
        {
            name: "Сделано",
            value: filteredByTime.filter(t => t.status === "done").length,
            fill: "#82ca9d",
        },
    ], [filteredByTime]);

    const getDatesRange = (from: Date, to: Date) => {
        const dates: string[] = [];
        const current = new Date(from);

        while (current <= to) {
            dates.push(current.toLocaleDateString("ru-RU"));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    };

    const chartData = useMemo(() => {
        const grouped: Record<string, { created: number; completed: number }> = {};

        filteredByTime.forEach(task => {
            const date = new Date(task.createdAt).toLocaleDateString("ru-RU");

            if (!grouped[date]) {
                grouped[date] = { created: 0, completed: 0 };
            }

            grouped[date].created += 1;

            if (task.status === "done") {
                grouped[date].completed += 1;
            }
        });

        if (!fromDate) {
            return Object.entries(grouped).map(([date, value]) => ({
                date,
                ...value,
            }));
        }

        const toDate = new Date();

        const allDates = fromDate && toDate
            ? getDatesRange(fromDate, toDate)
            : [];

        return allDates.map(date => ({
            date,
            created: grouped[date]?.created || 0,
            completed: grouped[date]?.completed || 0,
        }));
    }, [filteredByTime, fromDate]);

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
                <button onClick={() => setPeriod("week")} style={getButtonStyle("week")}>Неделя</button>
                <button onClick={() => setPeriod("month")} style={getButtonStyle("month")}>Месяц</button>
                <button onClick={() => setPeriod("all")} style={getButtonStyle("all")}>Все время</button>
            </div>

            <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
                <PieChart width={400} height={300}>
                    <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>

                <div style={{ width: "100%", maxWidth: "700px", margin: "30px auto", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                            <XAxis
                                dataKey="date"
                                interval={period === "month" ? 5 : 0}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Bar
                                dataKey="created"
                                fill="#7955cd"
                                name="Создано"
                                maxBarSize={30}
                                radius={[4, 4, 0, 0]}
                            />

                            <Bar
                                dataKey="completed"
                                fill="#3ece75"
                                name="Выполнено"
                                maxBarSize={30}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}