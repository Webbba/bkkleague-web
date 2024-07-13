import { getMatch, getSeason, getFrames } from 'api';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { MatchLayout } from 'base-components';
import { Frame, TeamStats } from 'base-components/types';
import { useEffect, useState } from 'react';

const isOdd = (num: number) => {
  return num % 2;
};

export default function Waiting({
  fallback,
}: {
  fallback?: {
    match: any;
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
  const [framePage, setFramePage] = useState(0);
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

  useEffect(() => {
    if (fallback?.frames) {
      const nextFrames = { ...fallback.frames };

      const nextFramesMatches = nextFrames.frameData.map((item, index) => {
        const result = { ...item };

        if (fallback?.frames.firstBreak === 'home') {
          if (isOdd(index) === 0) {
            result.homeTeamBreak = true;
            result.awayTeamBreak = false;
          } else {
            result.awayTeamBreak = true;
            result.homeTeamBreak = false;
          }
        } else if (fallback?.frames.firstBreak === 'away') {
          if (isOdd(index) === 0) {
            result.awayTeamBreak = true;
            result.homeTeamBreak = false;
          } else {
            result.homeTeamBreak = true;
            result.awayTeamBreak = false;
          }
        }

        return result;
      });

      nextFrames.frameData = nextFramesMatches;

      setFrames(nextFrames);
    }
  }, [fallback?.frames]);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Match</title>
      </Head>
      <MatchLayout
        currentMatch={fallback?.match}
        frames={frames}
        framePage={framePage}
        setFramePage={setFramePage}
        missed
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
    props = {
      ...props,
      fallback: {
        ...props.fallback,
      },
    };
  }

  return {
    props,
  };
}
