import api from "./axiosInstance";

export interface OrderItem {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
}

export interface ShippingInfo {
    address: string;
    city: string;
    postal_code: string;
    country: string;
    phone?: string;
}

export interface Order {
    id: string;
    user_id: string;
    user_email: string;
    user_name?: string;
    items: OrderItem[];
    total_amount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    shipping_address?: string;
    shipping_city?: string;
    shipping_postal_code?: string;
    shipping_country?: string;
    shipping_phone?: string;
    created_at: string;
    updated_at: string;
    notes?: string;
    payment_intent_id?: string;
    payment_status?: string;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    shipping: ShippingInfo;
    notes?: string;
    payment_intent_id?: string;
}

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
    const res = await api.post<Order>("/orders/", data);
    return res.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
    const res = await api.get<Order[]>("/orders/");
    return res.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
    const res = await api.get<Order[]>("/orders/all");
    return res.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
    const res = await api.put<Order>(`/orders/${id}/status`, { status });
    return res.data;
};

