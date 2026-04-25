import { createContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}