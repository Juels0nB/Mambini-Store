import { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

export default function Profile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return; // <-- só retorna vazio
        }

        getProfile(token)
            .then(setUser)
            .catch(() => {
                window.location.href = "/login";
            });
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {user.role === "admin" && (
                <a href="/admin" className="text-blue-600 underline">Go to Admin Panel</a>
            )}
        </div>
    );
}
