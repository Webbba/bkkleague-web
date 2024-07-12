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
  home_logo?: string;
  home_team_short_name: string;
  home_frames?: number;
  home_points?: number;
  home_team_logo?: string;
  away_team_name: string;
  away_team_logo?: string;
  away_logo?: string;
  away_team_short_name: string;
  match_status_id: number;
}
