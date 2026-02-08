export type ViewState = 'HOME' | 'CREATE' | 'DASHBOARD' | 'CHALLENGE_DETAIL';

export enum ChallengeStatus {
  OPEN = 'OPEN',       // Accepting bets
  LOCKED = 'LOCKED',   // Bets closed, waiting for outcome
  VOTING = 'VOTING',   // Reviewing proof
  CLOSED = 'CLOSED'    // Payout distributed
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real backend, this would be hashed. Storing raw for demo localStorage.
  avatar: string;
  balance: number;
}

export interface Participant {
  userId: string;
  name: string;
  avatar: string;
  vote?: 'YES' | 'NO';
  paid: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  aiTerms?: string;
  creatorId: string;
  amount: number;
  totalPot: number;
  deadline: string;
  status: ChallengeStatus;
  participants: Participant[];
  proofImage?: string;
  proofDescription?: string;
  createdAt: string;
  category: 'FITNESS' | 'SOCIAL' | 'GAMING' | 'OTHER';
}

export interface AIReply {
  text: string;
}
