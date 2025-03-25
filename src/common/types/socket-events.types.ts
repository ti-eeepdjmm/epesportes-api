// Tipagem para payload de uma nova postagem
export interface NewPostPayload {
  postId: string;
  author: number;
  timestamp: number;
}

// Tipagem para payload de notificação
export interface NotificationPayload {
  type: 'reaction' | 'comment' | 'mention' | 'follow';
  message: string;
  link: string;
  reaction?: 'liked' | 'beast' | 'plays_great' | 'amazing_goal' | 'stylish';
  sender: {
    id: number;
    name: string;
    avatar: string;
  };
  timestamp: number;
}

// Tipagem para payload de atualização de enquete
export interface PollUpdatePayload {
  pollId: string;
  title: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
}

export interface GlobalNotificationPayload {
  type: 'match_update' | 'event' | 'broadcast';
  title: string;
  message: string;
  link: string;
  timestamp: number;
}

export interface MatchUpdatePayload {
  matchId: number;
  type:
    | 'scheduled'
    | 'kickoff'
    | 'goal'
    | 'halftime'
    | 'completed'
    | 'cancelled';
  title: string;
  message: string;
  teams: {
    team1: {
      name: string;
      logoUrl?: string;
      score?: number;
    };
    team2: {
      name: string;
      logoUrl?: string;
      score?: number;
    };
  };
  timestamp: number;
  extra?: any; // opcional, para mais dados como autor do gol, tempo de jogo, etc.
}
