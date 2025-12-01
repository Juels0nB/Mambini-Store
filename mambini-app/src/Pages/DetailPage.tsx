import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getProductById, type Product } from "../api/productApi"; // ✅ Usa apenas a interface central
import { useCart } from "../context/CartContext";

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [qty, setQty] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                // ✅ Usa a função centralizada do serviço
                const data = await getProductById(id);

                // Tratamento de imagens
                const imageUrls = (data.images ?? []).map((img: string | File) => {
                    if (typeof img !== 'string') return '';
                    return img.startsWith("http") ? img : `http://localhost:8000${img}`;
                });

                // Atualiza o produto com as URLs corrigidas
                const productWithImages = { ...data, images: imageUrls };

                setProduct(productWithImages);
                setMainImage(imageUrls[0]); // Define a primeira imagem como principal

                // Pré-selecionar o primeiro tamanho e cor se existirem
                if (data.sizes?.length) setSelectedSize(data.sizes[0]);
                if (data.colors?.length) setSelectedColor(data.colors[0]);

            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading || !product) return <p className="text-center py-20">A carregar produto...</p>;

    const handleAddToCart = () => {
        // Validação de Tamanho
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Por favor, seleciona um tamanho.");
            return;
        }

        // Validação de Cor (Opcional, mas boa prática)
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert("Por favor, seleciona uma cor.");
            return;
        }

        addToCart({
            id: product.id!,
            name: product.name,
            price: product.price,
            image: mainImage || "/placeholder.png",
            size: selectedSize || "Único",
            quantity: qty,
            color: selectedColor || "Padrão" // ✅ Agora usa a cor selecionada
        });

        alert("Produto adicionado ao carrinho!");
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
                    {/* Imagens */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <img
                                src={mainImage || "/placeholder.png"}
                                alt={product.name}
                                className="w-full h-[520px] object-cover rounded-md"
                            />
                            {/* Galeria de Miniaturas */}
                            <div className="flex gap-3 mt-4 overflow-x-auto">
                                {(product.images as string[]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 rounded-md overflow-hidden border shrink-0 ${mainImage === img ? "ring-2 ring-gray-800" : "border-gray-200"}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Info do Produto */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                        <div className="text-2xl font-bold text-gray-900 mb-4">€{product.price.toFixed(2)}</div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                            {product.description || "Sem descrição disponível."}
                        </p>

                        {/* ✅ SECÇÃO DE CORES (Reinserida) */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium mb-2 text-gray-700">Cor</h4>
                                <div className="flex gap-3">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedColor(c)}
                                            className={`px-4 py-2 border rounded-md transition ${
                                                selectedColor === c
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Secção de Tamanhos */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium text-gray-700">Tamanho</h4>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-4 py-2 border rounded-md min-w-[3rem] transition ${
                                                selectedSize === s
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantidade e Botão Adicionar */}
                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <span className="px-4 font-medium">{qty}</span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition shadow-sm"
                            >
                                Adicionar ao Carrinho
                            </button>
                        </div>

                        {/* Detalhes Extra */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="font-medium mb-2">Detalhes do Produto</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {product.category && <li>Categoria: {product.category}</li>}
                                {product.gender && <li>Género: {product.gender}</li>}
                                <li>Referência: {product.id}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}