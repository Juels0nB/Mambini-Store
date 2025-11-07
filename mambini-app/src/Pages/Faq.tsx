import NavBar from "../components/NavBar";

export default function FAQ() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
                <h1 className="text-3xl font-semibold mb-8">Perguntas Frequentes (FAQ)</h1>

                <p className="mb-10">
                    Tens dúvidas? Sem stress! 👇
                    Aqui reunimos as perguntas mais comuns que recebemos.
                    Se a tua dúvida não estiver aqui, podes sempre falar connosco pelo email:
                    <strong> suporte@mambinistore.com</strong>
                </p>

                {/* FAQ Items */}
                <div className="space-y-8">

                    <div>
                        <h2 className="text-xl font-semibold mb-2">🛒 Como faço uma encomenda?</h2>
                        <p>
                            É super simples! Basta escolheres o produto que queres, selecionar o tamanho/cor (se aplicável)
                            e clicar em <strong>"Adicionar ao carrinho"</strong>.
                            Depois é só ires ao carrinho e finalizares a compra.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">🚚 Quanto tempo demora a entrega?</h2>
                        <p>
                            Normalmente as entregas em Portugal demoram entre <strong>2 a 5 dias úteis</strong>.
                            Para ilhas ou envios internacionais, o prazo pode ser um pouco maior.
                            Vais receber um email com o código de rastreio assim que a tua encomenda for enviada.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">💸 Quais são os métodos de pagamento aceites?</h2>
                        <p>
                            Aceitamos <strong>cartão de crédito, MB WAY e PayPal</strong>.
                            Todos os pagamentos são processados de forma segura e encriptada.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">📦 Posso devolver ou trocar um produto?</h2>
                        <p>
                            Sim! Tens até <strong>14 dias</strong> após a receção da encomenda para pedir uma troca ou devolução.
                            O produto deve estar em perfeitas condições e com etiqueta.
                            Podes ler todos os detalhes na nossa página de <strong>Devoluções & Trocas</strong>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">🔁 Quanto tempo demora o reembolso?</h2>
                        <p>
                            Assim que recebermos e verificarmos o artigo devolvido, o reembolso é feito no prazo de
                            <strong> 3 a 7 dias úteis</strong> para o mesmo método de pagamento usado na compra.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">📮 O que faço se a minha encomenda não chegar?</h2>
                        <p>
                            Se já passou o prazo estimado e ainda não recebeste nada, entra em contacto connosco através do email
                            <strong> suporte@mambinistore.com</strong> com o número do pedido.
                            Vamos verificar junto da transportadora e dar-te uma resposta o mais rápido possível.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">👕 E se o tamanho não for o certo?</h2>
                        <p>
                            Não há problema! Podes pedir uma <strong>troca de tamanho</strong> dentro do prazo de 14 dias.
                            Só precisas de garantir que a peça está em perfeitas condições e não foi usada.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">💬 Como posso entrar em contacto?</h2>
                        <p>
                            Podes enviar-nos um email para <strong>suporte@mambinistore.com</strong> ou falar connosco pelas redes sociais — respondemos sempre o mais rápido possível 😊
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
}
