import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import type {Product} from "../api/productApi";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sort, setSort] = useState("name");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    useEffect(() => {
        setLoading(true);
        fetchProducts(searchQuery || undefined)
            .then(setProducts)
            .catch((error) => console.error("Erro ao carregar produtos:", error))
            .finally(() => setLoading(false));
    }, [searchQuery]);

    const sortedProducts = [...products].sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center py-20">A carregar produtos...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />
            <main className="flex-grow px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {searchQuery ? `Resultados da pesquisa: "${searchQuery}"` : "Products"}
                        </h1>
                        {searchQuery && (
                            <p className="text-sm text-gray-600 mt-1">
                                {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 mt-3 md:mt-0">
                        {!searchQuery && `${products.length} products found`}
                    </div>
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

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">
                            {searchQuery 
                                ? `Nenhum produto encontrado para "${searchQuery}"` 
                                : "Nenhum produto disponível"}
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default ProductsPage;
