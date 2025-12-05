import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, type ShippingInfo } from "../api/orderApi";

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shipping, setShipping] = useState<ShippingInfo>({
        address: "",
        city: "",
        postal_code: "",
        country: "Portugal",
        phone: "",
    });
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        setLoading(true);

        try {
            // Converter itens do carrinho para formato da API
            const orderItems = cart.map((item) => ({
                product_id: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image,
            }));

            const order = await createOrder({
                items: orderItems,
                shipping,
                notes: notes || undefined,
            });

            // Limpar carrinho após sucesso
            clearCart();

            // Redirecionar para página de sucesso ou histórico
            navigate(`/orders/${order.id}`, { 
                state: { message: "Pedido criado com sucesso!" } 
            });
        } catch (error: any) {
            console.error("Erro ao criar pedido:", error);
            alert(
                error.response?.data?.detail || 
                "Erro ao finalizar compra. Tenta novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Entrega */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Morada *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={shipping.address}
                                        onChange={(e) =>
                                            setShipping({ ...shipping, address: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Rua, número, andar"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Cidade *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shipping.city}
                                            onChange={(e) =>
                                                setShipping({ ...shipping, city: e.target.value })
                                            }
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shipping.postal_code}
                                            onChange={(e) =>
                                                setShipping({
                                                    ...shipping,
                                                    postal_code: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="1234-567"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            País *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shipping.country}
                                            onChange={(e) =>
                                                setShipping({ ...shipping, country: e.target.value })
                                            }
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={shipping.phone}
                                            onChange={(e) =>
                                                setShipping({ ...shipping, phone: e.target.value })
                                            }
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="+351 912 345 678"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Notas (opcional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        rows={3}
                                        placeholder="Instruções especiais de entrega..."
                                    />
                                </div>
                            </div>
                            {/*Botão submeter formulário*/}
                            <button
                                type="submit"
                                disabled={loading || cart.length === 0}
                                className="w-full mt-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "A processar..." : "Confirmar Pedido"}
                            </button>

                        </form>
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

                            <div className="space-y-2 mb-4">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                                        <span>
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>€{total.toFixed(2)}</span>
                                </div>
                            </div>


                            <button
                                onClick={() => navigate("/cart")}
                                className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800"
                            >
                                ← Voltar ao carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

