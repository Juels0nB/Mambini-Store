import { useState } from "react";
import {
    AiOutlineMenu,
    AiOutlineClose,
    AiOutlineSearch,
    AiOutlineShoppingCart,
    AiOutlineUser,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavBar() {
    const { cartCount } = useCart();
    const [nav, setNav] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const handleNav = () => setNav(!nav);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
            <nav className="flex justify-between items-center max-w-[1240px] mx-auto px-6 py-3 text-gray-800">
                {/* LOGO */}
                <h1 className="text-xl font-bold tracking-wide">MAMBINI STORE</h1>

                {/* LINKS DESKTOP */}
                <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <li className="hover:text-black text-gray-600 cursor-pointer">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hover:text-black text-gray-600 cursor-pointer">
                        <Link to="/products">Shop</Link>
                    </li>

                    {/* SEARCH BAR */}
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full">
                        <AiOutlineSearch size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm placeholder-gray-400"
                        />
                    </form>

                    {/* CART + USER ICONS */}
                    <div className="flex items-center gap-5">
                        <Link to="/cart" className="relative cursor-pointer">
                            <AiOutlineShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 min-w-[18px] text-center">
                    {cartCount}
                </span>
                            )}
                        </Link>

                        {/* ✅ agora o perfil está ligado */}
                        <Link to="/profile">
                            <AiOutlineUser size={22} className="cursor-pointer" />
                        </Link>
                    </div>
                </ul>

                {/* MENU MOBILE ICON */}
                <div onClick={handleNav} className="md:hidden cursor-pointer">
                    {nav ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div
                className={`fixed top-0 left-0 h-full w-[70%] bg-white border-r border-gray-200 z-40 transition-transform duration-500 ease-in-out ${
                    nav ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Link to="/" className="text-xl font-bold tracking-wide">
                    MAMBINI STORE
                </Link>
                <ul className="p-6 space-y-4 text-gray-700 font-medium">
                    <li onClick={handleNav} className="border-b pb-2">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="border-b pb-2">
                        <Link to="/products">Shop</Link>
                    </li>
                    <li className="border-b pb-2">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <AiOutlineSearch size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-sm placeholder-gray-500 flex-1"
                            />
                        </form>
                    </li>
                    <li className="flex items-center gap-3">
                        <Link to="/cart">
                            <AiOutlineShoppingCart size={22} />
                        </Link>
                        <Link to="/profile">
                            <AiOutlineUser size={22} />
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default NavBar;
