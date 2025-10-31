import api from "./axiosInstance";

export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sizes: string[];
    available_sizes: string[];
    gender: string;
    category: string;
    colors: string[];
    available_colors: string[];
    images: string[];
    created_at?: string;
}

export const getProducts = async (): Promise<Product[]> => {
    const res = await api.get<Product[]>("/products/");
    return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
};

export const createProduct = async (data: Product): Promise<Product> => {
    const res = await api.post<Product>("/products/", data);
    return res.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await api.put<Product>(`/products/${id}`, data);
    return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
};
