import React, { useState } from 'react';
import { Sparkles, ArrowRight, DollarSign, Calendar, Lock } from 'lucide-react';
import { generateBetTerms } from '../services/geminiService';
import { CATEGORIES } from '../constants';
import { Challenge, ChallengeStatus } from '../types';

interface CreateChallengeProps {
  onCancel: () => void;
  onSuccess: (challenge: Challenge) => void;
  userId: string;
}

export const CreateChallenge: React.FC<CreateChallengeProps> = ({ onCancel, onSuccess, userId }) => {
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: 10,
    deadline: '',
    category: 'SOCIAL',
    description: '',
    aiTerms: ''
  });

  const handleGenerateTerms = async () => {
    if (!formData.title) return;
    setLoadingAI(true);
    const terms = await generateBetTerms(formData.title, formData.amount);
    setFormData(prev => ({ ...prev, aiTerms: terms }));
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newChallenge: Challenge = {
      id: `c-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      aiTerms: formData.aiTerms,
      creatorId: userId,
      amount: formData.amount,
      totalPot: formData.amount, // Initial pot is just the creator
      deadline: formData.deadline,
      status: ChallengeStatus.OPEN,
      category: formData.category as any,
      participants: [{
        userId: userId,
        name: 'Você', // Simplified for demo
        avatar: 'https://picsum.photos/seed/me/100/100',
        paid: true
      }],
      createdAt: new Date().toISOString()
    };

    onSuccess(newChallenge);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-8 sm:p-10 bg-indigo-600">
          <h2 className="text-3xl font-extrabold text-white">Novo Desafio</h2>
          <p className="mt-2 text-indigo-100">Formalize a zoeira. O dinheiro fica seguro com a gente.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
               <div>
                <label className="block text-sm font-medium text-gray-700">O que está em jogo?</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  placeholder="Ex: Emagrecer 2kg em 1 mês"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor da Entrada (R$)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prazo Final</label>
                  <input
                    type="date"
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-3"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg text-sm transition-all ${
                        formData.category === cat.id 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl mb-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Regras / Validação</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Como o vencedor será decidido? Ex: Foto da balança, vídeo fazendo flexão..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Próximo <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
               <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                 <div className="flex justify-between items-start">
                   <h3 className="text-lg font-medium text-indigo-900">Termos do "Contrato"</h3>
                   <button 
                    type="button"
                    onClick={handleGenerateTerms}
                    disabled={loadingAI}
                    className="flex items-center text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded hover:bg-indigo-300 transition-colors"
                   >
                     <Sparkles className="w-3 h-3 mr-1" />
                     {loadingAI ? 'Escrevendo...' : 'Gerar com IA'}
                   </button>
                 </div>
                 <div className="mt-3">
                   <textarea
                    className="w-full bg-white border-0 p-3 rounded-md text-gray-700 text-sm italic shadow-inner h-32 resize-none focus:ring-0"
                    placeholder="Clique no botão de IA para gerar um contrato divertido..."
                    value={formData.aiTerms}
                    onChange={e => setFormData({...formData, aiTerms: e.target.value})}
                   />
                 </div>
               </div>

               <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
                 <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                 <p className="text-sm text-yellow-800">
                   Ao criar este desafio, <strong>R$ {formData.amount}</strong> serão debitados da sua conta e mantidos em garantia até a resolução da aposta.
                 </p>
               </div>

               <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Confirmar & Pagar
                  </button>
               </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
