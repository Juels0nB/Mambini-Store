import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
//import { AiOutlineHeart } from "react-icons/ai";
import feat1 from '../assets/feat-1.jpg';


// Tipos simples
interface Product {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    rating?: number;
    reviews?: number;
    description?: string;
    colors?: string[]; // hex ou nomes
    sizes?: string[]; // S, M, L...
    images?: string[]; // URLs ou imports
    category?: string;
}

interface DetailProps {
    onAddToCart?: (product: Product, color?: string, size?: string, qty?: number) => void;
}

export default function Detail({ onAddToCart }: DetailProps) {
    const { id } = useParams<{ id: string }>();

    // Estado do produto (no exemplo usamos mock)
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [qty, setQty] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | undefined>(undefined);

    // Simula fetch do produto
    useEffect(() => {

        const mock: Product = {
            id: id ?? "p1",
            name: "Jacket",
            price: 29.99,
            rating: 4.7,
            reviews: 117,
            description:
                "Warm and cozy jacket with front pocket. Made from soft cotton blend fabric.",
            //colors: ["#4B5563", "#1F2937", "#0F172A"], // para a M2
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: [feat1 ],
            category: "Jacket",
        };

        setProduct(mock);
        setSelectedColor(mock.colors?.[0]);
        setSelectedSize(mock.sizes?.[1]);
        setMainImage(mock.images?.[0]);
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
        // Validação simples
        if (!selectedSize) {
            alert("Seleciona um tamanho.");
            return;
        }

        // Chama o callback se existir
        onAddToCart?.(product, selectedColor, selectedSize, qty);

        // Mensagem
        alert(`${product.name} adicionado ao carrinho (${qty}x)`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-7xl mx-auto px-8 py-12">
                {/* Breadcumbs */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Home</Link> /{" "}
                    <Link to="/products" className="hover:underline">Products</Link> /{" "}
                    <span className="text-gray-700">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Imagem principal e thumbs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <img
                                src={mainImage}
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
                                        <img src={img} alt={`${product.name}-${idx}`} className="w-full h-full object-cover" />
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
                        </div>

                        <div className="flex items-center gap-3 text-sm text-yellow-500 mb-4">
                            <span>★ {product.rating?.toFixed(1)}</span>
                            <span className="text-gray-500">({product.reviews} reviews)</span>
                        </div>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        {/* Color selector  para a M2*/}
                        {/*
                        <div className="mb-6">
                            <div className="text-sm text-gray-600 mb-2">Color</div>
                            <div className="flex items-center gap-3">
                                {(product.colors ?? []).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? "border-gray-800" : "border-transparent"}`}
                                        style={{ background: c }}
                                        aria-label={`Select color ${c}`}
                                        type="button"
                                    />
                                ))}
                            </div>
                        </div>
                        */}

                        {/* Size selector */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600 mb-2">Size</div>
                                <div className="text-xs text-gray-400">Size guide</div>
                            </div>

                            <div className="flex items-center gap-3">
                                {(product.sizes ?? []).map((s) => (
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

                        {/* Quantity + Add to cart */}
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

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
                                    type="button"
                                >
                                    Add to cart
                                </button>

                                {/* adicionar a whislist - para a M2
                                <button className="p-3 border rounded-md text-gray-600" type="button" aria-label="Add to wishlist">
                                    <AiOutlineHeart size={20} />
                                </button>*/}
                            </div>
                        </div>

                        {/* Details / meta */}
                        <div className="mt-8 text-sm text-gray-600">
                            <h4 className="font-medium mb-2">Details</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Category: {product.category}</li>
                                <li>Available sizes: {product.sizes?.join(", ")}</li>
                                {/* <li>Available colors: {product.colors?.join(", ")}</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
