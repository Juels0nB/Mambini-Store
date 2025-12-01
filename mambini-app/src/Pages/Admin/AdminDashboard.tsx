import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import OrderList from "./OrderList";
import { AiOutlinePlus, AiOutlineUnorderedList, AiOutlineDollar, AiOutlineSkin, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { getProducts } from "../../api/productApi";
import { getAllOrders } from "../../api/orderApi";

type TabType = "products" | "orders";
type ProductViewType = "list" | "form";

interface DashboardStats {
    totalProducts: number;
    totalSales: number;
    totalCustomers: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("products");
    const [productView, setProductView] = useState<ProductViewType>("list");
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalSales: 0,
        totalCustomers: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoadingStats(true);
                
                // Carregar produtos e encomendas em paralelo
                const [products, orders] = await Promise.all([
                    getProducts(),
                    getAllOrders(),
                ]);

                // Calcular estatísticas
                const totalProducts = products.length;
                
                // Somar todas as vendas
                const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
                
                // Contar clientes únicos (user_id únicos)
                const uniqueCustomers = new Set(orders.map(order => order.user_id));
                const totalCustomers = uniqueCustomers.size;

                setStats({
                    totalProducts,
                    totalSales,
                    totalCustomers,
                });
            } catch (error: any) {
                console.error("Erro ao carregar estatísticas:", error);
                // Em caso de erro, manter valores em 0
            } finally {
                setLoadingStats(false);
            }
        };

        loadStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500">Gere os teus produtos e encomendas.</p>
                    </div>

                    {activeTab === "products" && (
                        <button
                            onClick={() => setProductView(productView === "list" ? "form" : "list")}
                            className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
                        >
                            {productView === "list" ? <><AiOutlinePlus /> Adicionar Produto</> : <><AiOutlineUnorderedList /> Ver Lista</>}
                        </button>
                    )}
                </div>

                {/* Menu de Navegação */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => {
                                setActiveTab("products");
                                setProductView("list");
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "products"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <AiOutlineSkin />
                                <span>Produtos</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "orders"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <AiOutlineShoppingCart />
                                <span>Encomendas</span>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-2xl"><AiOutlineSkin /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Produtos</p>
                            <h3 className="text-2xl font-bold">
                                {loadingStats ? (
                                    <span className="text-gray-400">...</span>
                                ) : (
                                    stats.totalProducts.toLocaleString("pt-PT")
                                )}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg text-2xl"><AiOutlineDollar /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Vendas Totais</p>
                            <h3 className="text-2xl font-bold">
                                {loadingStats ? (
                                    <span className="text-gray-400">...</span>
                                ) : (
                                    formatCurrency(stats.totalSales)
                                )}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-2xl"><AiOutlineUser /></div>
                        <div>
                            <p className="text-gray-500 text-sm">Clientes</p>
                            <h3 className="text-2xl font-bold">
                                {loadingStats ? (
                                    <span className="text-gray-400">...</span>
                                ) : (
                                    stats.totalCustomers.toLocaleString("pt-PT")
                                )}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {activeTab === "products" ? (
                        productView === "form" ? <ProductForm /> : <ProductList />
                    ) : (
                        <OrderList />
                    )}
                </div>
            </div>
        </div>
    );
}