enum ApiRoutes {
  UPCOMING = '/matches',
  SCORE = '/scores/live',
  SEASONS = '/v2/season',
  TEAM = '/team/teamId',
  MATCH = '/match/matchId',
  ALL_SEASON_MATCHES = '/matches/season/seasonId',
  FRAMES = '/v2/frames/matchId',
  TEAM_STATS = '/season/seasonId/stats/record/team/teamId',
  BEST_PLAYER = '/stats/team/players/internal/teamId',
  PLAYER = '/player/stats/info/playerId',
  MISSED_MATCHES = '/matches/postponed',
}

export default ApiRoutes;
