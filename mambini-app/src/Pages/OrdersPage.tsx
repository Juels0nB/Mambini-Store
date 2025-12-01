import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, type Order } from "../api/orderApi";

const statusLabels: Record<string, string> = {
    pending: "Pendente",
    processing: "Em Processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Erro ao carregar pedidos:", error);
                alert("Erro ao carregar pedidos. Tenta novamente.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>A carregar pedidos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500 mb-4">Ainda não tens pedidos.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="text-blue-600 underline"
                        >
                            Ver produtos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Pedido #{order.id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}
                                    >
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {order.items.length} item(s)
                                            </p>
                                            {order.shipping_city && (
                                                <p className="text-sm text-gray-500">
                                                    📍 {order.shipping_city}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-xl font-bold">
                                            €{order.total_amount.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 text-sm text-gray-600"
                                            >
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.product_name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <span>
                                                    {item.product_name} x{item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span className="text-sm text-gray-500">
                                                +{order.items.length - 3} mais
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

