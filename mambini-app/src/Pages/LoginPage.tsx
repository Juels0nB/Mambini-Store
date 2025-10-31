import { useState } from "react";
import { loginUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem("token", data.access_token);
            window.location.href = "/profile";
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
                <h2 className="text-2xl font-bold">Login</h2>
                <input type="email" placeholder="Email" className="border p-2 rounded"
                       value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="border p-2 rounded"
                       value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-black text-white py-2 rounded">Login</button>
                <p className="text-sm mt-4 text-center">
                    No account?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}
