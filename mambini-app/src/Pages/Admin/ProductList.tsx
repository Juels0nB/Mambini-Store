import { useEffect, useState } from "react";
import { fetchProducts, removeProduct } from "../../services/productService";
import type { Product } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            alert("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tens a certeza que queres apagar este produto?")) {
            try {
                await removeProduct(id);
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                alert("Erro ao apagar produto.");
            }
        }
    };

    // Helper para imagem - usa visible_images se disponível
    const getThumb = (product: Product) => {
        // Usar visible_images se disponível, senão usar images
        const imagesToUse = (product.visible_images && product.visible_images.length > 0) 
            ? product.visible_images 
            : product.images;
        
        if(!imagesToUse || imagesToUse.length === 0) return "/placeholder.png";
        
        const img = imagesToUse[0];
        
        if (typeof img === 'string') {
            // URLs do Cloudinary já vêm completas (https://res.cloudinary.com/...)
            if (img.startsWith('http://') || img.startsWith('https://')) {
                return img;
            }
            // URL relativa - adicionar localhost
            return `http://localhost:8000${img}`;
        }
        
        // Se for File, criar URL temporária
        return URL.createObjectURL(img);
    }

    useEffect(() => { loadProducts(); }, []);

    if (loading) return <div className="p-8 text-center">A carregar produtos...</div>;

    return (
        <div className="p-0">
            {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Nenhum produto encontrado.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantidade</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img 
                                                className="h-10 w-10 rounded-full object-cover border" 
                                                src={getThumb(product)} 
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder.png";
                                                    e.currentTarget.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    €{product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stock > 0 ? `${product.stock} un.` : 'Sem Quantidade'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => navigate(`/admin/product/${product.id}/edit`)} className="text-blue-600 hover:text-blue-900 mr-4">
                                        <AiOutlineEdit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id!)} className="text-red-600 hover:text-red-900">
                                        <AiOutlineDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}