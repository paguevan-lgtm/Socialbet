import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Trophy, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = storageService.login(formData.email, formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Preencha todos os campos.');
        return;
      }
      
      const users = storageService.getUsers();
      if (users.find(u => u.email === formData.email)) {
        setError('Este e-mail já está em uso.');
        return;
      }

      const newUser: User = {
        id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(' ', '')}`,
        balance: 100.00 // Welcome bonus
      };

      storageService.saveUser(newUser);
      // Auto login
      storageService.login(newUser.email, newUser.password);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {isLogin ? 'Cadastre-se grátis' : 'Fazer Login'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
              >
                {isLogin ? (
                    <>
                        <LogIn className="w-4 h-4 mr-2" /> Entrar
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4 mr-2" /> Criar Conta
                    </>
                )}
              </button>
            </div>
          </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Diferenciais do SocialBet</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
                    <div>🔒 Pix Seguro</div>
                    <div>🤖 Juiz IA</div>
                    <div>🤝 P2P Social</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
