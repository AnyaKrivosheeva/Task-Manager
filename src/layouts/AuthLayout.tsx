import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "400px",
                margin: "0 auto",
            }}
        >
            <Outlet />
        </div>
    );
}