import { User, Challenge, ChallengeStatus } from '../types';
import { MOCK_CHALLENGES } from '../constants';

const KEYS = {
  USERS: 'sb_users',
  CHALLENGES: 'sb_challenges',
  SESSION: 'sb_session',
  VERSION: 'sb_version_1.1' // Incrementing this forces a data reset for development
};

// Seed data if empty or version mismatch
const seedData = () => {
  const currentVersion = localStorage.getItem('sb_db_version');
  
  // Force reset if version changed (to help you see new mock data)
  if (currentVersion !== KEYS.VERSION) {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
      localStorage.setItem('sb_db_version', KEYS.VERSION);
      
      // Reset users if needed, but lets keep them to avoid login issues if structure hasn't changed
      if (!localStorage.getItem(KEYS.USERS)) {
        const demoUser: User = {
          id: 'u1',
          name: 'Usuário Demo',
          email: 'demo@socialbet.com',
          password: '123',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
          balance: 150.00
        };
        localStorage.setItem(KEYS.USERS, JSON.stringify([demoUser]));
      }
      return;
  }

  if (!localStorage.getItem(KEYS.CHALLENGES)) {
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
  }
};

export const storageService = {
  init: () => {
    seedData();
  },

  // Auth & Users
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  login: (email: string, password: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.SESSION);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  updateUserBalance: (userId: string, amount: number) => {
    const users = storageService.getUsers();
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, balance: u.balance + amount } : u
    );
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    
    // Update session if it's the current user
    const currentUser = storageService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, balance: currentUser.balance + amount };
      localStorage.setItem(KEYS.SESSION, JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },

  // Challenges
  getChallenges: (): Challenge[] => {
    return JSON.parse(localStorage.getItem(KEYS.CHALLENGES) || '[]');
  },

  saveChallenge: (challenge: Challenge) => {
    const list = storageService.getChallenges();
    const newList = [challenge, ...list];
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(newList));
  },

  updateChallenge: (updatedChallenge: Challenge) => {
    const list = storageService.getChallenges();
    const newList = list.map(c => c.id === updatedChallenge.id ? updatedChallenge : c);
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(newList));
  }
};
