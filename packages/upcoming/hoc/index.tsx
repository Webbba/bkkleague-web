import groupBy from 'lodash.groupby';
import TodayMatches from '../components/today-matches';
import Match from '../components/match';

import months from '../helpers/months';
import weekday from '../helpers/week-day';
import daySuffix from '../helpers/day-suffix';

import { Match as MatchProps, Score } from './types';

import cn from './upcoming.module.css';

export default function UpcomingMatches({
  upcomingMatches,
  score,
}: {
  upcomingMatches?: MatchProps[];
  score?: Score[];
}) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todayMatches = upcomingMatches?.filter(
    (item) =>
      new Date(item.date).toLocaleDateString() ===
      new Date().toLocaleDateString(),
  );

  const upcomingDaysMatches = upcomingMatches?.filter(
    (item) =>
      new Date(item.date).toLocaleDateString() !==
      new Date().toLocaleDateString(),
  );

  const groupedMatches = groupBy(
    upcomingDaysMatches,
    ({ date }: { date: string }) => date,
  );

  return (
    <div className={cn.upcomingWrapper}>
      <div className={cn.currentDate}>
        {`${months[currentMonth]} ${currentYear}`}
      </div>
      {todayMatches && todayMatches.length > 0 && (
        <TodayMatches matches={todayMatches} score={score} />
      )}
      <div
        className={`${cn.otherUpcomingMatches} ${!todayMatches?.length ? cn.withoutPadding : ''}`}
      >
        {Object.keys(groupedMatches).map((group) => {
          return (
            <div
              key={`group-${group.split(':').join('-').split('.').join('-')}`}
            >
              <div className={cn.upcomingMatchesTitle}>
                {`${weekday[new Date(groupedMatches[group][0].date).getDay()]} (${months[new Date(groupedMatches[group][0].date).getMonth()]} ${new Date(groupedMatches[group][0].date).getDate()}${daySuffix(new Date(groupedMatches[group][0].date).getDate())})`}
              </div>
              <div className={cn.upcomingMatchesWrapper}>
                {groupedMatches[group]?.map((item: MatchProps) => (
                  <Match key={item.match_id} match={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
