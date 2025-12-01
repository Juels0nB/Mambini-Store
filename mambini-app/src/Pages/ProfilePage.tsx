import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/userApi";
import { AiOutlineUser, AiOutlineShopping, AiOutlineLogout, AiOutlineSetting } from "react-icons/ai";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("info"); // 'info' ou 'orders'
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Cabeçalho do Perfil */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="bg-gray-900 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="relative flex items-end -mt-12 mb-4">
                            <div className="bg-white p-1 rounded-full">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-4 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                            <div className="ml-auto mb-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Botões de Ação Rápida */}
                        <div className="flex gap-3 mt-4 border-t pt-4">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'info' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <AiOutlineUser /> Dados Pessoais
                            </button>
                            <button
                                onClick={() => navigate("/orders")}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                <AiOutlineShopping /> Encomendas
                            </button>
                            {user.role === "admin" && (
                                <a href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 ml-auto">
                                    <AiOutlineSetting /> Painel Admin
                                </a>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 ml-2"
                            >
                                <AiOutlineLogout /> Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo das Abas */}
                <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[300px]">
                    {activeTab === "info" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Informação da Conta</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                                    <p className="mt-1 text-gray-900 font-medium border-b pb-2">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-gray-900 font-medium border-b pb-2">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">ID de Cliente</label>
                                    <p className="mt-1 text-gray-900 font-medium border-b pb-2 text-xs font-mono">#{Math.random().toString(36).substr(2, 9)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Membro Desde</label>
                                    <p className="mt-1 text-gray-900 font-medium border-b pb-2">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Encomendas</h3>
                            {/* Placeholder de encomendas */}
                            <div className="border rounded-lg p-8 text-center bg-gray-50">
                                <AiOutlineShopping className="mx-auto text-4xl text-gray-300 mb-2" />
                                <p className="text-gray-500">Ainda não fizeste nenhuma encomenda.</p>
                                <a href="/products" className="text-black font-semibold underline mt-2 inline-block">Começar a comprar</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}