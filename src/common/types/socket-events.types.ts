// Tipagem para payload de uma nova postagem
export interface NewPostPayload {
  postId: string;
  author: string;
  timestamp: number;
}

// Tipagem para payload de notificação
export interface NotificationPayload {
  type: 'reaction' | 'comment' | 'mention' | 'follow';
  message: string;
  link: string;
  timestamp: number;
}

// Tipagem para payload de atualização de jogo
export interface MatchUpdatePayload {
  matchId: string;
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
