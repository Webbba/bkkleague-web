// components
export { default as SwrConfig } from './components/swrConfig/swrConfig';

// season
export { getSeason, useGetSeason } from './hooks/use-seasons';

// upcoming matches
export {
  getUpcomingMatches,
  useGetUpcomingMatches,
  getScore,
} from './hooks/use-upcoming';

// matches
export {
  getMatch,
  getFrames,
  getMatches,
  getCompletedMatches,
  getMissedMatches,
} from './hooks/use-matches';

// teams
export {
  getTeam,
  getTeamStats,
  getTeamBestPlayer,
  getPlayer,
} from './hooks/use-team';

// other
export { default as ApiRoutes } from './routes';
