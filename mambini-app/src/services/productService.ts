import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    type Product,
} from "../api/productApi";

export const fetchProducts = async () => await getProducts();
export const fetchProductById = async (id: string) => await getProductById(id);
export const addProduct = async (data: Product) => await createProduct(data);
export const editProduct = async (id: string, data: Product) => await updateProduct(id, data);
export const removeProduct = async (id: string) => await deleteProduct(id);
