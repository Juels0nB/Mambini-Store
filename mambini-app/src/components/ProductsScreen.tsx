import { useState } from "react";

const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        price: 24.99,
        image:
            "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ-6yh2SgLOphXGWOilS1hId8hIwZ4GtT3C08jc18baJn-yew1diTMiTBSWv7lPGAlTDD4Ky1kSicdjqyMJ_JJgit5khWhN0pwq32OPOysEiI1tFQ4G4CagZA",
    },
    {
        id: 2,
        name: "Hooded Sweatshirt",
        price: 35.99,
        image:
            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR-_TgYOkNeTxOp7kdpn8zgdAPli07ZRhWbfiYlBUFgE-nFtIdUxei_x5p3QYfvqOFQ4lgZNVn-h9sdWrb-hSNY8XCa69b5Q-Ppsn8i-nM-wmuSL0o8a-JH",

    },
    {
        id: 3,
        name: "Leather Jacket",
        price: 119.99,
        image:
            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR-_TgYOkNeTxOp7kdpn8zgdAPli07ZRhWbfiYlBUFgE-nFtIdUxei_x5p3QYfvqOFQ4lgZNVn-h9sdWrb-hSNY8XCa69b5Q-Ppsn8i-nM-wmuSL0o8a-JH",
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 89.99,
        image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSAZ73ufJaau70FNL8256g397B6HdW0xNpmCHRgdPW85D5dhgZia_hycbzKtfI8XUqIOjo9-khFwJfz77EtRr1HpUK3s0gNH-naSHtGbVCG6eTKKQYKw0fj7Q",
        badge: "New",
    },
    {
        id: 5,
        name: "Slim Fit Jeans",
        price: 58.99,
        image:
            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR7lVbALqwoxuiSQAAdOpbcugDEn3PeFNscSUBETxRpYuWWsQgkOMGXtA9nRbnY1r-cSh4CD7YcmXRHjIP1h2LuPCvFzl2ingr5hFIQBFDSvQCzAYe_b2nzpQ",
    },
    {
        id: 6,
        name: "Summer Dress",
        price: 49.99,
        image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT8Dq06A21lEeanFW9yAKTbO7QxwDFlgAwx5WMYO_PLUlpe2V6GP5QDSQnda7cRGpz3QYH6tlM46rWjW54zqrky_7IRhQ4RGUY3mSM29OPZ63_yiQXczxa0Fg",
    },
];

function ProductsScreen() {
    const [sort, setSort] = useState("name");

    const sortedProducts = [...products].sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price
    );

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Products
                </h1>
                <div className="text-gray-500">{products.length} products found</div>

                <div className="mt-3 md:mt-0">
                    <label className="mr-2 text-gray-600 font-medium">Sort by:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-1/4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Filters</h2>
                        <button className="text-sm text-gray-500 hover:underline">
                            Clear all
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><input type="checkbox" className="mr-2" /> All Categories</li>
                            <li><input type="checkbox" className="mr-2" /> T-Shirts</li>
                            <li><input type="checkbox" className="mr-2" /> Jeans</li>
                            <li><input type="checkbox" className="mr-2" /> Dresses</li>
                            <li><input type="checkbox" className="mr-2" /> Jackets</li>
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Price Range
                        </h3>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            className="w-full accent-gray-700"
                        />
                        <div className="text-gray-600 mt-2">0$ – 500$</div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Size</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {["XS", "S", "M", "L", "XL"].map((size) => (
                                <button
                                    key={size}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm hover:bg-gray-100"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-3"
                        >
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-56 object-cover rounded-lg"
                                />
                                {product.badge && (
                                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                                )}
                            </div>
                            <div className="mt-3">
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

export default ProductsScreen;
