import React, { useState } from 'react';
import { Challenge, ChallengeStatus, User } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Share2, Upload, CheckCircle, XCircle, AlertCircle, Clock, Gavel, QrCode, Copy, X, Lock } from 'lucide-react';
import { judgeProof } from '../services/geminiService';
import { createPixPayment, PaymentResponse } from '../services/paymentService';

interface ChallengeDetailProps {
  challenge: Challenge;
  currentUser: User;
  onBack: () => void;
  onUpdateChallenge: (updated: Challenge) => void;
}

export const ChallengeDetail: React.FC<ChallengeDetailProps> = ({ challenge, currentUser, onBack, onUpdateChallenge }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROOF'>('OVERVIEW');
  const [proofText, setProofText] = useState('');
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [loadingJudge, setLoadingJudge] = useState(false);

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const isParticipant = challenge.participants.some(p => p.userId === currentUser.id);
  const hasVoted = challenge.participants.find(p => p.userId === currentUser.id)?.vote;

  const handleInitiateJoin = async () => {
    setLoadingPayment(true);
    setShowPaymentModal(true);

    // Call Mercado Pago API
    const payment = await createPixPayment(
        challenge.amount, 
        currentUser, 
        `SocialBet: ${challenge.title}`
    );

    setPaymentData(payment);
    setLoadingPayment(false);
  };

  const confirmPaymentAndJoin = () => {
    // In a real app, this would happen via Webhook/WebSocket confirming the status 'approved'
    const updated = {
      ...challenge,
      participants: [...challenge.participants, {
        userId: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        paid: true
      }],
      totalPot: challenge.totalPot + challenge.amount
    };
    onUpdateChallenge(updated);
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  const handleCopyCode = () => {
      if (paymentData?.point_of_interaction.transaction_data.qr_code) {
          navigator.clipboard.writeText(paymentData.point_of_interaction.transaction_data.qr_code);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      }
  };

  const handleSubmitProof = async () => {
     setLoadingJudge(true);
     const verdict = await judgeProof(proofText, challenge.title);
     setAiVerdict(verdict);
     setLoadingJudge(false);

     const updated: Challenge = {
       ...challenge,
       status: ChallengeStatus.VOTING,
       proofDescription: proofText,
       proofImage: 'https://picsum.photos/seed/proofnew/400/300' 
     };
     onUpdateChallenge(updated);
     setActiveTab('PROOF');
  };

  const handleVote = (vote: 'YES' | 'NO') => {
    const updatedParticipants = challenge.participants.map(p => 
      p.userId === currentUser.id ? { ...p, vote } : p
    );
    const updated = { ...challenge, participants: updatedParticipants };
    onUpdateChallenge(updated);
  };

  // Chart Data
  const yesVotes = challenge.participants.filter(p => p.vote === 'YES').length;
  const noVotes = challenge.participants.filter(p => p.vote === 'NO').length;
  const pendingVotes = challenge.participants.length - yesVotes - noVotes;

  const data = [
    { name: 'Aprovado', value: yesVotes, color: '#22c55e' },
    { name: 'Rejeitado', value: noVotes, color: '#ef4444' },
    { name: 'Pendente', value: pendingVotes, color: '#e5e7eb' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 relative">
      <button onClick={onBack} className="mb-4 text-indigo-600 font-medium hover:underline">&larr; Voltar para Dashboard</button>
      
      {/* Payment Modal Overlay */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowPaymentModal(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button onClick={() => setShowPaymentModal(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <QrCode className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-3" id="modal-title">
                            Pagamento via Pix
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Para confirmar sua entrada na aposta.
                        </p>
                        
                        <div className="mt-4 py-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[250px] flex flex-col items-center justify-center">
                            {loadingPayment ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-2"></div>
                                    <span className="text-sm text-gray-500">Gerando QR Code...</span>
                                </div>
                            ) : paymentData ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-2xl font-bold text-gray-900">R$ {challenge.amount.toFixed(2)}</p>
                                    </div>
                                    {paymentData.point_of_interaction.transaction_data.qr_code_base64 ? (
                                         <img 
                                            src={`data:image/png;base64,${paymentData.point_of_interaction.transaction_data.qr_code_base64}`} 
                                            alt="Pix QR Code" 
                                            className="w-48 h-48 mix-blend-multiply"
                                         />
                                    ) : (
                                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                            Erro ao carregar imagem
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 w-full px-4">
                                        <p className="text-xs text-gray-500 mb-1 text-left">Código Copia e Cola:</p>
                                        <div className="flex gap-2">
                                            <input 
                                                readOnly 
                                                value={paymentData.point_of_interaction.transaction_data.qr_code}
                                                className="text-xs border border-gray-300 rounded p-2 w-full bg-white text-gray-600 truncate"
                                            />
                                            <button 
                                                onClick={handleCopyCode}
                                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                                                title="Copiar"
                                            >
                                                {copySuccess ? <CheckCircle size={16} className="text-green-600"/> : <Copy size={16}/>}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-red-500 text-sm px-4">
                                    Não foi possível gerar o Pix. Tente novamente ou verifique se a API permite localhost.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                        {paymentData ? (
                            <button
                                type="button"
                                onClick={confirmPaymentAndJoin}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                            >
                                Já paguei! (Simular)
                            </button>
                        ) : (
                             <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Cancelar
                            </button>
                        )}
                         <p className="mt-2 text-xs text-gray-400 text-center">Ambiente de Teste: O botão "Já paguei" libera o acesso imediatamente.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white relative">
          <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm border border-white/30`}>
             {challenge.status === 'OPEN' ? 'Apostas Abertas' : challenge.status}
          </span>
          <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
          <p className="text-indigo-100 text-lg opacity-90">Prêmio Acumulado: <span className="font-bold text-white text-2xl">R$ {challenge.totalPot.toFixed(2)}</span></p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'OVERVIEW'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('PROOF')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'PROOF'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prova & Votação
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detalhes</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Regras:</span> {challenge.description}</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Prazo:</span> {new Date(challenge.deadline).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Valor de Entrada:</span> R$ {challenge.amount.toFixed(2)}</p>
                  {challenge.aiTerms && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-serif italic text-gray-500">"{challenge.aiTerms}"</p>
                    </div>
                  )}
                </div>

                {/* LOGIC FIX: Always show button space, state changes based on participation/status */}
                <div className="mt-6">
                    {!isParticipant ? (
                        challenge.status === 'OPEN' ? (
                            <button 
                                onClick={handleInitiateJoin}
                                className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg transform hover:-translate-y-1"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                Pagar Entrada (R$ {challenge.amount})
                            </button>
                        ) : (
                            <button 
                                disabled
                                className="w-full flex items-center justify-center bg-gray-200 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed"
                            >
                                <Lock className="w-5 h-5 mr-2" />
                                Entradas Encerradas ({challenge.status})
                            </button>
                        )
                    ) : (
                        <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Você está participando
                        </div>
                    )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Participantes ({challenge.participants.length})</h3>
                <ul className="space-y-3">
                  {challenge.participants.map((p, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full border-2 border-white shadow-sm" src={p.avatar} alt="" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{p.name} {p.userId === currentUser.id && '(Você)'}</p>
                          <p className="text-xs text-green-600 font-semibold">{p.paid ? 'Pago' : 'Pendente'}</p>
                        </div>
                      </div>
                      {p.vote && (
                         <span className={`text-xs px-2 py-1 rounded font-bold ${p.vote === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                             {p.vote === 'YES' ? 'Aprovou' : 'Rejeitou'}
                         </span>
                      )}
                    </li>
                  ))}
                </ul>
                
                <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50">
                  <Share2 className="w-4 h-4 mr-2" /> Convidar Amigos via Zap
                </button>
              </div>
            </div>
          )}

          {activeTab === 'PROOF' && (
            <div className="space-y-6">
              {challenge.status === 'OPEN' && isParticipant && (
                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                    <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-blue-900">Ainda em andamento</h3>
                    <p className="text-blue-700 mb-4">A aposta ainda está aberta. Quando estiver pronto, envie a prova aqui.</p>
                    
                    <div className="text-left bg-white p-4 rounded-lg shadow-sm">
                        <label className="block text-sm font-medium text-gray-700">Descrição da Prova</label>
                        <textarea 
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            placeholder="Ex: Foto da balança marcando 78kg..."
                            value={proofText}
                            onChange={(e) => setProofText(e.target.value)}
                        />
                         <button 
                            onClick={handleSubmitProof}
                            disabled={!proofText || loadingJudge}
                            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {loadingJudge ? 'Juiz IA Analisando...' : 'Enviar Prova & Fechar Apostas'}
                        </button>
                    </div>
                 </div>
              )}

              {(challenge.status === 'VOTING' || challenge.status === 'CLOSED') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Prova Apresentada</h3>
                      <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                         <img src={challenge.proofImage || 'https://via.placeholder.com/400'} alt="Proof" className="w-full h-64 object-cover" />
                      </div>
                      <p className="text-gray-700 italic border-l-4 border-indigo-500 pl-4 py-2 bg-gray-50">
                        "{challenge.proofDescription}"
                      </p>
                      
                      {/* AI Verdict Simulation */}
                      <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <div className="flex items-center gap-2 mb-2">
                             <Gavel className="w-5 h-5 text-purple-600" />
                             <span className="font-bold text-purple-900">Veredito do Juiz IA</span>
                          </div>
                          <p className="text-sm text-purple-800">
                              {aiVerdict || challenge.aiTerms ? (aiVerdict || "Parece legítimo, mas a decisão final é do povo.") : "Analisando..."}
                          </p>
                      </div>
                   </div>

                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Votação da Galera</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-6 text-sm font-medium mb-6">
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Aprovado</div>
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Rejeitado</div>
                      </div>

                      {isParticipant && !hasVoted && challenge.status === 'VOTING' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleVote('NO')} className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 flex items-center justify-center">
                                <XCircle className="w-5 h-5 mr-2" /> Fake / Perdeu
                            </button>
                            <button onClick={() => handleVote('YES')} className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 mr-2" /> Válido / Ganhou
                            </button>
                        </div>
                      )}
                      
                      {hasVoted && (
                          <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
                              Seu voto foi computado. Aguardando resultado final.
                          </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
