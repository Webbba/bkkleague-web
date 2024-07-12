import { getSeason } from 'api';
import { getMatches } from 'api/hooks/use-matches';
import { Layout } from 'base-components';
import Head from 'next/head';
import { Completed as CompletedMatches } from 'completed-matches';
import { Match } from 'upcoming-matches/hoc/types';

export default function Missed({
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
        <title>Bangkok pool league | Missed Matches</title>
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
    const { res: matches } = await getMatches(season[0]?.id.toString());

    if (matches) {
      const missedMatches = matches?.data
        ?.map((item: any) => ({
          date: item.date,
          matches: item?.matches?.filter(
            (match: any) =>
              match.match_status_id === 3 &&
              !match.away_points &&
              !match.away_frames &&
              !match.home_frames &&
              !match.home_points,
          ),
        }))
        ?.filter((item: any) => item?.matches?.length);

      props = {
        ...props,
        fallback: {
          matches: missedMatches,
        },
      };
    }
  }

  return {
    props,
  };
}
