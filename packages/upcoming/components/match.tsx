import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimationContext } from 'base-components/context/animation-context';
import { Match as MatchProps, Score } from '../hoc/types';

import cn from './upcoming.module.css';

export default function Match({
  match: matchItem,
  score,
  current,
}: {
  match?: MatchProps;
  score?: Score;
  current?: boolean;
}) {
  const [match, setMatch] = useState<MatchProps | undefined>(undefined);
  const elementRef = useRef<HTMLAnchorElement | null>(null);

  const { setAnimationRequested } = useContext(AnimationContext);

  const { push } = useRouter();

  useEffect(() => {
    if (matchItem) {
      setMatch(matchItem);
    }
  }, [matchItem]);

  const homeLogo = match?.home_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${match?.home_logo}`
    : '';

  const awayLogo = match?.away_logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${match?.away_logo}`
    : '';

  return (
    <Link
      href={`/matches/${match?.match_id}/${current ? 'playing' : 'waiting'}?homeTeam=${match?.home_team_id}&awayTeam=${match?.away_team_id}`}
      className={cn.match}
      ref={elementRef}
      onClick={(e) => {
        e.preventDefault();

        if (setAnimationRequested) {
          setAnimationRequested(true);

          setTimeout(() => {
            push(
              `/matches/${match?.match_id}/${current ? 'playing' : 'waiting'}?homeTeam=${match?.home_team_id}&awayTeam=${match?.away_team_id}`,
            );
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
          {score ? `${score?.homeScore} - ${score?.awayScore}` : '0 - 0'}
        </div>
        <div className={`${cn.matchPlayerLogo} ${!awayLogo ? cn.empty : ''}`}>
          {awayLogo && <img src={awayLogo} className={cn.logoImage} />}
        </div>
      </div>
    </Link>
  );
}
