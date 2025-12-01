import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from '../assets/hero.jpg';
import { fetchProducts } from "../services/productService"; // ou "../api/productApi"
import type { Product } from "../api/productApi";

export default function HomePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper para formatar a imagem corretamente
    const getImageUrl = (images: (string | File)[]) => {
        if (!images || images.length === 0) return "/placeholder.png";

        const img = images[0];
        if (typeof img === 'string') {
            return img.startsWith("http") ? img : `http://localhost:8000${img}`;
        }
        return "/placeholder.png";
    };

    // Lógica simples para separar categorias (Podes ajustar conforme a necessidade)
    // Featured: Os primeiros 4 produtos
    const featuredProducts = products.slice(0, 4);

    // New Arrivals: Os últimos 4 produtos (assumindo que novos entram no fim da lista)
    const newArrivals = products.slice(-4).reverse();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex flex-col w-full min-h-screen bg-white">
            {/* Hero Section - Mantém-se estático pois é marketing */}
            <section
                className="relative w-full h-[500px] bg-cover bg-center flex items-center justify-start px-6 md:px-20"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="bg-black/40 absolute inset-0" />
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        New Season Arrivals
                    </h1>
                    <p className="text-gray-200 mb-6">
                        Discover the latest trends and styles for this season. Shop our new collection now.
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                    >
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Featured Products Dinâmicos */}
            <section className="py-16 px-6 md:px-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Featured Products</h2>
                    <button
                        onClick={() => navigate("/products")}
                        className="border border-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        View All Products
                    </button>
                </div>

                {featuredProducts.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer group"
                                onClick={() => navigate(`/detail/${product.id}`)}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={getImageUrl(product.images as string[])}
                                        alt={product.name}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">€{product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* New Arrivals Dinâmicos */}
            <section className="py-16 px-6 md:px-20 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">New Arrivals</h2>
                    <button
                        onClick={() => navigate("/products")}
                        className="border border-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        View More Arrivals
                    </button>
                </div>

                {newArrivals.length === 0 ? (
                    <p>No new arrivals yet.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer group"
                                onClick={() => navigate(`/detail/${product.id}`)}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={getImageUrl(product.images as string[])}
                                        alt={product.name}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">€{product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}