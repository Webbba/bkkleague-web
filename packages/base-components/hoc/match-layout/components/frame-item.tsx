import { Frame as FrameProps } from '../../../types';
import IconStar from '../../icons/star';
// import IconBreak from '../../icons/break';

import cn from './match.module.css';

export default function FrameItem({
  frame,
  homeTeamId,
  awayTeamId,
  framesLength,
}: {
  frame?: FrameProps;
  homeTeamId: number;
  awayTeamId: number;
  framesLength?: number;
}) {
  return (
    <div className={`${cn.frame} ${framesLength === 4 ? cn.fullHeight : ''}`}>
      <div className={cn.frameLeft}>
        <div className={cn.breakWrapper}>
          <IconStar />
        </div>
        <div className={cn.playersWrapper}>
          {frame?.players?.home
            ?.map((item) => item?.nickname || 'Guest')
            ?.join(' & ')}
        </div>
        <div className={cn.resultFameWrapper}>
          <div
            className={`${cn.resultFrame} ${cn.homeResult} ${frame?.winner.teamId === homeTeamId ? cn.winner : ''}`}
          >
            {frame?.winner.teamId === homeTeamId ? 'Win' : 'Lose'}
          </div>
        </div>
      </div>
      <div className={cn.frameRight}>
        <div className={cn.breakWrapper}>
          <IconStar />
        </div>
        <div className={cn.playersWrapper}>
          {frame?.players?.away
            ?.map((item) => item?.nickname || 'Guest')
            ?.join(' & ')}
        </div>
        <div className={cn.resultFameWrapper}>
          <div
            className={`${cn.resultFrame} ${cn.awayResult} ${frame?.winner.teamId === awayTeamId ? cn.winner : ''}`}
          >
            {frame?.winner.teamId === awayTeamId ? 'Win' : 'Lose'}
          </div>
        </div>
      </div>
    </div>
  );
}
