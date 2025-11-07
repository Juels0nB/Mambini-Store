import { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

export default function Profile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        getProfile(token)
            .then(setUser)
            .catch(() => {
                window.location.href = "/login";
            });
    }, []);

    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem("token"); // remove o token
        window.location.href = "/login"; // redireciona para login
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Welcome, {user.name}
                </h2>
                <p className="text-gray-600 mb-1">Email: {user.email}</p>
                <p className="text-gray-600 mb-4">Role: {user.role}</p>

                {user.role === "admin" && (
                    <a
                        href="/admin"
                        className="text-blue-600 underline block mb-4"
                    >
                        Go to Admin Panel
                    </a>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
