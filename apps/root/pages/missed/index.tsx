import { getMissedMatches } from 'api/hooks/use-matches';
import { Layout } from 'base-components';
import Head from 'next/head';
import { Match } from 'upcoming-matches/hoc/types';
import { MissedMatches } from 'completed-matches';

export default function Missed({
  fallback,
}: {
  fallback?: {
    missedMatches: Match[];
  };
}) {
  return (
    <>
      <Head>
        <title>Bangkok pool league | Missed Matches</title>
      </Head>
      <Layout>
        <MissedMatches matches={fallback?.missedMatches} />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  let props: any = {};

  const { res: missedMatchesResponse } = await getMissedMatches();

  if (missedMatchesResponse) {
    props = {
      ...props,
      fallback: {
        missedMatches: missedMatchesResponse.data,
      },
    };
  }

  return {
    props,
  };
}
