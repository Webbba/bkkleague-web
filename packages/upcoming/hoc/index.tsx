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
    const dateOffset = new Date(item.date).getTimezoneOffset();
    const dateUTC = new Date(item.date).getTime() + dateOffset * 60 * 1000;
    const dateICT = dateUTC + 7 * 60 * 68 * 1000;

    return (
      new Date(dateICT).toLocaleDateString() === new Date().toLocaleDateString()
    );
  });

  const upcomingDaysMatches = upcomingMatches?.filter((item) => {
    const dateOffset = new Date(item.date).getTimezoneOffset();
    const dateUTC = new Date(item.date).getTime() + dateOffset * 60 * 1000;
    const dateICT = dateUTC + 7 * 60 * 68 * 1000;

    return (
      new Date(dateICT).toLocaleDateString() !== new Date().toLocaleDateString()
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
          const currentDateOffset = new Date(item.date).getTimezoneOffset();
          const dateUTC =
            new Date(item.date).getTime() + currentDateOffset * 60 * 1000;
          const dateICT = new Date(dateUTC + 7 * 60 * 68 * 1000);

          const groupedUpcomingMatches = groupBy(
            item.matches,
            ({ date }: { date: string }) => date,
          );

          return (
            <div className={cn.matchWrapper} key={`${item.date}-${index}`}>
              {(!nextUpcomingMatches[index - 1] ||
                (nextUpcomingMatches[index - 1] &&
                  months[dateICT.getMonth()] !==
                    months[
                      new Date(nextUpcomingMatches[index - 1]?.date).getMonth()
                    ])) && (
                <div className={cn.matchDate}>
                  {`${months[dateICT.getMonth()]} ${dateICT.getFullYear()}`}
                </div>
              )}
              {Object.keys(groupedUpcomingMatches).map((group) => {
                const dateOffset = new Date(
                  groupedUpcomingMatches[group][0].date,
                ).getTimezoneOffset();
                const dateUTC =
                  new Date(groupedUpcomingMatches[group][0].date).getTime() +
                  dateOffset * 60 * 1000;
                const dateICT = new Date(dateUTC + 7 * 60 * 68 * 1000);

                return (
                  <div
                    key={`group-${group.split(':').join('-').split('.').join('-')}`}
                  >
                    <div className={cn.upcomingMatchesTitle}>
                      {`${weekday[dateICT.getDay()]} (${months[dateICT.getMonth()]} ${dateICT.getDate()}${daySuffix(dateICT.getDate())})`}
                    </div>
                    <div className={cn.upcomingMatchesWrapper}>
                      {groupedUpcomingMatches[group]?.map(
                        (item: MatchProps) => (
                          <Match
                            key={item.match_id}
                            match={item}
                            score={score?.find(
                              (score) => item.match_id === score.id,
                            )}
                          />
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
