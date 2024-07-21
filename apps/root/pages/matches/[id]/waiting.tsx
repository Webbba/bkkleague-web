import { useEffect, useContext, useCallback, useState } from 'react';
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
import { MatchLayout, usePrevious } from 'base-components';
import { ReadyState, useSocketIO } from 'react-use-websocket';
import { BestPlayer, Frame, TeamStats } from 'base-components/types';
import { SocketContext } from 'base-components/context/socket-context';
import { AnimationContext } from 'base-components/context/animation-context';
import { ActiveTabContext } from 'base-components/context/active-tab-context';

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
  const [match, setMatch] = useState<any>();
  const [homeTeamStats, setHomeTeamStats] = useState<TeamStats | undefined>(
    undefined,
  );
  const [awayTeamStats, setAwayTeamStats] = useState<TeamStats | undefined>(
    undefined,
  );
  const [awayTeamBestPlayer, setAwayTeamBestPlayer] = useState<
    BestPlayer | undefined
  >(undefined);
  const [homeTeamBestPlayer, setHomeTeamBestPlayer] = useState<
    BestPlayer | undefined
  >(undefined);
  const [frames, setFrames] = useState<
    | {
        firstBreak?: string;
        frameData: Frame[];
        teams: {
          home: any;
          away: any;
        };
      }
    | undefined
  >(undefined);

  const {
    setIsConnected,
    setSubscribedMatches,
    isConnected,
    subscribedMatches,
  } = useContext(SocketContext);

  const { setAnimationRequested } = useContext(AnimationContext);
  const { focused } = useContext(ActiveTabContext);

  const { sendMessage, lastMessage, readyState } = useSocketIO(
    `${process.env.NEXT_PUBLIC_WSS_URL}`,
    {
      share: true,
      shouldReconnect: () => false,
      onOpen: () => {
        if (setSubscribedMatches) {
          setSubscribedMatches([Number(query.id) as number]);
        }

        if (setIsConnected) {
          setIsConnected(true);
        }

        sendMessage(`42["join", "match_${query.id}"]`);
      },
      onMessage: async () => {},
      retryOnError: true,
      reconnectAttempts: 1000,
      reconnectInterval: () => 3000,
    },
    focused,
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const prevConnectionStatus = usePrevious(connectionStatus);

  const reconnectRequests = useCallback(async () => {
    const { res: matchResponse } = await getMatch(query?.id as string);
    const { res: season } = await getSeason();
    const { res: framesResponse } = await getFrames(query?.id as string);

    if (framesResponse && framesResponse.data) {
      setFrames(framesResponse.data);
    }

    if (season && season[0]) {
      const { res: homeTeamStatsResponse } = await getTeamStats(
        season[0].id,
        query?.homeTeam as string,
      );

      if (homeTeamStatsResponse && homeTeamStatsResponse?.data) {
        setHomeTeamStats(homeTeamStatsResponse?.data);
      }

      const { res: homeTeamBestPlayerResponse } = await getTeamBestPlayer(
        query?.homeTeam as string,
      );

      if (
        homeTeamBestPlayerResponse &&
        homeTeamBestPlayerResponse?.data &&
        homeTeamBestPlayerResponse?.data[0]
      ) {
        setHomeTeamBestPlayer(homeTeamStatsResponse?.data[0]);
      }

      const { res: awayTeamStatsResponse } = await getTeamStats(
        season[0].id,
        query?.awayTeam as string,
      );

      if (awayTeamStatsResponse && awayTeamStatsResponse?.data) {
        setAwayTeamStats(awayTeamStatsResponse?.data);
      }

      const { res: awayTeamBestPlayerResponse } = await getTeamBestPlayer(
        query?.awayTeam as string,
      );

      if (
        awayTeamBestPlayerResponse &&
        awayTeamBestPlayerResponse?.data &&
        awayTeamBestPlayerResponse?.data[0]
      ) {
        setAwayTeamBestPlayer(awayTeamBestPlayerResponse?.data[0]);
      }
    }

    if (matchResponse && matchResponse.data) {
      push(
        `/matches/${query?.id}/playing?homeTeam=${query?.homeTeam}&awayTeam=${query?.awayTeam}`,
      );
    }
  }, []);

  useEffect(() => {
    if (fallback) {
      if (fallback?.match) {
        setMatch(fallback.match);
      }

      if (fallback?.homeTeamStats) {
        setHomeTeamStats(fallback?.homeTeamStats);
      }

      if (fallback?.awayTeamStats) {
        setAwayTeamStats(fallback?.awayTeamStats);
      }

      if (fallback?.awayTeamBestPlayer) {
        setAwayTeamBestPlayer(fallback?.awayTeamBestPlayer);
      }

      if (fallback?.homeTeamBestPlayer) {
        setHomeTeamBestPlayer(fallback?.homeTeamBestPlayer);
      }

      if (fallback?.frames) {
        setFrames(fallback?.frames);
      }
    }
  }, [fallback]);

  useEffect(() => {
    if (
      prevConnectionStatus !== connectionStatus &&
      prevConnectionStatus === 'Closed'
    ) {
      reconnectRequests();

      if (setIsConnected) {
        setIsConnected(true);
      }

      const nextSuscribedMatches = ([] as number[]).concat(
        subscribedMatches as number[],
      );

      if (!nextSuscribedMatches.find((item) => item === Number(query.id))) {
        nextSuscribedMatches.push(Number(query.id));

        sendMessage(`42["join", "match_${query.id}"]`);

        if (setSubscribedMatches) {
          setSubscribedMatches(nextSuscribedMatches);
        }
      }
    }
  }, [prevConnectionStatus, connectionStatus, subscribedMatches]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'match_update') {
        const payload: any = lastMessage.payload;

        if (payload?.type === 'firstbreak') {
          if (setAnimationRequested) {
            setAnimationRequested(true);
          }

          setTimeout(() => {
            push(
              `/matches/${query.id}/playing?homeTeam=${query?.homeTeam}&awayTeam=${query?.awayTeam}`,
            );
          }, 1500);
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isConnected) {
      const nextSuscribedMatches = ([] as number[]).concat(
        subscribedMatches as number[],
      );

      if (!nextSuscribedMatches.find((item) => item === Number(query.id))) {
        nextSuscribedMatches.push(Number(query.id));

        sendMessage(`42["join", "match_${query.id}"]`);

        if (setSubscribedMatches) {
          setSubscribedMatches(nextSuscribedMatches);
        }
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (fallback?.frames && fallback.match) {
      push(
        `/matches/${query?.id}/playing?homeTeam=${query?.homeTeam}&awayTeam=${query?.awayTeam}`,
      );
    }
  }, [fallback?.frames, fallback?.match]);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Match</title>
      </Head>
      <MatchLayout
        currentMatch={match}
        homeTeamStats={homeTeamStats}
        awayTeamStats={awayTeamStats}
        awayTeamBestPlayer={awayTeamBestPlayer}
        homeTeamBestPlayer={homeTeamBestPlayer}
        frames={frames}
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
