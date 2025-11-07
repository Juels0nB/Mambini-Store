import NavBar from "../components/NavBar";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
                <h1 className="text-3xl font-semibold mb-6">Contacta-nos</h1>

                <p className="mb-6 text-gray-700">
                    Tens alguma dúvida sobre a tua encomenda, precisas de ajuda com um produto
                    ou simplesmente queres falar connosco? Estamos sempre prontos para ajudar 💬
                </p>

                <p className="mb-6 text-gray-700">
                    Podes entrar em contacto connosco por email, telefone ou através das nossas
                    redes sociais. Tentamos responder o mais rápido possível — normalmente em
                    menos de 24h nos dias úteis.
                </p>

                <div className="space-y-4 text-gray-700">
                    <p><strong>📍 Morada:</strong> Rua do Curral, nº 25, Felgueiras</p>
                    <p><strong>📞 Telefone:</strong> +351 900 000 000</p>
                    <p><strong>✉️ Email:</strong> suporte@mambinistore.com</p>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Segue-nos nas redes sociais</h2>
                    <p className="text-gray-700 mb-2">
                        Fica a par das nossas novidades, promoções e lançamentos:
                    </p>
                    <ul className="space-y-1">
                        <li>
                            <a href="https://www.instagram.com" target="_blank" className="hover:underline text-black">
                                📸 Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com" target="_blank" className="hover:underline text-black">
                                👍 Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com" target="_blank" className="hover:underline text-black">
                                🎵 TikTok
                            </a>
                        </li>
                    </ul>
                </div>

                <p className="mt-10 text-gray-600 italic">
                    A tua opinião é super importante para nós. Não hesites em mandar mensagem —
                    adoramos ouvir-te! 💛
                </p>
            </main>


        </div>
    );
}
