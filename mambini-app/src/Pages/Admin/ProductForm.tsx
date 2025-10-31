import { useEffect, useState } from "react";
import { addProduct, editProduct, fetchProductById } from "../../services/productService";
import { useParams, useNavigate } from "react-router-dom";
import type {Product} from "../../api/productApi";

export default function ProductForm() {
    const { id } = useParams(); // Se tiver ID, é modo edição
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            if (id) {
                await editProduct(id, form);
                alert("Produto atualizado com sucesso!");
            } else {
                await addProduct(form);
                alert("Produto criado com sucesso!");
            }
            navigate("/admin");
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar produto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{id ? "Editar Produto" : "Novo Produto"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>Nome</p>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nome"
                    className="w-full p-2 border rounded"
                    required
                />
                <p>Description</p>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descrição"
                    className="w-full p-2 border rounded"
                />
                <p>Price</p>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Preço"
                    className="w-full p-2 border rounded"
                    required
                />
                <p>Stock</p>
                <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="w-full p-2 border rounded"
                />
                <p>Size</p>
                <input
                    value={form.sizes.join(", ")}
                    onChange={(e) => handleArrayChange("sizes", e.target.value)}
                    placeholder="Tamanhos (separados por vírgula)"
                    className="w-full p-2 border rounded"
                />

                <p>Available Size</p>
                <input
                    value={form.available_sizes.join(", ")}
                    onChange={(e) => handleArrayChange("available_sizes", e.target.value)}
                    placeholder="Tamanhos (separados por vírgula)"
                    className="w-full p-2 border rounded"
                />
                <p>Gender</p>
                <input
                    value={form.gender}
                    onChange={(e) => handleArrayChange("gender", e.target.value)}
                    placeholder="Tamanhos (separados por vírgula)"
                    className="w-full p-2 border rounded"
                />

                <p>Category</p>
                <input
                    value={form.category}
                    onChange={(e) => handleArrayChange("category", e.target.value)}
                    placeholder="categoria (separados por vírgula)"
                    className="w-full p-2 border rounded"
                />

                <p>Colors</p>
                <input
                    value={form.colors.join(", ")}
                    onChange={(e) => handleArrayChange("colors", e.target.value)}
                    placeholder="Cores (separadas por vírgula)"
                    className="w-full p-2 border rounded"
                />
                <p>Available Colors</p>
                <input
                    value={form.available_colors.join(", ")}
                    onChange={(e) => handleArrayChange("available_colors", e.target.value)}
                    placeholder="Cores (separadas por vírgula)"
                    className="w-full p-2 border rounded"
                />
                <p>Images</p>
                <input
                    type="file"
                    value={form.images.join(", ")}
                    onChange={(e) => handleArrayChange("images", e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Aguardar..." : id ? "Atualizar" : "Criar"}
                </button>
            </form>
        </div>
    );
}
