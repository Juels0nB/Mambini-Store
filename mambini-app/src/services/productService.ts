import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    type Product,
} from "../api/productApi";

export const fetchProducts = async () => {
    return await getProducts();
};

export const fetchProductById = async (id: string) => {
    return await getProductById(id);
};

export const addProduct = async (data: Product) => {
    return await createProduct(data);
};

export const editProduct = async (id: string, data: Product) => {
    return await updateProduct(id, data);
};

export const removeProduct = async (id: string) => {
    return await deleteProduct(id);
};
