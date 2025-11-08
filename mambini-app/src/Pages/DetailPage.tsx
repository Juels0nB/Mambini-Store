import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

interface Product {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    rating?: number;
    reviews?: number;
    description?: string;
    colors?: string[];
    sizes?: string[];
    images?: string[];
    category?: string;
}

interface DetailProps {
    onAddToCart?: (product: Product, color?: string, size?: string, qty?: number) => void;
}

export default function DetailPage({ onAddToCart }: DetailProps) {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [qty, setQty] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8000/products/${id}`);
                if (!res.ok) throw new Error("Produto não encontrado");

                const data = await res.json();

               const imageUrls = (data.images ?? []).map((img: string) =>
                    img.startsWith("http")
                        ? img
                        : `http://localhost:8000${img.replace(/^uploads[\\/]/, "")}`
                );

                const newProduct: Product = {
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    oldPrice: data.oldPrice,
                    rating: data.rating,
                    reviews: data.reviews,
                    description: data.description,
                    colors: data.colors,
                    sizes: data.sizes,
                    images: imageUrls,
                    category: data.category,
                };
                console.log("IMAGENS RECEBIDAS:", data.images);

                setProduct(newProduct);
                setMainImage(imageUrls[0]);
                setSelectedSize(data.sizes?.[0]);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-grow max-w-6xl mx-auto px-6 py-20">
                    <p>A carregar produto...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Seleciona um tamanho.");
            return;
        }

        onAddToCart?.(product, selectedColor, selectedSize, qty);
        alert(`${product.name} adicionado ao carrinho (${qty}x)`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-7xl mx-auto px-8 py-12">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Home</Link> /{" "}
                    <Link to="/products" className="hover:underline">Products</Link> /{" "}
                    <span className="text-gray-700">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Imagem principal + miniaturas */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <img
                                src={mainImage || "https://via.placeholder.com/500x600?text=No+Image"}
                                alt={product.name}
                                className="w-full h-[520px] object-cover rounded-md"
                            />

                            <div className="flex gap-3 mt-4">
                                {(product.images ?? []).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 rounded-md overflow-hidden border ${mainImage === img ? "ring-2 ring-gray-800" : "border-gray-200"}`}
                                        type="button"
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name}-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Informação do produto */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</div>
                            {product.oldPrice && (
                                <div className="text-gray-400 line-through">€{product.oldPrice.toFixed(2)}</div>
                            )}
                        </div>

                        {(product.rating || product.reviews) && (
                            <div className="flex items-center gap-3 text-sm text-yellow-500 mb-4">
                                {product.rating && <span>★ {product.rating.toFixed(1)}</span>}
                                {product.reviews && (
                                    <span className="text-gray-500">({product.reviews} reviews)</span>
                                )}
                            </div>
                        )}

                        <p className="text-gray-700 mb-6">
                            {product.description || "Sem descrição disponível."}
                        </p>

                        {/* Se tiver tamanhos */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600 mb-2">Size</div>
                                    <div className="text-xs text-gray-400">Size guide</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-3 py-1.5 border rounded ${selectedSize === s ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                                            type="button"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantidade + botão */}
                        <div className="mt-6 flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="px-3 py-1 border rounded"
                                    type="button"
                                >
                                    −
                                </button>
                                <div className="w-12 text-center">{qty}</div>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="px-3 py-1 border rounded"
                                    type="button"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
                                type="button"
                            >
                                Add to cart
                            </button>
                        </div>

                        {/* Detalhes */}
                        <div className="mt-8 text-sm text-gray-600">
                            <h4 className="font-medium mb-2">Details</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {product.category && <li>Category: {product.category}</li>}
                                {product.sizes && <li>Available sizes: {product.sizes.join(", ")}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
