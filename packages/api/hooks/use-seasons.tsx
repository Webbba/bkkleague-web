import useSWR from 'swr';
import { get } from '../utils/fetcher';
import ApiRoutes from '../routes';

export const useGetSeason = () => {
  const { data, error, isValidating, mutate } = useSWR(ApiRoutes.SEASONS, get);

  return {
    data,
    error,
    isValidating,
    mutate,
  };
};

export const getSeason = async () => {
  const res = await get(ApiRoutes.SEASONS);

  return { res, url: ApiRoutes.SEASONS };
};
