import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}