import { useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { AiOutlinePlus, AiOutlineUnorderedList, AiOutlineDollar, AiOutlineSkin, AiOutlineUser } from "react-icons/ai";

export default function AdminDashboard() {
    const [view, setView] = useState<"list" | "form">("list");

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500">Gere os teus produtos e visualiza estatísticas.</p>
                    </div>

                    <button
                        onClick={() => setView(view === "list" ? "form" : "list")}
                        className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
                    >
                        {view === "list" ? <><AiOutlinePlus /> Adicionar Produto</> : <><AiOutlineUnorderedList /> Ver Lista</>}
                    </button>
                </div>

                {/* Estatísticas (Mock) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-2xl"><AiOutlineSkin /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Produtos</p>
                            <h3 className="text-2xl font-bold">124</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg text-2xl"><AiOutlineDollar /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Vendas Totais</p>
                            <h3 className="text-2xl font-bold">€12,450</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl"><AiOutlineUser /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Clientes</p>
                            <h3 className="text-2xl font-bold">1,203</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {view === "form" ? <ProductForm /> : <ProductList />}
                </div>
            </div>
        </div>
    );
}