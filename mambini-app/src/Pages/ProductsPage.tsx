import { useState, useEffect } from "react";
import { fetchProducts } from "../services/productService";
import type {Product} from "../api/productApi";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sort, setSort] = useState("name");

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    }, []);

    const sortedProducts = [...products].sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price
    );

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <div className="text-gray-500">{products.length} products found</div>
                <div className="mt-3 md:mt-0">
                    <label className="mr-2 text-gray-600 font-medium">Sort by:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                </div>
            </div>

            <main className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </main>
        </div>
    );
}

export default ProductsPage;
