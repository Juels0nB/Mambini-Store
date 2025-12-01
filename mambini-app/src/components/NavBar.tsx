import { useState } from "react";
import {
    AiOutlineMenu,
    AiOutlineClose,
    AiOutlineSearch,
    AiOutlineShoppingCart,
    AiOutlineUser,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavBar() {
    const { cartCount } = useCart();
    const [nav, setNav] = useState(false);
    const handleNav = () => setNav(!nav);

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
            <nav className="flex justify-between items-center max-w-[1240px] mx-auto px-6 py-3 text-gray-800">
                {/* LOGO */}
                <h1 className="text-xl font-bold tracking-wide">MAMBINI STORE</h1>

                {/* LINKS DESKTOP */}
                <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <li className="hover:text-black text-gray-600 cursor-pointer">
                        <a href="/">Home</a>
                    </li>
                    <li className="hover:text-black text-gray-600 cursor-pointer">
                        <a href="/products">Shop</a>
                    </li>

                    {/* SEARCH BAR */}
                    <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full">
                        <AiOutlineSearch size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm placeholder-gray-400"
                        />
                    </div>

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
                <h1 className="text-xl font-bold p-6 border-b border-gray-200">
                    MAMBINI STORE
                </h1>
                <ul className="p-6 space-y-4 text-gray-700 font-medium">
                    <li onClick={handleNav} className="border-b pb-2">
                        <a href="/">Home</a>
                    </li>
                    <li className="border-b pb-2">
                        <a href="/products">Shop</a>
                    </li>
                    <li className="flex items-center gap-2 border-b pb-2">
                        <AiOutlineSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm placeholder-gray-500"
                        />
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
