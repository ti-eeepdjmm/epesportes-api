// Tipagem para payload de uma nova postagem
export interface NewPostPayload {
  postId: string;
  author: string;
  timestamp: number;
}

// Tipagem para payload de notificação
export interface NotificationPayload {
  type: 'like' | 'comment' | 'mention' | 'follow';
  message: string;
  link: string;
}

// Tipagem para payload de atualização de jogo
export interface GameUpdatePayload {
  gameId: string;
  score: string;
  status: 'First Half' | 'Second Half' | 'Finished';
  currentTime: string;
}

// Tipagem para payload de atualização de enquete
export interface PollUpdatePayload {
  pollId: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
}

// Tipagem para payload de atualização de desafio
export interface ChallengeUpdatePayload {
  challengeId: string;
  status: 'open' | 'in_progress' | 'finished';
  title: string;
}
