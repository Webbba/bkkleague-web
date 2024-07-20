import { useCallback, useEffect, useState, useContext } from 'react';
import { Layout } from 'base-components';
import { Upcoming } from 'upcoming-matches';
import { getScore, getUpcomingMatches } from 'api';
// import { useSocketIO } from 'react-use-websocket';
import { Match, Score } from 'upcoming-matches/hoc/types';

import Head from 'next/head';
import { SocketContext } from 'base-components/context/socket-context';

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

  // const { sendMessage, lastMessage } = useSocketIO(
  //   `${process.env.NEXT_PUBLIC_WSS_URL}`,
  //   {
  //     share: true,
  //     shouldReconnect: () => false,
  //     onOpen: () => {
  //       const todayMatches = fallback?.upcomingMatches?.filter((item) => {
  //         const date = new Date(item.date);
  //         date.setDate(date.getDate() + 1);

  //         return (
  //           new Date(date).toLocaleDateString() ===
  //           new Date().toLocaleDateString()
  //         );
  //       });

  //       if (todayMatches && todayMatches?.length > 0) {
  //         todayMatches.forEach((item) => {
  //           setTimeout(() => {
  //             sendMessage(`42["join", "match_${item.match_id}"]`);
  //           }, 1000);
  //         });
  //         if (setSubscribedMatches) {
  //           setSubscribedMatches(todayMatches?.map((item) => item.match_id));
  //         }
  //       }
  //       if (setIsConnected) {
  //         setIsConnected(true);
  //       }
  //     },
  //     onMessage: async () => {},
  //     retryOnError: true,
  //     reconnectAttempts: 1000,
  //     reconnectInterval: () => 3000,
  //   },
  //   true,
  // );

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

  // useEffect(() => {
  //   console.log(lastMessage);
  // }, [lastMessage]);

  useEffect(() => {
    if (fallback?.score) {
      setScore(fallback?.score);

      setTimeout(() => {
        getScoreAction();
      }, 60000);
    }
  }, [fallback?.score]);

  useEffect(() => {
    if (isConnected) {
      const nextSuscribedMatches = ([] as number[]).concat(
        subscribedMatches as number[],
      );

      const todayMatches = fallback?.upcomingMatches?.filter((item) => {
        const date = new Date(item.date);
        date.setDate(date.getDate() + 1);
        return (
          new Date(date).toLocaleDateString() ===
          new Date().toLocaleDateString()
        );
      });

      // if (todayMatches && todayMatches?.length > 0) {
      //   todayMatches.forEach((item) => {
      //     if (!nextSuscribedMatches.find((match) => match === item.match_id)) {
      //       setTimeout(() => {
      //         sendMessage(`42["join", "match_${item.match_id}"]`);
      //       }, 1000);

      //       nextSuscribedMatches.push(item.match_id);
      //     }
      //   });

      //   if (setSubscribedMatches) {
      //     setSubscribedMatches(nextSuscribedMatches);
      //   }
      // }
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
