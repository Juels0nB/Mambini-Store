import { useEffect, useState } from "react";
import { addProduct, editProduct, fetchProductById } from "../../services/productService";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../api/productApi";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<Product>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        sizes: [],
        available_sizes: [],
        gender: "",
        category: "",
        colors: [],
        available_colors: [],
        images: [],
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductById(id).then((data) => setForm(data));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleArrayChange = (name: keyof Product, value: string) => {
        const items = value.split(",").map((item) => item.trim());
        setForm({ ...form, [name]: items });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) await editProduct(id, form);
            else await addProduct(form);
            window.location.href = "/admin"; // Força refresh para voltar à lista
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar produto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b text-gray-800">
                {id ? "Editar Produto" : "Criar Novo Produto"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Informação Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (€)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock (Unidades)</label>
                        <input
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>
                </div>

                <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Ex: T-Shirts"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="male">Homem</option>
                            <option value="female">Mulher</option>
                            <option value="unisex">Unisexo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tamanhos (separados por vírgula)</label>
                        <input
                            value={form.sizes.join(", ")}
                            onChange={(e) => handleArrayChange("sizes", e.target.value)}
                            placeholder="Ex: S, M, L, XL"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tamanhos Disponíveis</label>
                        <input
                            value={form.available_sizes.join(", ")}
                            onChange={(e) => handleArrayChange("available_sizes", e.target.value)}
                            placeholder="Ex: S, M"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cores</label>
                        <input
                            value={form.colors.join(", ")}
                            onChange={(e) => handleArrayChange("colors", e.target.value)}
                            placeholder="Ex: Red, Blue"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        />
                    </div>
                </div>

                {/* Imagens */}
                <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagens do Produto</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para fazer upload</span></p>
                                <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setForm({ ...form, images: Array.from(e.target.files) });
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {/* Preview (Texto simples por agora) */}
                    {form.images.length > 0 && (
                        <p className="mt-2 text-sm text-green-600">{form.images.length} ficheiro(s) selecionado(s)</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-8 py-2.5 rounded-lg hover:bg-gray-800 font-medium transition disabled:opacity-50"
                    >
                        {loading ? "A guardar..." : "Guardar Produto"}
                    </button>
                </div>
            </form>
        </div>
    );
}