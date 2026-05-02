import { useCallback, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import type { Task } from "../../types/task";
import { useAuth } from "./useAuth";

export function useTasks() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = useCallback(async () => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("order", { ascending: true });

        if (error) {
            setLoading(false);
            return;
        }

        setTasks(data ?? []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel("tasks-global")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tasks",
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    loadTasks();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, loadTasks]);

    return {
        tasks,
        setTasks,
        loading,
        reload: loadTasks,
    };
}