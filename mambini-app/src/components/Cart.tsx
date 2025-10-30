import feat1 from '../assets/feat-1.jpg';
import feat2 from '../assets/feat-2.jpg';
import { useState } from "react";

function Cart() {
    // Estado com produtos do carrinho
    const [itens, setItens] = useState([
        {
            id: 1,
            nome: "Jacket",
            tamanho: "L",
            cor: "Black",
            preco: 29.99,
            quantidade: 1,
            imagem: feat1
        },
        {
            id: 2,
            nome: "Product 2",
            tamanho: "M",
            cor: "Brown",
            preco: 29.99,
            quantidade: 1,
            imagem: feat2
        },

    ]);

    // Funções básicas
    const aumentar = (id: number) => {
        setItens(itens.map(item =>
            item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
        ));
    };

    const diminuir = (id: number) => {
        setItens(itens.map(item =>
            item.id === id && item.quantidade > 1
                ? { ...item, quantidade: item.quantidade - 1 }
                : item
        ));
    };

    const remover = (id: number) => {
        setItens(itens.filter(item => item.id !== id));
    };

    // Calcular total
    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return (
        <div className="min-h-screen flex flex-col ">


            {/* Conteúdo principal */}
            <main className="flex-grow max-w-5xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-10">Carrinho de Compras</h1>

                {itens.length === 0 ? (
                    <p>O carrinho está vazio.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-15">
                        {/* Lista de produtos */}
                        <div className="lg:col-span-2 space-y-6">
                            {itens.map(item => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                    <img src={item.imagem} alt={item.nome} className="w-32 h-32 rounded" />

                                    <div className="flex-1">
                                        <h2 className="font-medium">{item.nome}</h2>
                                        <p className="text-sm text-gray-500">
                                            Tamanho: {item.tamanho} | Cor: {item.cor}
                                        </p>
                                        <p className="font-semibold mt-1">€{item.preco.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => diminuir(item.id)} className="px-2 border rounded">−</button>
                                        <span>{item.quantidade}</span>
                                        <button onClick={() => aumentar(item.id)} className="px-2 border rounded">+</button>
                                    </div>

                                    <button onClick={() => remover(item.id)} className="text-red-500 ml-4">🗑️</button>
                                </div>
                            ))}
                        </div>

                        {/* total e o botão de finalizar compra */}
                        <div className="p-8 border rounded-lg bg-white h-fit">
                            <h3 className="text-2xl font-semibold mb-3">Resumo</h3>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Itens:</span>
                                <span>{itens.length}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2">
                                <span>Total:</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                            <button className="w-full mt-6 py-3 bg-black text-white rounded">
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                )}
            </main>


        </div>
    );
}

export default Cart;
