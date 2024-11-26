export interface User {
  id: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  created_by: string;
  whatsapp_group_id: string;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  phone: string;
  invited_by?: string;
  created_at: string;
}

export interface Event {
  id: string;
  community_id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  created_by: string;
  created_at: string;
}

export interface Game {
  id: string;
  event_id: string;
  team1_player1: string;
  team1_player2: string;
  team2_player1: string;
  team2_player2: string;
  team1_score: number;
  team2_score: number;
  winner_team?: 1 | 2;
  created_at: string;
}

export interface GamePoint {
  id: string;
  game_id: string;
  team: 1 | 2;
  point_type: 'simple' | 'carroca' | 'la_e_lo' | 'cruzada';
  points: number;
  created_at: string;
}
