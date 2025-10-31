import heroImg from '../assets/hero.jpg';
import feat1 from '../assets/feat-1.jpg';
import feat2 from '../assets/feat-2.jpg';
import feat3 from '../assets/feat-3.jpg';
import feat4 from '../assets/feat-4.jpg';
import new1 from '../assets/new-1.jpg';
import new2 from '../assets/new-2.jpg';
import new3 from '../assets/new-3.jpg';
import new4 from '../assets/new-4.jpg';
import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
    const navigate = useNavigate();
    return (

        <main className="flex flex-col w-full min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative w-full h-[500px] bg-cover bg-center flex items-center justify-start px-6 md:px-20"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="bg-black/40 absolute inset-0" />
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        New Season Arrivals
                    </h1>
                    <p className="text-gray-200 mb-6">
                        Discover the latest trends and styles for this season. Shop our new collection now.
                    </p>
                    <button onClick={() => navigate("/products")} className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 px-6 md:px-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Featured Products</h2>
                    <button onClick={() => navigate("/products")} className="border border-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition">
                        View All Products
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[feat1, feat2, feat3, feat4].map((img, i) => (
                        <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            <img onClick={() =>navigate("/detail")} src={img} alt="Product" className="w-full h-64 object-cover" />
                            <div onClick={() =>navigate("/detail")} className="p-4">
                                <h3 className="font-semibold text-gray-800">Product {i + 1}</h3>
                                <p className="text-gray-500 text-sm">29.99€</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-16 px-6 md:px-20 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">New Arrivals</h2>
                    <button onClick={() => navigate("/products")} className="border border-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition">
                        View More Arrivals
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[new1, new2, new3, new4].map((img, i) => (
                        <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            <img onClick={() =>navigate("/detail")} src={img} alt="Product" className="w-full h-64 object-cover" />
                            <div onClick={() =>navigate("/detail")} className="p-4">
                                <h3 className="font-semibold text-gray-800">Arrival {i + 1}</h3>
                                <p className="text-gray-500 text-sm">39.99€</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}