import { useContext, useState } from 'react';
import { getMatch, getFrames, getTeam } from 'api';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { MatchLayout } from 'base-components';
import { Frame } from 'base-components/types';

export default function Completed({
  fallback,
}: {
  fallback?: {
    frames: {
      frameData: Frame[];
      teams: {
        home: any;
        away: any;
      };
    };
    match: any;
  };
}) {
  const [framePage, setFramePage] = useState(0);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Match</title>
      </Head>
      <MatchLayout
        frames={fallback?.frames}
        currentMatch={fallback?.match}
        framePage={framePage}
        setFramePage={setFramePage}
        completed
      />
    </>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { res: frames } = await getFrames(query?.id as string);
  const { res: match } = await getMatch(query?.id as string);

  return {
    props: {
      fallback: {
        frames: frames.data,
        match: match.data,
      },
    },
  };
}
