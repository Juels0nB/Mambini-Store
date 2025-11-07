
import NavBar from "../components/NavBar";


export default function Returns() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
                <h1 className="text-3xl font-semibold mb-6">Trocas e Devoluções</h1>

                <p className="mb-6">
                    Não te preocupes — se o artigo não era bem o que esperavas, podes trocá-lo ou devolvê-lo sem stress.
                    Queremos que fiques 100% satisfeito com a tua compra!
                </p>

                <h2 className="text-xl font-semibold mb-2">Prazo</h2>
                <p className="mb-6">
                    Tens até <strong>30 dias</strong> depois de receberes a encomenda para pedir uma troca ou devolução.
                    O artigo precisa estar em boas condições, com as etiquetas e embalagem original.
                </p>

                <h2 className="text-xl font-semibold mb-2">Como fazer</h2>
                <p className="mb-2">O processo é rápido e simples 👇</p>
                <ol className="list-decimal list-inside mb-6 space-y-2">
                    <li>Confirma que o artigo está dentro do prazo e sem uso.</li>
                    <li>Envia-nos um email para <strong>suporte@mambinistore.com</strong> com o número da encomenda.</li>
                    <li>Explica se queres trocar ou devolver e o motivo (opcional, mas ajuda-nos a melhorar!).</li>
                    <li>
                        Vamos responder com as instruções e o endereço para onde enviar o artigo.
                    </li>
                    <li>
                        Assim que o recebermos e confirmarmos o estado, tratamos da troca ou do reembolso.
                    </li>
                </ol>

                <h2 className="text-xl font-semibold mb-2">Custos de envio</h2>
                <p className="mb-6">
                    Se o erro for nosso (ex: artigo errado ou defeituoso), tratamos de tudo e não pagas portes.
                    Caso contrário, o envio da devolução fica a teu cargo.
                </p>

                <h2 className="text-xl font-semibold mb-2">Reembolsos</h2>
                <p className="mb-6">
                    O reembolso é feito pelo mesmo método de pagamento que usaste.
                    Assim que o artigo chegar e for verificado, o valor volta para a tua conta em até <strong>7 dias úteis</strong>.
                </p>

                <h2 className="text-xl font-semibold mb-2">Trocas</h2>
                <p className="mb-6">
                    Queres o mesmo artigo noutro tamanho ou cor? Sem problema — diz-nos qual preferes e tratamos da troca.
                    Se houver diferença de preço, ajustamos o valor na hora.
                </p>

                <h2 className="text-xl font-semibold mb-2">Artigos que não dá para devolver</h2>
                <p className="mb-6">
                    Alguns produtos, como roupa íntima, não podem ser trocados ou devolvidos
                    (a não ser que tenham defeito). Vê sempre a descrição do produto antes de comprar 😉
                </p>

                <h2 className="text-xl font-semibold mb-2">Precisas de ajuda?</h2>
                <p>
                    Se tiveres alguma dúvida, fala connosco!
                    Podes mandar mensagem para <strong>suporte@mambinistore.com</strong> ou ligar para{" "}
                    <strong>+351 900 000 000</strong>.
                    Estamos disponíveis de segunda a sexta, das 9h às 18h.
                </p>
            </main>


        </div>
    );
}
