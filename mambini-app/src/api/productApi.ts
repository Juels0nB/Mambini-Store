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
    images: (File | string)[];
    visible_images?: string[];
    created_at?: string;
}

export const getProducts = async (searchQuery?: string): Promise<Product[]> => {
    const params = searchQuery ? { q: searchQuery } : {};
    const res = await api.get<Product[]>("/products/", { params });
    return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
};

/** Criação do produto */
export const createProduct = async (data: Product): Promise<any> => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("gender", data.gender);
    formData.append("category", data.category);
    formData.append("sizes", data.sizes.join(","));
    formData.append("available_sizes", data.available_sizes.join(","));
    formData.append("colors", data.colors.join(","));
    formData.append("available_colors", data.available_colors.join(","));

    // Adiciona arquivos se existirem
    data.images?.forEach((img) => {
        if (img instanceof File) {
            formData.append("files", img);
        }
    });

    const res = await api.post("/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/** Editar produto */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<any> => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.stock !== undefined) formData.append("stock", String(data.stock));
    if (data.gender) formData.append("gender", data.gender);
    if (data.category) formData.append("category", data.category);
    if (data.sizes) formData.append("sizes", data.sizes.join(","));
    if (data.available_sizes)
        formData.append("available_sizes", data.available_sizes.join(","));
    if (data.colors) formData.append("colors", data.colors.join(","));
    if (data.available_colors)
        formData.append("available_colors", data.available_colors.join(","));

    data.images?.forEach((img) => {
        if (img instanceof File) {
            formData.append("files", img);
        }
    });

    const res = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
};

/** Deletar uma imagem específica do produto */
export const deleteProductImage = async (productId: string, imageUrl: string): Promise<any> => {
    const encodedUrl = encodeURIComponent(imageUrl);
    const res = await api.delete(`/products/${productId}/images/${encodedUrl}`);
    return res.data;
};

/** Atualizar quais imagens são visíveis na loja */
export const updateVisibleImages = async (productId: string, visibleImages: string[]): Promise<any> => {
    const res = await api.put(`/products/${productId}/visible-images`, {
        visible_images: visibleImages
    });
    return res.data;
};
