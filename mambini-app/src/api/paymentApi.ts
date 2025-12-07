import api from "./axiosInstance";

export interface PaymentIntentCreate {
    amount: number;
    currency?: string;
    order_id?: string;
}

export interface PaymentIntentResponse {
    client_secret: string;
    payment_intent_id: string;
}

export interface PaymentIntentStatus {
    id: string;
    status: string;
    amount: number;
    currency: string;
}

/**
 * Cria um PaymentIntent no Stripe
 */
export const createPaymentIntent = async (
    data: PaymentIntentCreate
): Promise<PaymentIntentResponse> => {
    const res = await api.post<PaymentIntentResponse>("/payment/create-intent", data);
    return res.data;
};

/**
 * Obtém o status de um PaymentIntent
 */
export const getPaymentIntentStatus = async (
    paymentIntentId: string
): Promise<PaymentIntentStatus> => {
    const res = await api.get<PaymentIntentStatus>(`/payment/intent/${paymentIntentId}`);
    return res.data;
};

