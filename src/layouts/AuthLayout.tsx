import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "500px",
                margin: "0 auto",
            }}
        >
            <Outlet />
        </div>
    );
}