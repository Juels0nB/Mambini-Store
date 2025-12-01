import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getOrderById, type Order } from "../api/orderApi";

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

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.message) {
            alert(location.state.message);
        }
    }, [location]);

    useEffect(() => {
        const loadOrder = async () => {
            if (!id) return;

            try {
                const data = await getOrderById(id);
                setOrder(data);
            } catch (error: any) {
                console.error("Erro ao carregar pedido:", error);
                alert(
                    error.response?.data?.detail || "Erro ao carregar pedido. Tenta novamente."
                );
                navigate("/orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id, navigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>A carregar pedido...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Pedido não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={() => navigate("/orders")}
                    className="text-blue-600 mb-4 hover:underline"
                >
                    ← Voltar aos pedidos
                </button>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Pedido #{order.id.slice(-8).toUpperCase()}
                            </h1>
                            <p className="text-gray-500">
                                Criado em {formatDate(order.created_at)}
                            </p>
                            {order.updated_at !== order.created_at && (
                                <p className="text-sm text-gray-400">
                                    Atualizado em {formatDate(order.updated_at)}
                                </p>
                            )}
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}
                        >
                            {statusLabels[order.status] || order.status}
                        </span>
                    </div>

                    <div className="border-t pt-4">
                        <h2 className="font-semibold mb-4">Itens do Pedido</h2>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 border-b pb-4 last:border-0"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Quantidade: {item.quantity}
                                            {item.size && ` | Tamanho: ${item.size}`}
                                            {item.color && ` | Cor: ${item.color}`}
                                        </p>
                                        <p className="font-semibold mt-1">
                                            €{item.price.toFixed(2)} cada
                                        </p>
                                    </div>
                                    <p className="font-bold">
                                        €{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span>€{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informações de Entrega */}
                {(order.shipping_address ||
                    order.shipping_city ||
                    order.shipping_postal_code ||
                    order.shipping_country) && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="font-semibold mb-4">Informações de Entrega</h2>
                        <div className="space-y-2 text-gray-700">
                            {order.shipping_address && <p>{order.shipping_address}</p>}
                            <p>
                                {order.shipping_postal_code && `${order.shipping_postal_code} `}
                                {order.shipping_city}
                                {order.shipping_country && `, ${order.shipping_country}`}
                            </p>
                            {order.shipping_phone && <p>📞 {order.shipping_phone}</p>}
                        </div>
                    </div>
                )}

                {/* Notas */}
                {order.notes && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-2">Notas</h2>
                        <p className="text-gray-700">{order.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

