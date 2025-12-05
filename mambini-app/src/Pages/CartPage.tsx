// src/Pages/CartPage.tsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Precisas de fazer login para finalizar a compra!");
            navigate("/login");
            return;
        }

        // Lógica de sucesso (futuramente podes criar uma API de encomendas aqui)
        alert("Compra finalizada com sucesso! (Simulação)");
        // clearCart(); // Se quiseres limpar o carrinho após compra
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
                <h1 className="text-3xl font-bold mb-10">Carrinho de Compras</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">O teu carrinho está vazio.</p>
                        <button onClick={() => navigate("/products")} className="text-blue-600 underline">
                            Voltar à loja
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Lista de produtos dinâmica */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 border-b pb-4">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />

                                    <div className="flex-1">
                                        <h2 className="font-medium">{item.name}</h2>
                                        <p className="text-sm text-gray-500">
                                            Tamanho: {item.size} {item.color && `| Cor: ${item.color}`}
                                        </p>
                                        <p className="font-semibold mt-1">€{item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                try {
                                                    updateQuantity(item.id, item.size, -1);
                                                } catch (error) {
                                                    alert(error instanceof Error ? error.message : "Erro ao atualizar quantidade");
                                                }
                                            }}
                                            className="px-2 border rounded hover:bg-gray-100"
                                        >−</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => {
                                                try {
                                                    updateQuantity(item.id, item.size, 1);
                                                } catch (error) {
                                                    alert(error instanceof Error ? error.message : "Erro ao atualizar quantidade");
                                                }
                                            }}
                                            className="px-2 border rounded hover:bg-gray-100"
                                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                                        >+</button>
                                    </div>
                                    {item.stock !== undefined && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Stock: {item.stock}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-red-500 ml-4 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Resumo e Checkout */}
                        <div className="p-8 border rounded-lg bg-white h-fit shadow-sm">
                            <h3 className="text-2xl font-semibold mb-3">Resumo</h3>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Itens:</span>
                                <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2 text-lg">
                                <span>Total:</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => {
                                    const token = localStorage.getItem("token");
                                    if (!token) {
                                        alert("Precisas de fazer login para finalizar a compra!");
                                        navigate("/login");
                                        return;
                                    }
                                    navigate("/checkout");
                                }}
                                className="w-full mt-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CartPage;