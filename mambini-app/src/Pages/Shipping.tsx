import NavBar from "../components/NavBar";


export default function Shipping() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
                <h1 className="text-3xl font-semibold mb-6">Política de Envio</h1>

                <p className="mb-6">
                    Queremos que recebas a tua encomenda o mais rápido possível! 🚀
                    Aqui explicamos como funciona o processo de envio, prazos e custos, para que saibas exatamente o que esperar.
                </p>

                <h2 className="text-xl font-semibold mb-2">Prazo de processamento</h2>
                <p className="mb-6">
                    Assim que fazes o pedido, a nossa equipa prepara tudo com cuidado.
                    O processamento costuma levar entre <strong>1 a 2 dias úteis</strong> antes do envio.
                    Durante épocas com muito movimento (como Natal), pode demorar um pouquinho mais.
                </p>

                <h2 className="text-xl font-semibold mb-2">Envios em Portugal</h2>
                <p className="mb-6">
                    Enviamos para todo o país — continente e ilhas.
                    As entregas costumam chegar em <strong>2 a 5 dias úteis</strong> depois do envio.
                    Trabalhamos com transportadoras de confiança para garantir que tudo chegue direitinho.
                </p>

                <h2 className="text-xl font-semibold mb-2">Envios internacionais</h2>
                <p className="mb-6">
                    Também fazemos envios para fora de Portugal! 🌍
                    O prazo depende do destino, normalmente entre <strong>7 a 15 dias úteis</strong>.
                    Eventuais taxas alfandegárias ficam a cargo do cliente.
                </p>

                <h2 className="text-xl font-semibold mb-2">Custos de envio</h2>
                <p className="mb-6">
                    O custo é calculado automaticamente no checkout, com base no peso e destino da encomenda.
                    Em compras acima de <strong>50€</strong>, o envio é <strong>gratuito</strong> para Portugal continental.
                </p>

                <h2 className="text-xl font-semibold mb-2">Acompanhar a encomenda</h2>
                <p className="mb-6">
                    Assim que o teu pedido for enviado, vais receber um email com o código de rastreio 📦
                    Podes acompanhar tudo em tempo real até chegar à tua porta.
                </p>

                <h2 className="text-xl font-semibold mb-2">Encomenda atrasada?</h2>
                <p className="mb-6">
                    Se o prazo já passou e ainda não recebeste, não te preocupes!
                    Entra em contacto connosco através de <strong>suporte@mambinistore.com</strong>
                    e vamos verificar o que aconteceu o mais rápido possível.
                </p>

                <h2 className="text-xl font-semibold mb-2">Morada incorreta</h2>
                <p className="mb-6">
                    Verifica sempre se a morada está correta antes de confirmar a compra.
                    Se notares algum erro, avisa-nos logo — se o pedido ainda não tiver sido enviado, conseguimos atualizar.
                </p>

                <h2 className="text-xl font-semibold mb-2">Precisas de ajuda?</h2>
                <p>
                    Se tiveres alguma dúvida sobre o envio, fala connosco! 💬
                    O nosso email é <strong>suporte@mambinistore.com</strong> e estamos disponíveis de segunda a sexta, das 9h às 18h.
                </p>
            </main>

        </div>
    );
}
