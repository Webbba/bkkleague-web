import { useCallback, useEffect, useState } from 'react';
import { getTeam, getMatch } from 'api';

import Match from './match';
import months from '../helpers/months';
import daySuffix from '../helpers/day-suffix';

import { Match as MatchProps, Score } from '../hoc/types';

import cn from './upcoming.module.css';

export default function TodayMatches({
  matches,
  score,
}: {
  matches?: MatchProps[];
  score?: Score[];
}) {
  const [current, setCurrent] = useState<MatchProps[] | undefined>(undefined);
  const [upcoming, setUpcoming] = useState<MatchProps[] | undefined>(undefined);

  const getCurrentMatches = useCallback(() => {
    const currentMatches = matches?.filter((item) => item.inProgress);

    const filteredUpcoming = matches?.filter((item) =>
      currentMatches?.every((match) => item.match_id !== match.match_id),
    );

    setUpcoming(filteredUpcoming);
    setCurrent(currentMatches);
  }, []);

  useEffect(() => {
    if (matches && !upcoming) {
      getCurrentMatches();
    }
  }, [matches]);

  return (
    <div className={cn.todayMatches}>
      <div className={cn.todayMatchesDate}>
        {`Today (${months[new Date().getMonth()]} ${new Date().getDate()}${daySuffix(new Date().getDate())})`}
      </div>
      {current && current.length > 0 && (
        <>
          <div className={cn.matchTitle}>
            <span>Curent matches</span>
          </div>
          <div className={cn.matchesWrapper}>
            {current?.map((item) => (
              <Match
                key={item.match_id}
                match={item}
                score={score?.find((score) => item.match_id === score.id)}
                current
              />
            ))}
          </div>
        </>
      )}
      {upcoming && upcoming.length > 0 && (
        <>
          <div className={cn.matchTitle}>
            <span>Starting Soon</span>
          </div>
          <div className={cn.matchesWrapper}>
            {upcoming
              ?.filter((item) => item)
              ?.map((item) => (
                <Match
                  key={item.match_id}
                  score={score?.find((score) => item.match_id === score.id)}
                  match={item}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
