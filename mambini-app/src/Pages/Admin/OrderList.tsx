import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, type Order } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";

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

const statusOptions = [
    { value: "pending", label: "Pendente" },
    { value: "processing", label: "Em Processamento" },
    { value: "shipped", label: "Enviado" },
    { value: "delivered", label: "Entregue" },
    { value: "cancelled", label: "Cancelado" },
];

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadOrders = async () => {
        try {
            const data = await getAllOrders();
            // Ordenar por data mais recente primeiro
            const sorted = data.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setOrders(sorted);
        } catch (err: any) {
            console.error("Erro ao carregar encomendas:", err);
            alert("Erro ao carregar encomendas: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (!window.confirm(`Tens a certeza que queres alterar o status para "${statusLabels[newStatus]}"?`)) {
            return;
        }

        setUpdatingStatus(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            // Atualizar a lista local
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus as any } : order
            ));
        } catch (err: any) {
            console.error("Erro ao atualizar status:", err);
            alert("Erro ao atualizar status: " + (err.response?.data?.detail || err.message));
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return `€${amount.toFixed(2)}`;
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">A carregar encomendas...</div>;
    }

    return (
        <div className="p-0">
            {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Nenhuma encomenda encontrada.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    ID / Data
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Itens
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {formatDate(order.created_at)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">
                                                {order.user_name || "Cliente"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {order.user_email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {order.items.slice(0, 2).map(item => item.product_name).join(", ")}
                                            {order.items.length > 2 && "..."}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            disabled={updatingStatus === order.id}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                                statusColors[order.status] || statusColors.pending
                                            } ${updatingStatus === order.id ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
                                        >
                                            {statusOptions.map((option) => (
                                                <option 
                                                    key={option.value} 
                                                    value={option.value}
                                                    className="bg-white text-gray-900"
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            title="Ver detalhes"
                                        >
                                            <AiOutlineEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

