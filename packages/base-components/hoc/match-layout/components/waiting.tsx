import IconVersus from '../../icons/versus';
import { BestPlayer, Frame, Match, TeamStats } from '../../../types';
import declination from '../helpers/declination';

import cn from './match.module.css';

export default function Waiting({
  homeTeamStats,
  awayTeamStats,
  awayTeamBestPlayer,
  homeTeamBestPlayer,
  frames,
  missed,
}: {
  homeTeamStats?: TeamStats;
  awayTeamStats?: TeamStats;
  awayTeamBestPlayer?: BestPlayer;
  homeTeamBestPlayer?: BestPlayer;
  missed?: boolean;
  frames?: {
    frameData: Frame[];
    teams?: {
      home: any;
      away: any;
    };
  };
}) {
  const homeLogo = frames?.teams?.home.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.home.logo}`
    : '';
  const awayLogo = frames?.teams?.away.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.away.logo}`
    : '';

  return (
    <>
      <div className={cn.matchTeams}>
        <IconVersus />
        <div className={cn.homeTeam}>
          {homeLogo === awayLogo || !homeLogo ? (
            <div className={cn.teamName}>
              {homeLogo && (
                <img
                  className={`${cn.teamLogo} ${cn.logoSmall}`}
                  src={homeLogo as string}
                  alt="Home team logo"
                />
              )}

              {frames?.teams?.home?.name}
            </div>
          ) : (
            <img
              className={cn.teamLogo}
              src={homeLogo as string}
              alt="Home team logo"
            />
          )}
        </div>
        <div className={cn.awayTeam}>
          {homeLogo === awayLogo || !awayLogo ? (
            <div className={cn.teamName}>
              {awayLogo && (
                <img
                  className={`${cn.teamLogo} ${cn.logoSmall}`}
                  src={awayLogo as string}
                  alt="Away team logo"
                />
              )}

              {frames?.teams?.away?.name}
            </div>
          ) : (
            <img
              className={cn.teamLogo}
              src={awayLogo as string}
              alt="Away team logo"
            />
          )}
        </div>
      </div>
      <div className={`${cn.stats} ${missed ? cn.missedStats : ''}`}>
        <div className={cn.statsItem}>
          <div className={cn.statsValue}>{homeTeamStats?.points || 'None'}</div>
          <div className={`${cn.statsValue} ${cn.statsTitle}`}>Points</div>
          <div className={cn.statsValue}>{awayTeamStats?.points || 'None'}</div>
        </div>
        <div className={cn.statsItem}>
          <div className={cn.statsValue}>
            {homeTeamStats?.wins && homeTeamStats?.losses
              ? `${homeTeamStats?.wins}/${homeTeamStats?.losses}`
              : 'None'}
          </div>
          <div className={`${cn.statsValue} ${cn.statsTitle}`}>Win/Lose</div>
          <div className={cn.statsValue}>
            {awayTeamStats?.wins && awayTeamStats?.losses
              ? `${awayTeamStats?.wins}/${awayTeamStats?.losses}`
              : 'None'}
          </div>
        </div>
        <div className={cn.statsItem}>
          <div className={cn.statsValue}>{homeTeamStats?.frames || 'None'}</div>
          <div className={`${cn.statsValue} ${cn.statsTitle}`}>Frames</div>
          <div className={cn.statsValue}>{awayTeamStats?.frames || 'None'}</div>
        </div>
        <div className={cn.statsItem}>
          <div className={cn.statsValue}>
            {homeTeamBestPlayer
              ? `${homeTeamBestPlayer?.nickname} - ${homeTeamBestPlayer?.points}${declination(Math.floor(homeTeamBestPlayer?.points as number), ['pt', 'pt', 'pts'])}`
              : 'None'}
          </div>
          <div className={`${cn.statsValue} ${cn.statsTitle}`}>Best Player</div>
          <div className={cn.statsValue}>
            {awayTeamBestPlayer
              ? `${awayTeamBestPlayer?.nickname} - ${awayTeamBestPlayer?.points}${declination(Math.floor(awayTeamBestPlayer?.points as number), ['pt', 'pt', 'pts'])}`
              : 'None'}
          </div>
        </div>
      </div>
    </>
  );
}
