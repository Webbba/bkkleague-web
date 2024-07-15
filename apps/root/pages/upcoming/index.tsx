import { useCallback, useEffect, useState } from 'react';
import { Layout } from 'base-components';
import { Upcoming } from 'upcoming-matches';
import { getScore, getUpcomingMatches } from 'api';
import { Match, Score } from 'upcoming-matches/hoc/types';

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
  const [score, setScore] = useState<Score[]>([]);

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
    if (fallback?.score) {
      setScore(fallback?.score);

      setTimeout(() => {
        getScoreAction();
      }, 60000);
    }
  }, [fallback?.score]);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Upcoming Matches</title>
      </Head>
      <Layout>
        <Upcoming upcomingMatches={fallback?.upcomingMatches} score={score} />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const { res: upcomingMatches } = await getUpcomingMatches();
  const { res: score } = await getScore();

  // const currentDate = new Date();
  // currentDate.setHours(0);
  // currentDate.setMinutes(0);
  // currentDate.setSeconds(0);
  // currentDate.setMilliseconds(0);

  // const formatted = upcomingMatches?.filter((item: any) => {
  //   const itemDate = new Date(item.date);
  //   itemDate.setHours(0);
  //   itemDate.setMinutes(0);
  //   itemDate.setSeconds(0);
  //   itemDate.setMilliseconds(0);

  //   return itemDate.getTime() >= currentDate.getTime();
  // });

  return {
    props: {
      fallback: {
        upcomingMatches: upcomingMatches,
        score: score.data,
      },
    },
  };
}
