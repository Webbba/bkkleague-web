export interface Season {
  id: number;
  name: string;
  short_name: string;
  description?: string;
  sortorder: number;
  status_id: number;
  created: string;
  modified: string;
  identifier: number;
}

export interface Match {
  match_id: number;
  date: string;
  division_name: string;
  format: string;
  home_team_id: number;
  away_team_id: number;
  away_points?: number;
  away_frames?: number;
  id: number;
  name: string;
  short_name: string;
  logo: string;
  location: string;
  phone: string;
  email: string;
  line?: string;
  website: string;
  latitude: number;
  longitude: number;
  plus: string;
  status_id: number;
  created: string;
  modified: string;
  league_tables: number;
  home_team_name: string;
  home_team_short_name: string;
  home_frames?: number;
  home_points?: number;
  home_team_logo?: string;
  away_team_name: string;
  away_team_logo?: string;
  away_team_short_name: string;
  match_status_id: number;
}

export interface TeamStats {
  played: number;
  wins: number;
  ties: number;
  losses: number;
  points: number;
  frames: number;
}

export interface BestPlayer {
  nickname: string;
  profile_picture: string;
  played: number;
  won: number;
  points: number;
}

export interface Frame {
  frameNumber: number;
  homeTeamBreak?: boolean;
  awayTeamBreak?: boolean;
  winner: {
    side: string;
    teamId: number;
    name: string;
    shortName: string;
  };
  players: {
    home: [
      {
        playerId: number;
        nickname: string;
        firstName: string;
        lastName: string;
        avatar: string;
      },
    ];
    away: [
      {
        playerId: number;
        nickname: string;
        firstName: string;
        lastName: string;
        avatar: string;
      },
    ];
  };
}
