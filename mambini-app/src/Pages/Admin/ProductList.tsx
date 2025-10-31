import { useEffect, useState } from "react";
import { fetchProducts, removeProduct } from "../../services/productService";
import type {Product} from "../../api/productApi";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
            alert("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tens a certeza que queres apagar este produto?")) {
            try {
                await removeProduct(id);
                alert("Produto apagado com sucesso!");
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                console.error(err);
                alert("Erro ao apagar produto.");
            }
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    if (loading) return <p className="p-4">A carregar produtos...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lista de Produtos</h2>

            </div>

            {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded shadow">
                        <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border-b">Nome</th>
                            <th className="p-3 border-b">Preço (€)</th>
                            <th className="p-3 border-b">Categoria</th>
                            <th className="p-3 border-b">Stock</th>
                            <th className="p-3 border-b">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{product.name}</td>
                                <td className="p-3 border-b">{product.price.toFixed(2)}</td>
                                <td className="p-3 border-b">{product.category || "-"}</td>
                                <td className="p-3 border-b">{product.stock}</td>
                                <td className="p-3 border-b space-x-2">
                                    <button
                                        onClick={() => navigate(`/admin/product/${product.id}/edit`)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id!)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Apagar
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
