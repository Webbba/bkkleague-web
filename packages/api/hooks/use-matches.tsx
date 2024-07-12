import { get } from '../utils/fetcher';
import ApiRoutes from '../routes';

export const getMatch = async (id: string) => {
  const url = ApiRoutes.MATCH.replace('matchId', id);

  const res = await get(url);

  return { res, url: url };
};

export const getMatches = async (id: string) => {
  const url = ApiRoutes.ALL_SEASON_MATCHES.replace('seasonId', id);
  const res = await get(url);

  return { res, url };
};

export const getCompletedMatches = async () => {
  const res = await get(`${ApiRoutes.UPCOMING}?completed=true`);

  return { res, url: `${ApiRoutes.UPCOMING}?completed=true` };
};

export const getFrames = async (id: string) => {
  const url = ApiRoutes.FRAMES.replace('matchId', id);

  const res = await get(url);

  return { res, url: url };
};
