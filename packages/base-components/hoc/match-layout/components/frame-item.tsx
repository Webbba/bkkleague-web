import { Frame as FrameProps } from '../../../types';
import IconStar from '../../icons/star';
import IconBreak from '../../icons/break';

import cn from './match.module.css';

export default function FrameItem({
  frame,
  awayTeamId,
  homeTeamId,
  framesLength,
  playing,
  currentFrame,
}: {
  frame?: FrameProps;
  homeTeamId: number;
  awayTeamId: number;
  framesLength?: number;
  playing?: boolean;
  currentFrame?: boolean;
}) {
  return (
    <div
      className={`${cn.frame} ${framesLength === 4 ? cn.fullHeight : ''} ${playing && currentFrame ? cn.currentFrame : ''}`}
    >
      <div className={cn.frameLeft}>
        <div className={cn.breakWrapper}>
          {frame?.homeTeamBreak ? (
            <IconBreak id={`home-${frame.frameNumber}`} />
          ) : (
            <IconStar />
          )}
        </div>
        <div
          className={`${cn.playersWrapper} ${frame?.players?.home && frame?.players?.home?.length === 1 ? cn.bigFontSize : ''}  ${frame?.players?.home && frame?.players?.home?.length > 1 ? cn.whiteSpace : ''}`}
        >
          <span>
            {frame?.players?.home
              ?.map((item) => item?.nickname || 'Guest')
              ?.join(' & ')}
            {(!frame?.players?.home || !frame?.players?.home.length) &&
              'Waiting Player'}
          </span>
        </div>
        {frame?.winner && (
          <div className={cn.resultFameWrapper}>
            <div
              className={`${cn.resultFrame} ${cn.homeResult} ${frame?.winner?.teamId === homeTeamId ? cn.winner : ''}`}
            >
              {frame?.winner?.teamId === homeTeamId ? 'Win' : 'Lose'}
            </div>
          </div>
        )}
        {!frame?.winner && <div className={cn.versus}>V</div>}
      </div>
      <div className={cn.frameRight}>
        <div className={cn.breakWrapper}>
          {frame?.awayTeamBreak ? (
            <IconBreak id={`away-${frame.frameNumber}`} />
          ) : (
            <IconStar />
          )}
        </div>
        <div
          className={`${cn.playersWrapper} ${frame?.players?.away && frame?.players?.away?.length === 1 ? cn.bigFontSize : ''} ${frame?.players?.away && frame?.players?.away?.length > 1 ? cn.whiteSpace : ''}`}
        >
          <span>
            {frame?.players?.away
              ?.map((item) => item?.nickname || 'Guest')
              ?.join(' & ')}
            {(!frame?.players?.away || !frame?.players?.away.length) &&
              'Waiting Player'}
          </span>
        </div>
        {frame?.winner && (
          <div className={cn.resultFameWrapper}>
            <div
              className={`${cn.resultFrame} ${cn.awayResult} ${frame?.winner?.teamId === awayTeamId ? cn.winner : ''}`}
            >
              {frame?.winner?.teamId === awayTeamId ? 'Win' : 'Lose'}
            </div>
          </div>
        )}
        {!frame?.winner && (
          <div className={`${cn.versus} ${cn.versusLeft}`}>S</div>
        )}
      </div>
    </div>
  );
}
