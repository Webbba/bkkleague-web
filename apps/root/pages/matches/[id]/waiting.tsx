import { useContext } from 'react';
import {
  getMatch,
  getTeamStats,
  getSeason,
  getTeamBestPlayer,
  getFrames,
} from 'api';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { MatchLayout } from 'base-components';
import { BestPlayer, Frame, TeamStats } from 'base-components/types';

export default function Waiting({
  fallback,
}: {
  fallback?: {
    match: any;
    homeTeamStats: TeamStats;
    awayTeamStats: TeamStats;
    awayTeamBestPlayer: BestPlayer;
    homeTeamBestPlayer: BestPlayer;
    frames: {
      frameData: Frame[];
      teams: {
        home: any;
        away: any;
      };
    };
  };
}) {
  return (
    <>
      <Head>
        <title>Bangkok pool league | Match</title>
      </Head>
      <MatchLayout
        currentMatch={fallback?.match}
        homeTeamStats={fallback?.homeTeamStats}
        awayTeamStats={fallback?.awayTeamStats}
        awayTeamBestPlayer={fallback?.awayTeamBestPlayer}
        homeTeamBestPlayer={fallback?.homeTeamBestPlayer}
        frames={fallback?.frames}
      />
    </>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { res: match } = await getMatch(query?.id as string);
  const { res: season } = await getSeason();
  const { res: frames } = await getFrames(query?.id as string);

  let props: any = {
    fallback: {
      match: match.data,
      frames: frames.data,
    },
  };

  if (season && season[0]) {
    const { res: homeTeamStats } = await getTeamStats(
      season[0].id,
      query?.homeTeam as string,
    );

    const { res: homeTeamBestPlayer } = await getTeamBestPlayer(
      query?.homeTeam as string,
    );

    const { res: awayTeamStats } = await getTeamStats(
      season[0].id,
      query?.awayTeam as string,
    );

    const { res: awayTeamBestPlayer } = await getTeamBestPlayer(
      query?.awayTeam as string,
    );

    props = {
      ...props,
      fallback: {
        ...props.fallback,
        homeTeamStats: homeTeamStats.data,
        awayTeamStats: awayTeamStats.data,
        homeTeamBestPlayer:
          homeTeamBestPlayer?.data && homeTeamBestPlayer?.data[0],
        awayTeamBestPlayer:
          awayTeamBestPlayer?.data && awayTeamBestPlayer?.data[0],
      },
    };
  }

  return {
    props,
  };
}
