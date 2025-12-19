import { useEffect, useState } from "react";
import { addProduct, editProduct, fetchProductById } from "../../services/productService";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../../api/productApi";
import { deleteProductImage, updateVisibleImages } from "../../api/productApi";

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
        visible_images: [],
    });

    const [loading, setLoading] = useState(false);
    const [newImages, setNewImages] = useState<File[]>([]);

    useEffect(() => {
        if (id) {
            fetchProductById(id).then((data) => {
                // Inicializar visible_images se não existir - usar todas as imagens como visíveis por padrão
                const stringImages = data.images?.filter((img): img is string => typeof img === 'string') || [];
                const visibleImages = data.visible_images && data.visible_images.length > 0 
                    ? data.visible_images 
                    : stringImages;
                
                setForm({ 
                    ...data, 
                    visible_images: visibleImages 
                });
            });
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

    const handleDeleteImage = async (imageUrl: string) => {
        if (!id) return;
        if (!window.confirm("Tens a certeza que queres apagar esta imagem?")) return;
        
        try {
            await deleteProductImage(id, imageUrl);
            // Atualizar form removendo a imagem
            const updatedImages = form.images.filter(img => img !== imageUrl);
            const updatedVisible = (form.visible_images || []).filter(img => img !== imageUrl);
            setForm({ ...form, images: updatedImages, visible_images: updatedVisible });
            alert("Imagem apagada com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao apagar imagem.");
        }
    };

    const handleToggleVisible = async (imageUrl: string) => {
        if (!id) {
            // Se não tem ID (criando novo produto), apenas atualizar localmente
            const currentVisible = form.visible_images || [];
            const isVisible = currentVisible.includes(imageUrl);
            const newVisible = isVisible
                ? currentVisible.filter(img => img !== imageUrl)
                : [...currentVisible, imageUrl];
            setForm({ ...form, visible_images: newVisible });
            return;
        }

        const currentVisible = form.visible_images || [];
        const isVisible = currentVisible.includes(imageUrl);
        const newVisible = isVisible
            ? currentVisible.filter(img => img !== imageUrl)
            : [...currentVisible, imageUrl];
        
        // Atualizar localmente primeiro para feedback imediato
        setForm({ ...form, visible_images: newVisible });
        
        // Atualizar no servidor
        try {
            const result = await updateVisibleImages(id, newVisible);
            // Atualizar com os dados retornados do servidor para garantir sincronização
            if (result && result.visible_images) {
                setForm({ ...form, visible_images: result.visible_images });
            }
        } catch (err) {
            console.error("Erro ao atualizar imagens visíveis:", err);
            alert("Erro ao atualizar imagens visíveis. Tenta novamente.");
            // Reverter em caso de erro
            setForm({ ...form, visible_images: currentVisible });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                // Editar produto existente
                const formWithNewImages = {
                    ...form,
                    images: [...form.images, ...newImages]
                };
                await editProduct(id, formWithNewImages);
                // Atualizar imagens visíveis se necessário
                if (form.visible_images) {
                    await updateVisibleImages(id, form.visible_images);
                }
            } else {
                // Criar novo produto - novas imagens serão enviadas
                await addProduct({
                    ...form,
                    images: newImages, // Apenas novas imagens para criação
                    visible_images: [] // Será definido pelo backend
                });
            }
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (Unidades)</label>
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
                    
                    {/* Imagens Existentes */}
                    {form.images && form.images.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">Imagens existentes:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {form.images
                                    .filter((img): img is string => typeof img === 'string')
                                    .map((img, index) => {
                                        // URLs do Cloudinary já vêm completas (https://res.cloudinary.com/...)
                                        // Apenas adicionar localhost se for uma URL relativa
                                        let imageUrl = img;
                                        if (!img.startsWith('http://') && !img.startsWith('https://')) {
                                            imageUrl = `http://localhost:8000${img}`;
                                        }
                                        
                                        // Debug: log da URL
                                        if (index === 0) {
                                            console.log("Primeira imagem - Original:", img, "URL formatada:", imageUrl);
                                        }
                                        
                                        // Comparar usando a string original do banco (img)
                                        const isVisible = form.visible_images?.includes(img) || false;
                                        
                                        return (
                                            <div key={index} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={`Imagem ${index + 1}`}
                                                    className="w-full h-32 object-cover"
                                                    onError={(e) => {
                                                        console.error("Erro ao carregar imagem:", imageUrl, "Original:", img);
                                                        e.currentTarget.src = "/placeholder.png";
                                                        e.currentTarget.onerror = null; // Prevenir loop
                                                    }}
                                                    onLoad={() => {
                                                        if (index === 0) {
                                                            console.log("Imagem carregada com sucesso:", imageUrl);
                                                        }
                                                    }}
                                                    loading="lazy"
                                                />
                                                {/* Overlay apenas no hover */}
                                                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(img)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                                    >
                                                        🗑️ Apagar
                                                    </button>
                                                </div>
                                                {/* Checkbox de visibilidade */}
                                                <div className="absolute top-2 left-2 z-10">
                                                    <label className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs cursor-pointer shadow-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={isVisible}
                                                            onChange={() => handleToggleVisible(img)}
                                                            className="cursor-pointer"
                                                        />
                                                        <span className={isVisible ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                                                            {isVisible ? 'Visível' : 'Oculta'}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Upload de Novas Imagens */}
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para adicionar novas imagens</span></p>
                                <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setNewImages(Array.from(e.target.files));
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {newImages.length > 0 && (
                        <p className="mt-2 text-sm text-green-600">{newImages.length} nova(s) imagem(ns) selecionada(s)</p>
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