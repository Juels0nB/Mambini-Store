import { useState } from "react";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, password });
            alert("Account created!");
            window.location.href = "/login";
        } catch {
            alert("Error registering");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
                <h2 className="text-2xl font-bold">Register</h2>
                <input type="text" placeholder="Name" className="border p-2 rounded"
                       value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" className="border p-2 rounded"
                       value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="border p-2 rounded"
                       value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-black text-white py-2 rounded">Register</button>
                <p className="text-sm mt-4 text-center">
                    Already have an account?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
