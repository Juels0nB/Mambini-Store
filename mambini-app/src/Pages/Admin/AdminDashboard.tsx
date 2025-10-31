import { useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function AdminDashboard() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {showForm ? "View Products" : "Add Product"}
                </button>
            </div>

            {showForm ? <ProductForm /> : <ProductList />}
        </div>
    );
}
