import { Challenge, ChallengeStatus } from './types';

// Mocks used only for seeding the initial "database" (storageService)
export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c3',
    title: 'Desafio do QR Code (Teste)',
    description: 'Aposta criada especificamente para você testar o botão de pagar e o QR Code.',
    aiTerms: 'Declaro estar ciente de que estou gastando dinheiro fictício para testar uma tecnologia real.',
    creatorId: 'u2',
    amount: 15.00,
    totalPot: 15.00,
    deadline: '2024-12-31',
    status: ChallengeStatus.OPEN,
    category: 'OTHER',
    participants: [
      { userId: 'u2', name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', paid: true }
    ],
    createdAt: '2024-11-15',
  },
  {
    id: 'c1',
    title: 'Perder 2kg até o Natal',
    description: 'Quem não perder paga a rodada. Validação por foto da balança.',
    aiTerms: 'Eu, solenemente, declaro que submeterei meu corpo à privação calórica em troca da glória eterna e do dinheiro dos meus amigos.',
    creatorId: 'u1',
    amount: 50,
    totalPot: 200,
    deadline: '2024-12-25',
    status: ChallengeStatus.OPEN,
    category: 'FITNESS',
    participants: [
      { userId: 'u1', name: 'Usuário Demo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', paid: true },
      { userId: 'u2', name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', paid: true },
      { userId: 'u3', name: 'Ana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', paid: true },
      { userId: 'u4', name: 'Beto', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beto', paid: false },
    ],
    createdAt: '2024-11-01',
  },
  {
    id: 'c2',
    title: 'Marcos chega no horário no bar',
    description: 'Aposto que o Marcos chega depois das 20h. O barulho é às 19h.',
    aiTerms: 'O Réu, doravante denominado Marcos, compromete-se a desafiar as leis da física e do trânsito para comparecer ao local estipulado.',
    creatorId: 'u2',
    amount: 20,
    totalPot: 100,
    deadline: '2024-11-15',
    status: ChallengeStatus.VOTING,
    category: 'SOCIAL',
    proofImage: 'https://picsum.photos/seed/proof/400/300',
    proofDescription: 'Foto do relógio do bar às 20:15 e o Marcos não tá aqui.',
    participants: [
      { userId: 'u2', name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', paid: true, vote: 'NO' },
      { userId: 'u1', name: 'Usuário Demo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', paid: true, vote: 'NO' },
      { userId: 'u5', name: 'Marcos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos', paid: true, vote: 'YES' },
    ],
    createdAt: '2024-11-14',
  }
];

export const CATEGORIES = [
  { id: 'SOCIAL', label: 'Social & Rolês', icon: '🍻' },
  { id: 'FITNESS', label: 'Saúde & Fitness', icon: '💪' },
  { id: 'GAMING', label: 'Games & E-sports', icon: '🎮' },
  { id: 'OTHER', label: 'Outros', icon: '🎲' },
];
