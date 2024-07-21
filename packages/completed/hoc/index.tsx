import groupBy from 'lodash.groupby';
import { Match as MatchProps } from './types';
import months from '../helpers/months';
import weekday from '../helpers/week-day';
import daySuffix from '../helpers/day-suffix';

import Match from '../components/match';

import cn from './completed.module.css';

export default function Matches({
  matches,
}: {
  matches?: { date: string; matches: MatchProps[] }[];
}) {
  let content;

  if (matches && matches.length > 0) {
    content = matches?.map((item, index) => {
      const currentDateOffset = new Date(item.date).getTimezoneOffset();
      const dateUTC =
        new Date(item.date).getTime() + currentDateOffset * 60 * 1000;
      const dateICT = new Date(dateUTC + 7 * 60 * 68 * 1000);

      const groupedMatches = groupBy(
        item.matches,
        ({ date }: { date: string }) => date,
      );

      return (
        <div className={cn.matchWrapper} key={`${item.date}-${index}`}>
          {(!matches[index - 1] ||
            (matches[index - 1] &&
              months[dateICT.getMonth()] !==
                months[new Date(matches[index - 1]?.date).getMonth()])) && (
            <div className={cn.matchDate}>
              {`${months[dateICT.getMonth()]} ${dateICT.getFullYear()}`}
            </div>
          )}
          {Object.keys(groupedMatches).map((group) => {
            const dateOffset = new Date(
              groupedMatches[group][0].date,
            ).getTimezoneOffset();
            const dateUTC =
              new Date(groupedMatches[group][0].date).getTime() +
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
                  {groupedMatches[group]?.map((item: MatchProps) => (
                    <Match key={item.match_id} match={item} />
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
