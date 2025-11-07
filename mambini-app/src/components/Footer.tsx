function Footer() {
    return (
        <footer className="bg-gray-900 text-white px-8 py-10 mt-auto">
            {/* Container flex principal */}
            <div className="flex flex-col items-center text-center gap-y-8 md:flex-row md:justify-between md:items-start md:text-left">

                {/* Branding */}
                <div>
                    <h1 className="font-semibold text-lg mb-2">MambiniStore</h1>
                    <p className="text-gray-400 max-w-xs">
                        Your one-stop destination for the latest fashion trends and styles.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h1 className="font-semibold text-lg mb-2">Quick Links</h1>
                    <ul className="text-gray-400 space-y-1">
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Shop</a></li>
                        <li><a href="/cart">Cart</a></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h1 className="font-semibold text-lg mb-2">Customer Service</h1>
                    <ul className="text-gray-400 space-y-1">
                        <li><a href="/us">Contact Us</a></li>
                        <li><a href="/shipping">Shipping Policy</a></li>
                        <li><a href="/return">Returns & Exchanges</a></li>
                        <li><a href="/faq">FAQs</a></li>
                    </ul>
                </div>

                {/* Stay Updated */}
                <div>
                    <h1 className="font-semibold text-lg mb-2">Stay Updated</h1>
                    <p className="text-gray-400 mb-2">Subscribe to our newsletter</p>
                    <div className="flex gap-2 background-slate-100 bg-white rounded-lg" >
                        <input
                            type="email"
                            placeholder="Your email"
                            className="rounded-l-lg py-4 px-4 text-slate-500  "
                        />
                        <button className="bg-gray-800 border-gray-800 font-semibold rounded-r-lg px-20 py-2 hover:bg-gray-200 transition">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* Linha final (direitos autorais) */}
            <div className="mt-10 items-align-start pt-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MambiniStore. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
