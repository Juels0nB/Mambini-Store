import { useState } from "react";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Portugal");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser({
                name,
                email,
                password,
                address: address || undefined,
                city: city || undefined,
                postal_code: postalCode || undefined,
                country: country || undefined,
                phone: phone || undefined,
            });
            alert("Account created!");
            window.location.href = "/login";
        } catch {
            alert("Error registering");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md px-4">
                <h2 className="text-2xl font-bold mb-2">Register</h2>
                
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Name *"
                        className="border p-2 rounded w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email *"
                        className="border p-2 rounded w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password *"
                        className="border p-2 rounded w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <div className="border-t pt-3 mt-3">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">Informações de Entrega</h3>
                        <input
                            type="text"
                            placeholder="Morada"
                            className="border p-2 rounded w-full mb-3"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Cidade"
                                className="border p-2 rounded w-full"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Código Postal"
                                className="border p-2 rounded w-full"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <input
                                type="text"
                                placeholder="País"
                                className="border p-2 rounded w-full"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Telefone"
                                className="border p-2 rounded w-full"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <button className="bg-black text-white py-2 rounded mt-4">Register</button>
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
