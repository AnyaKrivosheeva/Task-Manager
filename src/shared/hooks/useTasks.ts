import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import type { Task } from "../../types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("order", { ascending: true });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        setTasks(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session?.user) {
                    setTasks([]);
                    return;
                }

                loadTasks();
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("tasks-global")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tasks",
                },
                (payload) => {
                    console.log("REALTIME EVENT:", payload);
                    loadTasks();
                }
            )
            .subscribe((status) => {
                console.log("REALTIME STATUS:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return {
        tasks,
        setTasks,
        loading,
        reload: loadTasks,
    };
}