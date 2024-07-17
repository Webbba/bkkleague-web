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

  const todayMatches = upcomingMatches?.filter((item) => {
    const date = new Date(item.date);
    date.setDate(date.getDate() + 1);

    return (
      new Date(date).toLocaleDateString() === new Date().toLocaleDateString()
    );
  });

  const upcomingDaysMatches = upcomingMatches?.filter((item) => {
    const date = new Date(item.date);
    date.setDate(date.getDate() + 1);

    return (
      new Date(date).toLocaleDateString() !== new Date().toLocaleDateString()
    );
  });

  const groupedMatches = groupBy(
    upcomingDaysMatches,
    ({ date }: { date: string }) => date,
  );

  const nextUpcomingMatches: {
    date: string;
    matches: MatchProps[];
  }[] = [];

  Object.keys(groupedMatches).forEach((group) => {
    nextUpcomingMatches.push({
      date: group,
      matches: groupedMatches[group],
    });
  });

  return (
    <div className={cn.upcomingWrapper}>
      {todayMatches && todayMatches.length > 0 && (
        <>
          <div className={cn.currentDate}>
            {`${months[currentMonth]} ${currentYear}`}
          </div>
          <TodayMatches matches={todayMatches} score={score} />
        </>
      )}
      <div
        className={`${cn.otherUpcomingMatches} ${!todayMatches?.length ? cn.withoutPadding : ''}`}
      >
        {nextUpcomingMatches?.map((item, index) => {
          const currentDate = new Date(item.date);

          const groupedUpcomingMatches = groupBy(
            item.matches,
            ({ date }: { date: string }) => date,
          );

          return (
            <div className={cn.matchWrapper} key={`${item.date}-${index}`}>
              {(!nextUpcomingMatches[index - 1] ||
                (nextUpcomingMatches[index - 1] &&
                  months[currentDate.getMonth()] !==
                    months[
                      new Date(nextUpcomingMatches[index - 1]?.date).getMonth()
                    ])) && (
                <div className={cn.matchDate}>
                  {`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                </div>
              )}
              {Object.keys(groupedUpcomingMatches).map((group) => {
                const date = new Date(groupedUpcomingMatches[group][0].date);
                date.setDate(date.getDate() + 1);

                return (
                  <div
                    key={`group-${group.split(':').join('-').split('.').join('-')}`}
                  >
                    <div className={cn.upcomingMatchesTitle}>
                      {`${weekday[date.getDay()]} (${months[date.getMonth()]} ${date.getDate()}${daySuffix(date.getDate())})`}
                    </div>
                    <div className={cn.upcomingMatchesWrapper}>
                      {groupedUpcomingMatches[group]?.map(
                        (item: MatchProps) => (
                          <Match key={item.match_id} match={item} />
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
