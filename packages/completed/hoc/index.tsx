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
      const currentDate = new Date(item.date);

      const groupedMatches = groupBy(
        item.matches,
        ({ date }: { date: string }) => date,
      );

      return (
        <div className={cn.matchWrapper} key={`${item.date}-${index}`}>
          {(!matches[index - 1] ||
            (matches[index - 1] &&
              months[currentDate.getMonth()] !==
                months[new Date(matches[index - 1]?.date).getMonth()])) && (
            <div className={cn.matchDate}>
              {`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </div>
          )}
          {Object.keys(groupedMatches).map((group) => {
            const date = new Date(groupedMatches[group][0].date);

            return (
              <div
                key={`group-${group.split(':').join('-').split('.').join('-')}`}
              >
                <div className={cn.matchesTitle}>
                  {`${weekday[date.getDay()]} (${months[date.getMonth()]} ${date.getDate()}${daySuffix(date.getDate())})`}
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
