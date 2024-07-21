import { useCallback, useEffect, useState, useContext } from 'react';
import { Layout, usePrevious } from 'base-components';
import { Upcoming } from 'upcoming-matches';
import { getScore, getUpcomingMatches } from 'api';
import { ReadyState, useSocketIO } from 'react-use-websocket';
import { Match, Score } from 'upcoming-matches/hoc/types';
import { ActiveTabContext } from 'base-components/context/active-tab-context';
import { SocketContext } from 'base-components/context/socket-context';
import Head from 'next/head';

let scoreTimeout: NodeJS.Timeout;

export default function Root({
  fallback,
}: {
  fallback?: {
    upcomingMatches: Match[];
    score: Score[];
  };
}) {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [score, setScore] = useState<Score[]>([]);

  const {
    setSubscribedMatches,
    setIsConnected,
    isConnected,
    subscribedMatches,
  } = useContext(SocketContext);

  const { focused } = useContext(ActiveTabContext);

  const { sendMessage, lastMessage, readyState } = useSocketIO(
    `${process.env.NEXT_PUBLIC_WSS_URL}`,
    {
      share: true,
      shouldReconnect: () => false,
      onOpen: () => {
        const todayMatches = fallback?.upcomingMatches?.filter((item) => {
          const date = new Date(item.date);
          return (
            new Date(date).toLocaleDateString() ===
            new Date().toLocaleDateString()
          );
        });

        if (todayMatches && todayMatches?.length > 0) {
          todayMatches.forEach((item) => {
            setTimeout(() => {
              sendMessage(`42["join", "match_${item.match_id}"]`);
            }, 1000);
          });

          if (setSubscribedMatches) {
            setSubscribedMatches(todayMatches?.map((item) => item.match_id));
          }
        }

        if (setIsConnected) {
          setIsConnected(true);
        }
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

  const getScoreAction = useCallback(async () => {
    const { res } = await getScore();

    if (res && !res.error) {
      clearTimeout(scoreTimeout);

      setScore(res?.data);

      scoreTimeout = setTimeout(() => {
        getScoreAction();
      }, 60000);
    }
  }, []);

  useEffect(() => {
    if (lastMessage.type === 'match_update') {
      const payload: any = lastMessage.payload;

      if (payload?.type === 'firstbreak') {
        const nextUpcomingMatches = upcomingMatches?.map((item) => {
          const result = { ...item };

          if (payload.matchId === result.match_id) {
            result.inProgress = true;
          }

          return result;
        });

        setUpcomingMatches(nextUpcomingMatches);
      }
    }

    if (lastMessage?.type === 'frame_update') {
      const payload: any = lastMessage.payload;

      if (payload?.type === 'win') {
        clearTimeout(scoreTimeout);

        getScoreAction();
      }
    }
  }, [lastMessage, upcomingMatches]);

  useEffect(() => {
    if (fallback?.score) {
      setScore(fallback?.score);

      setTimeout(() => {
        getScoreAction();
      }, 60000);
    }
  }, [fallback?.score]);

  useEffect(() => {
    if (
      prevConnectionStatus !== connectionStatus &&
      prevConnectionStatus === 'Closed'
    ) {
      if (setSubscribedMatches) {
        setSubscribedMatches([]);
      }

      clearTimeout(scoreTimeout);

      getScoreAction();

      if (setIsConnected) {
        setIsConnected(true);
      }

      const nextSuscribedMatches = ([] as number[]).concat(
        subscribedMatches as number[],
      );

      const todayMatches = fallback?.upcomingMatches?.filter((item) => {
        const date = new Date(item.date);
        return (
          new Date(date).toLocaleDateString() ===
          new Date().toLocaleDateString()
        );
      });

      if (todayMatches && todayMatches?.length > 0) {
        todayMatches.forEach((item) => {
          if (!nextSuscribedMatches.find((match) => match === item.match_id)) {
            setTimeout(() => {
              sendMessage(`42["join", "match_${item.match_id}"]`);
            }, 1000);

            nextSuscribedMatches.push(item.match_id);
          }
        });

        if (setSubscribedMatches) {
          setSubscribedMatches(nextSuscribedMatches);
        }
      }
    }
  }, [prevConnectionStatus, connectionStatus, subscribedMatches]);

  useEffect(() => {
    if (isConnected) {
      const nextSuscribedMatches = ([] as number[]).concat(
        subscribedMatches as number[],
      );

      const todayMatches = fallback?.upcomingMatches?.filter((item) => {
        const date = new Date(item.date);
        return (
          new Date(date).toLocaleDateString() ===
          new Date().toLocaleDateString()
        );
      });

      if (todayMatches && todayMatches?.length > 0) {
        todayMatches.forEach((item) => {
          if (!nextSuscribedMatches.find((match) => match === item.match_id)) {
            setTimeout(() => {
              sendMessage(`42["join", "match_${item.match_id}"]`);
            }, 1000);

            nextSuscribedMatches.push(item.match_id);
          }
        });

        if (setSubscribedMatches) {
          setSubscribedMatches(nextSuscribedMatches);
        }
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (fallback?.upcomingMatches) {
      setUpcomingMatches(fallback?.upcomingMatches);
    }
  }, [fallback?.upcomingMatches]);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Upcoming Matches</title>
      </Head>
      <Layout>
        <Upcoming upcomingMatches={upcomingMatches} score={score} />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const { res: upcomingMatches } = await getUpcomingMatches();
  const { res: score } = await getScore();

  return {
    props: {
      fallback: {
        upcomingMatches: upcomingMatches,
        score: score.data,
      },
    },
  };
}
