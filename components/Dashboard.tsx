import React from 'react';
import { Challenge, ChallengeStatus } from '../types';
import { ArrowRight, Clock, Users, Trophy } from 'lucide-react';

interface DashboardProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ challenges, onSelectChallenge, onCreateNew }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Apostas Recentes</h2>
        <button onClick={onCreateNew} className="text-indigo-600 font-medium hover:text-indigo-800 text-sm hidden sm:block">
            + Criar nova aposta
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map(challenge => (
          <div 
            key={challenge.id} 
            onClick={() => onSelectChallenge(challenge)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
          >
            <div className={`h-2 w-full ${
                challenge.status === 'OPEN' ? 'bg-green-500' : 
                challenge.status === 'VOTING' ? 'bg-purple-500' : 'bg-gray-400'
            }`} />
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
                     challenge.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                     challenge.status === 'VOTING' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                 }`}>
                     {challenge.status === 'OPEN' ? 'Aberto' : challenge.status}
                 </span>
                 <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                    💰 R$ {challenge.totalPot}
                 </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {challenge.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants.length} participantes
                  </div>
                  <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(challenge.deadline).toLocaleDateString()}
                  </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between text-sm font-medium text-indigo-600">
               Ver Detalhes
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
        
        {/* Create New Card Placeholder */}
        <button 
            onClick={onCreateNew}
            className="flex flex-col items-center justify-center h-full min-h-[250px] rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
        >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-indigo-200 group-hover:text-indigo-600 text-gray-400">
                <Trophy className="w-6 h-6" />
            </div>
            <span className="font-medium text-gray-600 group-hover:text-indigo-700">Criar Nova Aposta</span>
        </button>
      </div>
    </div>
  );
};
