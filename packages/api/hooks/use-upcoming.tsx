import useSWR from 'swr';
import { get } from '../utils/fetcher';
import ApiRoutes from '../routes';

export const useGetUpcomingMatches = () => {
  const { data, error, isValidating, mutate } = useSWR(ApiRoutes.UPCOMING, get);

  return {
    data,
    error,
    isValidating,
    mutate,
  };
};

export const getUpcomingMatches = async () => {
  const res = await get(`${ApiRoutes.UPCOMING}?newonly=true`);

  return { res, url: `${ApiRoutes.UPCOMING}?newonly=true` };
};

export const getScore = async () => {
  const res = await get(ApiRoutes.SCORE);

  return { res, url: ApiRoutes.SCORE };
};
