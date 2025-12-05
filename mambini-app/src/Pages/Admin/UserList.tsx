import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser, type User, type UserUpdate } from "../../api/userApi";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const roleLabels: Record<string, string> = {
    client: "Cliente",
    admin: "Administrador",
};

const roleColors: Record<string, string> = {
    client: "bg-blue-100 text-blue-800",
    admin: "bg-purple-100 text-purple-800",
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<UserUpdate>({
        email: "",
        name: "",
        role: "client",
    });

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            console.error("Erro ao carregar utilizadores:", err);
            alert("Erro ao carregar utilizadores: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            email: user.email,
            name: user.name,
            role: user.role,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingUser || !editingUser.id) return;

        try {
            await updateUser(editingUser.id, editForm);
            await loadUsers();
            setEditingUser(null);
            alert("Utilizador atualizado com sucesso!");
        } catch (err: any) {
            console.error("Erro ao atualizar utilizador:", err);
            alert("Erro ao atualizar utilizador: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({ email: "", name: "", role: "client" });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tens a certeza que queres apagar este utilizador?")) {
            try {
                await deleteUser(id);
                setUsers(users.filter((u) => u.id !== id));
            } catch (err: any) {
                console.error("Erro ao apagar utilizador:", err);
                alert("Erro ao apagar utilizador: " + (err.response?.data?.detail || err.message));
            }
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">A carregar utilizadores...</div>;
    }

    return (
        <div className="p-0">
            {users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Nenhum utilizador encontrado.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Função
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    {editingUser?.id === user.id ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, name: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, email: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={editForm.role}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, role: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                >
                                                    <option value="client">Cliente</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancelar
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        roleColors[user.role] || roleColors.client
                                                    }`}
                                                >
                                                    {roleLabels[user.role] || user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    <AiOutlineEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => user.id && handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <AiOutlineDelete size={18} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

