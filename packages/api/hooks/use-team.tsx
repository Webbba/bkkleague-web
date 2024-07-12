import { get } from '../utils/fetcher';
import ApiRoutes from '../routes';

export const getTeam = async (id: string) => {
  const url = ApiRoutes.TEAM.replace('teamId', id);

  const res = await get(url);

  return { res, url };
};

export const getTeamStats = async (seasonId: string, teamId: string) => {
  const url = ApiRoutes.TEAM_STATS.replace('seasonId', seasonId).replace(
    'teamId',
    teamId,
  );

  const res = await get(url);

  return { res, url };
};

export const getTeamBestPlayer = async (teamId: string) => {
  const url = ApiRoutes.BEST_PLAYER.replace('teamId', teamId);

  const res = await get(url);

  return { res, url };
};

export const getPlayer = async (playerId: string) => {
  const url = ApiRoutes.PLAYER.replace('playerId', playerId);

  const res = await get(url);

  return { res, url };
};
