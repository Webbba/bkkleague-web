import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Match as MatchProps } from '../hoc/types';
import { useEffect, useRef, useState } from 'react';
import { AnimationContext } from 'base-components/context/animation-context';

import cn from './matches.module.css';

export default function Match({ match: matchItem }: { match?: MatchProps }) {
  const [match, setMatch] = useState<MatchProps | undefined>(undefined);
  const elementRef = useRef<HTMLAnchorElement | null>(null);

  const { setAnimationRequested } = useContext(AnimationContext);

  const { push } = useRouter();

  const homeLogo = match?.home_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${match?.home_logo}`
    : '';

  const awayLogo = match?.away_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${match?.away_logo}`
    : '';

  useEffect(() => {
    if (matchItem) {
      setMatch(matchItem);
    }
  }, [matchItem]);

  return (
    <Link
      href={`/matches/${match?.match_id}/completed`}
      className={cn.match}
      ref={elementRef}
      onClick={(e) => {
        e.preventDefault();

        if (setAnimationRequested) {
          setAnimationRequested(true);

          setTimeout(() => {
            push(`/matches/${match?.match_id}/completed`);
          }, 500);
        }
      }}
    >
      <div className={cn.matchTop}>
        <div className={`${cn.matchPlayer} ${cn.matchPlayerTop}`}>
          {match?.home_team_short_name}
        </div>
        <div className={cn.separator} />
        <div className={`${cn.matchPlayer} ${cn.matchPlayerBottom}`}>
          {match?.away_team_short_name}
        </div>
      </div>
      <div className={cn.matchScoreWrapper}>
        <div className={`${cn.matchPlayerLogo} ${!homeLogo ? cn.empty : ''}`}>
          {homeLogo && <img src={homeLogo} className={cn.logoImage} />}
        </div>
        <div className={cn.matchScore}>
          {`${match?.home_frames || '0'} : ${match?.away_frames || '0'}`}
        </div>
        <div className={`${cn.matchPlayerLogo} ${!awayLogo ? cn.empty : ''}`}>
          {awayLogo && <img src={awayLogo} className={cn.logoImage} />}
        </div>
      </div>
    </Link>
  );
}
