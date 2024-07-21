import groupBy from 'lodash.groupby';
import Match from '../components/match';
import months from '../helpers/months';
import weekday from '../helpers/week-day';
import daySuffix from '../helpers/day-suffix';

import { Match as MatchProps } from './types';

import cn from './completed.module.css';

export default function MissedMatches({ matches }: { matches?: MatchProps[] }) {
  const groupedMatches = groupBy(matches, ({ date }: { date: string }) => date);

  const nextMatches: {
    date: string;
    matches: MatchProps[];
  }[] = [];

  Object.keys(groupedMatches).forEach((group) => {
    nextMatches.push({
      date: group,
      matches: groupedMatches[group],
    });
  });

  let content;

  if (nextMatches && nextMatches.length > 0) {
    content = nextMatches?.map((item, index) => {
      const currentDateOffset = new Date(item.date).getTimezoneOffset();
      const dateUTC =
        new Date(item.date).getTime() + currentDateOffset * 60 * 1000;
      const dateICT = new Date(dateUTC + 7 * 60 * 68 * 1000);

      const groupedMissedMatches = groupBy(
        item.matches,
        ({ date }: { date: string }) => date,
      );

      return (
        <div className={cn.matchWrapper} key={`${item.date}-${index}`}>
          {(!nextMatches[index - 1] ||
            (nextMatches[index - 1] &&
              months[dateICT.getMonth()] !==
                months[new Date(nextMatches[index - 1]?.date).getMonth()])) && (
            <div className={cn.matchDate}>
              {`${months[dateICT.getMonth()]} ${dateICT.getFullYear()}`}
            </div>
          )}
          {Object.keys(groupedMissedMatches).map((group) => {
            const dateOffset = new Date(
              groupedMissedMatches[group][0].date,
            ).getTimezoneOffset();
            const dateUTC =
              new Date(groupedMissedMatches[group][0].date).getTime() +
              dateOffset * 60 * 1000;
            const dateICT = new Date(dateUTC + 7 * 60 * 68 * 1000);

            return (
              <div
                key={`group-${group.split(':').join('-').split('.').join('-')}`}
              >
                <div className={cn.matchesTitle}>
                  {`${weekday[dateICT.getDay()]} (${months[dateICT.getMonth()]} ${dateICT.getDate()}${daySuffix(dateICT.getDate())})`}
                </div>
                <div className={cn.matchesWrapper}>
                  {groupedMissedMatches[group]?.map((item: MatchProps) => (
                    <Match key={item.id} match={item} missed />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  } else {
    content = <div className={cn.empty}>No Matches yet</div>;
  }

  return <div className={cn.completedWrapper}>{content}</div>;
}
