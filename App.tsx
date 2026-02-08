import React, { useState, useEffect } from 'react';
import { ViewState, Challenge, User } from './types';
import { storageService } from './services/storageService';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CreateChallenge } from './components/CreateChallenge';
import { ChallengeDetail } from './components/ChallengeDetail';
import { Auth } from './components/Auth';
import { Landing } from './components/Landing';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Initialize Data
  useEffect(() => {
    storageService.init();
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
    }
    loadData();
  }, []);

  const loadData = () => {
      setChallenges(storageService.getChallenges());
  };

  const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      setShowAuth(false);
      loadData();
  };

  const handleLogout = () => {
      storageService.logout();
      setUser(null);
      setCurrentView('HOME');
      setShowAuth(false);
  };

  const handleCreateChallenge = (newChallenge: Challenge) => {
    if (!user) return;

    storageService.saveChallenge(newChallenge);
    
    // Deduct balance from current user
    const updatedUser = storageService.updateUserBalance(user.id, -newChallenge.amount);
    if (updatedUser) setUser(updatedUser);

    loadData();
    
    // Select the new challenge and go to detail view
    const savedChallenges = storageService.getChallenges();
    const created = savedChallenges.find(c => c.id === newChallenge.id) || newChallenge;
    
    setSelectedChallenge(created);
    setCurrentView('CHALLENGE_DETAIL');
  };

  const handleUpdateChallenge = (updated: Challenge) => {
      if (!user) return;

      // Check if user just joined to deduct balance
      const oldVersion = challenges.find(c => c.id === updated.id);
      const userWasParticipant = oldVersion?.participants.some(p => p.userId === user.id);
      const userIsParticipant = updated.participants.some(p => p.userId === user.id);
      
      if (!userWasParticipant && userIsParticipant) {
          const updatedUser = storageService.updateUserBalance(user.id, -updated.amount);
          if (updatedUser) setUser(updatedUser);
      }

      storageService.updateChallenge(updated);
      loadData();
      setSelectedChallenge(updated);
  };

  // Logic for what to render
  if (!user) {
      if (showAuth) {
          return <Auth onLogin={handleLogin} />;
      }
      return <Landing onStart={() => setShowAuth(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
      case 'DASHBOARD':
        return (
          <Dashboard 
            challenges={currentView === 'HOME' ? challenges : challenges.filter(c => c.participants.some(p => p.userId === user.id))}
            onSelectChallenge={(c) => {
                setSelectedChallenge(c);
                setCurrentView('CHALLENGE_DETAIL');
            }}
            onCreateNew={() => setCurrentView('CREATE')}
          />
        );
      case 'CREATE':
        return (
          <CreateChallenge 
            userId={user.id}
            onCancel={() => setCurrentView('HOME')} 
            onSuccess={handleCreateChallenge} 
          />
        );
      case 'CHALLENGE_DETAIL':
        return selectedChallenge ? (
            <ChallengeDetail 
                challenge={selectedChallenge} 
                currentUser={user}
                onBack={() => setCurrentView('DASHBOARD')}
                onUpdateChallenge={handleUpdateChallenge}
            />
        ) : (
            <div>Erro: Desafio não encontrado.</div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navigation 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow pb-16 sm:pb-0">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500 hidden sm:block">
        <p>&copy; 2024 SocialBet. Aposte com responsabilidade (e amigos).</p>
      </footer>
    </div>
  );
};

export default App;
