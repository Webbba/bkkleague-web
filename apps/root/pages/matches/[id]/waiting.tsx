import { useEffect } from 'react';
import { useRouter } from 'next/router';
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
      firstBreak?: string;
      frameData: Frame[];
      teams: {
        home: any;
        away: any;
      };
    };
  };
}) {
  const { push, query } = useRouter();

  useEffect(() => {
    if (fallback?.frames && fallback.match) {
      push(`/matches/${query?.id}/playing`);
    }
  }, [fallback?.frames, fallback?.match]);

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

    if (
      homeTeamBestPlayer &&
      homeTeamBestPlayer?.data &&
      homeTeamBestPlayer?.data[0]
    ) {
      props = {
        ...props,
        fallback: {
          ...props.fallback,
          homeTeamBestPlayer:
            homeTeamBestPlayer?.data && homeTeamBestPlayer?.data[0],
        },
      };
    }

    if (
      awayTeamBestPlayer &&
      awayTeamBestPlayer?.data &&
      awayTeamBestPlayer?.data[0]
    ) {
      props = {
        ...props,
        fallback: {
          ...props.fallback,
          awayTeamBestPlayer:
            awayTeamBestPlayer?.data && awayTeamBestPlayer?.data[0],
        },
      };
    }

    props = {
      ...props,
      fallback: {
        ...props.fallback,
        homeTeamStats: homeTeamStats.data,
        awayTeamStats: awayTeamStats.data,
      },
    };
  }

  return {
    props,
  };
}
