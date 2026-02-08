import React from 'react';
import { LayoutDashboard, PlusCircle, Trophy, LogOut } from 'lucide-react';
import { ViewState, User } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, user, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onChangeView('HOME')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <Trophy className="h-7 w-7 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900">Social<span className="text-indigo-600">Bet</span></span>
            </div>
          </div>
          
          <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-6">
            <button 
              onClick={() => onChangeView('HOME')}
              className={`${currentView === 'HOME' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'} px-3 py-2 rounded-md text-sm font-medium transition-all`}
            >
              Explorar
            </button>
            <button 
              onClick={() => onChangeView('DASHBOARD')}
              className={`${currentView === 'DASHBOARD' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'} px-3 py-2 rounded-md text-sm font-medium transition-all`}
            >
              Minhas Apostas
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-gray-500 font-medium">Seu Saldo</span>
                <span className="text-sm font-bold text-green-600">R$ {user.balance.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => onChangeView('CREATE')}
              className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Desafio
            </button>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-9 w-9 rounded-full border border-gray-200 bg-gray-50"
                />
                <button 
                    onClick={onLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Sair"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="sm:hidden border-t border-gray-200 flex justify-around py-3 bg-white fixed bottom-0 w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => onChangeView('HOME')} className={`flex flex-col items-center px-4 py-1 rounded-lg transition-colors ${currentView === 'HOME' ? 'text-indigo-600' : 'text-gray-400'}`}>
             <Trophy size={22} />
             <span className="text-[10px] mt-1 font-medium">Explorar</span>
          </button>
          <button onClick={() => onChangeView('CREATE')} className={`flex flex-col items-center px-4 -mt-8`}>
             <div className="bg-indigo-600 rounded-full p-3 shadow-lg border-4 border-white text-white">
                 <PlusCircle size={28} />
             </div>
          </button>
          <button onClick={() => onChangeView('DASHBOARD')} className={`flex flex-col items-center px-4 py-1 rounded-lg transition-colors ${currentView === 'DASHBOARD' ? 'text-indigo-600' : 'text-gray-400'}`}>
             <LayoutDashboard size={22} />
             <span className="text-[10px] mt-1 font-medium">Painel</span>
          </button>
      </div>
    </nav>
  );
};
