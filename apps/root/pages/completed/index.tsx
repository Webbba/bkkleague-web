import { Layout } from 'base-components';
import Head from 'next/head';
import { Match } from 'upcoming-matches/hoc/types';
import { getSeason, getCompletedMatches } from 'api';
import { Completed as CompletedMatches } from 'completed-matches';

export default function Completed({
  fallback,
}: {
  fallback?: {
    matches: {
      date: string;
      matches: Match[];
    }[];
  };
}) {
  return (
    <>
      <Head>
        <title>Bangkok pool league | Completed Matches</title>
      </Head>
      <Layout>
        <CompletedMatches matches={fallback?.matches} />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  let props: any = {};

  const { res: season } = await getSeason();

  if (season && season.length) {
    const { res: completedMatchesResponse } = await getCompletedMatches();

    if (completedMatchesResponse) {
      props = {
        ...props,
        fallback: {
          matches: completedMatchesResponse,
        },
      };
    }
  }

  return {
    props,
  };
}
