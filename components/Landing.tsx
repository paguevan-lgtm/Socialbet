import React from 'react';
import { Trophy, Shield, Users, Sparkles, ArrowRight } from 'lucide-react';

interface LandingProps {
    onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-indigo-600" />
                    <span className="font-bold text-2xl tracking-tight text-gray-900">Social<span className="text-indigo-600">Bet</span></span>
                </div>
                <button 
                    onClick={onStart}
                    className="text-gray-600 font-medium hover:text-indigo-600 transition-colors"
                >
                    Fazer Login
                </button>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-24">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Chega de "Deus te pague".</span>{' '}
                        <span className="block text-indigo-600 xl:inline">Aposte valendo.</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        A plataforma social para transformar qualquer discussão de bar, meta de fitness ou previsão esportiva em uma aposta segura entre amigos.
                    </p>
                    <div className="mt-10 sm:flex sm:justify-center gap-4">
                        <button
                            onClick={onStart}
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-32 pb-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="pt-6">
                            <div className="flow-root bg-gray-50 rounded-2xl px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Social P2P</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Você cria o desafio e manda o link no WhatsApp. Seus amigos entram e o dinheiro fica travado até o resultado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-gray-50 rounded-2xl px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg">
                                            <Shield className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Escrow Seguro</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        O dinheiro só é liberado para o vencedor após validação da prova. Sem calote, sem estresse.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-gray-50 rounded-2xl px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">IA Juiz & Contratos</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Nossa IA gera contratos engraçados e ajuda a analisar as provas enviadas em caso de disputa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
