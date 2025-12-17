import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, type ShippingInfo } from "../api/orderApi";
import { createPaymentIntent } from "../api/paymentApi";
import PaymentForm from "../components/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../config/stripe";

const steps = [
    { id: 1, label: "Entrega" },
    { id: 2, label: "Pagamento" },
    { id: 3, label: "Confirmação" },
];

function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
    // currentStep: 1 = Entrega, 2 = Pagamento (Confirmação acontece após sucesso)
    return (
        <ol className="flex items-center gap-4 text-sm mb-6" aria-label="Progresso da encomenda">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isFuture = step.id > currentStep;

                const baseClasses =
                    "flex items-center gap-2 rounded-full px-3 py-1 border";

                const stateClasses = isCompleted
                    ? "bg-green-100 border-green-300 text-green-800"
                    : isActive
                    ? "bg-black text-white border-black"
                    : "bg-gray-100 border-gray-300 text-gray-500";

                return (
                    <li key={step.id} className="flex items-center gap-2">
                        <span className={`${baseClasses} ${stateClasses}`}>
                            <span className="font-semibold">
                                {step.id}.
                            </span>
                            <span>{step.label}</span>
                        </span>
                        {index < steps.length - 1 && (
                            <span className="h-px w-6 bg-gray-300" aria-hidden="true" />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

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
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        // Validar campos obrigatórios
        if (!shipping.address || !shipping.city || !shipping.postal_code || !shipping.country) {
            alert("Por favor, preenche todos os campos obrigatórios de entrega.");
            return;
        }

        setLoading(true);
        setPaymentError(null);

        try {
            // Criar PaymentIntent antes de mostrar o formulário de pagamento
            const paymentResponse = await createPaymentIntent({
                amount: total,
                currency: "eur",
            });

            setClientSecret(paymentResponse.client_secret);
            setPaymentIntentId(paymentResponse.payment_intent_id);
            setShowPayment(true);
        } catch (error: any) {
            console.error("Erro ao criar pagamento:", error);
            setPaymentError(
                error.response?.data?.detail || 
                "Erro ao iniciar pagamento. Tenta novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        setLoading(true);
        setPaymentError(null);

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

            // Criar pedido com o payment_intent_id
            const order = await createOrder({
                items: orderItems,
                shipping,
                notes: notes || undefined,
                payment_intent_id: paymentIntentId,
            });

            // Limpar carrinho após sucesso
            clearCart();

            // Redirecionar para página de sucesso
            navigate(`/orders/${order.id}`, { 
                state: { message: "Pedido criado com sucesso!" } 
            });
        } catch (error: any) {
            console.error("Erro ao criar pedido:", error);
            setPaymentError(
                error.response?.data?.detail || 
                "Erro ao finalizar pedido. Tenta novamente."
            );
            setLoading(false);
        }
    };

    const handlePaymentError = (error: string) => {
        setPaymentError(error);
        setLoading(false);
    };

    // Se já temos o client_secret, mostrar o formulário de pagamento
    if (showPayment && clientSecret) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Pagamento</h1>
                    <StepIndicator currentStep={2} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulário de Pagamento */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>
                                
                                {paymentError && (
                                    <div
                                        className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
                                        role="alert"
                                    >
                                        <p className="font-semibold mb-1">
                                            Ocorreu um problema ao processar o pagamento.
                                        </p>
                                        <p>{paymentError}</p>
                                    </div>
                                )}

                                <Elements 
                                    stripe={stripePromise} 
                                    options={{ clientSecret }}
                                >
                                    <PaymentForm
                                        clientSecret={clientSecret}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        isLoading={loading}
                                    />
                                </Elements>

                                <button
                                    onClick={() => {
                                        setShowPayment(false);
                                        setClientSecret(null);
                                        setPaymentIntentId(null);
                                        setPaymentError(null);
                                    }}
                                    className="mt-4 text-gray-600 hover:text-gray-800"
                                >
                                    ← Voltar para informações de entrega
                                </button>
                            </div>
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

                                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                                    <p className="font-medium mb-2">Entrega:</p>
                                    <p>{shipping.address}</p>
                                    <p>{shipping.postal_code} {shipping.city}</p>
                                    <p>{shipping.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulário de entrega (passo inicial)
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
                <StepIndicator currentStep={1} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Entrega */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleShippingSubmit} className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>

                            {paymentError && (
                                <div
                                    className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
                                    role="alert"
                                >
                                    <p className="font-semibold mb-1">
                                        Não foi possível iniciar o pagamento.
                                    </p>
                                    <p>{paymentError}</p>
                                </div>
                            )}

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
                                onClick={handleShippingSubmit}
                                disabled={loading || cart.length === 0}
                                className="w-full mt-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "A processar..." : "Continuar para Pagamento"}
                            </button>

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
