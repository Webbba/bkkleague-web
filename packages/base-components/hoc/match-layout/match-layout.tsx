import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconFullScreen from '../icons/fullscreen';
import IconArrowLeft from '../icons/arrow-left';
import IconHint from '../icons/hint';
import { BestPlayer, Frame, TeamStats } from '../../types';
import { AnimationContext } from '../../context/animation-context';
import Waiting from './components/waiting';
import Completed from './components/completed';

import cn from './match-layout.module.css';

export default function MatchLayout({
  currentMatch,
  homeTeamStats,
  awayTeamStats,
  awayTeamBestPlayer,
  homeTeamBestPlayer,
  completed,
  frames,
  framePage,
  setFramePage,
  playing,
  missed,
  gameType,
}: {
  currentMatch?: any;
  homeTeamStats?: TeamStats;
  awayTeamStats?: TeamStats;
  awayTeamBestPlayer?: BestPlayer;
  homeTeamBestPlayer?: BestPlayer;
  completed?: boolean;
  playing?: boolean;
  frames?: {
    frameData?: Frame[];
    teams?: {
      home: any;
      away: any;
    };
  };
  framePage?: number;
  setFramePage?: (data: number) => void;
  missed?: boolean;
  gameType?: string;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const router = useRouter();

  const { setAnimationRequested } = useContext(AnimationContext);

  const onOpenFullScreen = () => {
    setFullscreen(true);

    document.documentElement.requestFullscreen();
  };

  const onCloseFullScreen = () => {
    setFullscreen(false);
    if ((document as any).exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  };

  const onFullScreenButtonClick = () => {
    if ((!window.screenTop && !window.screenY) || fullscreen) {
      onCloseFullScreen();
    } else {
      onOpenFullScreen();
    }
  };

  return (
    <div className={cn.matchLayout}>
      <div
        className={`${cn.matchHeader} ${!currentMatch ? cn.withBorder : ''}`}
      >
        <button
          type="button"
          className={cn.backButton}
          onClick={() => {
            if (setAnimationRequested) {
              setAnimationRequested(true);
            }

            let url = '/upcoming';

            if (completed) {
              url = '/completed';
            } else if (missed) {
              url = '/missed';
            }

            setTimeout(() => {
              router.push(url);
            }, 1500);
          }}
        >
          <IconArrowLeft />
        </button>

        <div className={cn.matchHeaderTitle}>
          {!currentMatch && !playing && !missed && 'Starting soon'}
          {currentMatch && completed && 'Finished'}
          {playing && 'Match in Progress'}
          {missed && 'Match Missed'}
        </div>

        <button
          type="button"
          aria-label="Full Screen Button"
          onClick={onFullScreenButtonClick}
          className={cn.fullscreenButton}
        >
          <IconFullScreen />
        </button>
      </div>
      {!currentMatch && !playing && !missed && (
        <div className={cn.matchStartingHintWrapper}>
          <div className={cn.matchStartingHint}>
            <div className={cn.matchStartingHintIconWrapper}>
              <IconHint />
            </div>
            Match will start automaticaly, then Captains pick 1st players
          </div>
        </div>
      )}
      {!currentMatch && !playing && (
        <Waiting
          homeTeamStats={homeTeamStats}
          awayTeamStats={awayTeamStats}
          awayTeamBestPlayer={awayTeamBestPlayer}
          homeTeamBestPlayer={homeTeamBestPlayer}
          frames={frames}
          missed={missed}
        />
      )}
      {((currentMatch && (completed || missed)) || playing) && (
        <Completed
          frames={frames}
          framePage={framePage}
          setFramePage={setFramePage}
          playing={playing}
          gameType={gameType}
        />
      )}
    </div>
  );
}
