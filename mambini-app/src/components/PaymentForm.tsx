import { useState, FormEvent } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
    clientSecret: string;
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
    isLoading: boolean;
}

export default function PaymentForm({
    clientSecret,
    onSuccess,
    onError,
    isLoading
}: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders`,
                },
                redirect: "if_required", // Não redireciona automaticamente
            });

            if (error) {
                onError(error.message || "Erro ao processar pagamento");
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                onSuccess(paymentIntent.id);
            } else {
                onError("Status de pagamento inesperado");
                setIsProcessing(false);
            }
        } catch (err: any) {
            onError(err.message || "Erro inesperado ao processar pagamento");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement 
                options={{
                    layout: "tabs",
                }}
            />
            
            <button
                type="submit"
                disabled={!stripe || isProcessing || isLoading}
                className="w-full py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing || isLoading
                    ? "A processar pagamento..."
                    : `Pagar agora`}
            </button>
        </form>
    );
}

