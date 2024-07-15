import { useEffect, useState } from 'react';
import { getMatch, getFrames } from 'api';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { MatchLayout } from 'base-components';
import { Frame } from 'base-components/types';

const isOdd = (num: number) => {
  return num % 2;
};

export default function Playing({
  fallback,
}: {
  fallback?: {
    frames: {
      firstBreak: string;
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
        frames={frames}
        currentMatch={fallback?.match}
        framePage={framePage}
        setFramePage={setFramePage}
        playing
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
