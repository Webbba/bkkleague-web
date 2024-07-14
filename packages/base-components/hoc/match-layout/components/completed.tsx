import { useEffect, useState } from 'react';
import { Frame } from '../../../types';
import FrameItem from './frame-item';
import IconArrowLeft from '../../icons/arrow-left';

import cn from './match.module.css';

export default function Completed({
  frames,
  framePage,
  setFramePage,
}: {
  frames?: {
    firstBreak?: string;
    frameData: Frame[];
    teams: {
      home: any;
      away: any;
    };
  };
  framePage?: number;
  setFramePage?: (data: number) => void;
}) {
  const [currentFrames, setCurrentFrames] = useState<Frame[]>([]);

  useEffect(() => {
    if (frames && framePage !== undefined) {
      setCurrentFrames(
        frames?.frameData?.slice(
          framePage * 4,
          framePage == 0 ? 4 : framePage * 4 + 4,
        ),
      );
    }
  }, [framePage, frames]);

  const homeFrames =
    frames?.frameData?.filter(
      (item) => item.winner?.teamId === frames?.teams?.home?.id,
    )?.length || 0;
  const awayFrames =
    frames?.frameData?.filter(
      (item) => item.winner?.teamId === frames?.teams?.away?.id,
    )?.length || 0;

  const homeLogo = frames?.teams?.home.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.home.logo}`
    : '';
  const awayLogo = frames?.teams?.away.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.away.logo}`
    : '';

  return (
    <>
      <div className={`${cn.matchTeams} ${cn.completedMatchTeams}`}>
        <div className={cn.homeTeam}>
          {homeLogo === awayLogo || !homeLogo ? (
            <div className={cn.teamNameWrapper}>
              <div className={`${cn.teamName} ${cn.teamNameFlex}`}>
                {homeLogo && (
                  <img
                    className={`${cn.teamLogo}  ${cn.verySmallLogo}`}
                    src={homeLogo as string}
                    alt="Home team logo"
                  />
                )}

                <div>{frames?.teams?.home?.name}</div>
              </div>
            </div>
          ) : (
            <div className={cn.teamLogoWrapper}>
              <img
                className={cn.teamLogo}
                src={homeLogo as string}
                alt="Home team logo"
              />
            </div>
          )}
          <div className={cn.frames}>{homeFrames}</div>
        </div>
        <div className={cn.awayTeam}>
          {homeLogo === awayLogo || !awayLogo ? (
            <div className={cn.teamNameWrapper}>
              <div className={`${cn.teamName} ${cn.teamNameFlex}`}>
                <div>{frames?.teams?.away?.name}</div>
                {awayLogo && (
                  <img
                    className={`${cn.teamLogo}  ${cn.verySmallLogo}`}
                    src={awayLogo as string}
                    alt="Away team logo"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className={cn.teamLogoWrapper}>
              <img
                className={cn.teamLogo}
                src={awayLogo as string}
                alt="Away team logo"
              />
            </div>
          )}
          <div className={cn.frames}>{awayFrames}</div>
        </div>
      </div>
      <div className={cn.framesWrapper}>
        {currentFrames?.map((item, index) => (
          <FrameItem
            key={item.frameNumber}
            frame={item}
            homeTeamId={frames?.teams?.home?.id as number}
            awayTeamId={frames?.teams?.away?.id as number}
            framesLength={currentFrames?.length}
          />
        ))}
      </div>
      <div className={cn.framesPagination}>
        <button
          type="button"
          className={`${cn.pageButton} ${framePage === 0 ? cn.disabled : ''}`}
          onClick={() =>
            setFramePage && setFramePage((framePage as number) - 1)
          }
          disabled={framePage === 0}
        >
          <div className={cn.pageIconWrapper}>
            <IconArrowLeft width={40} height={40} />
          </div>
          <div className={cn.pageTextWrapper}>Previous page</div>
        </button>
        <div className={cn.framePages}>
          {`${framePage === 0 ? 1 : (framePage as number) * 4} - ${(framePage as number) * 4 + 4} from 20`}
        </div>
        <button
          type="button"
          className={`${cn.pageButton} ${framePage === 4 ? cn.disabled : ''} ${cn.nextButton}`}
          onClick={() =>
            setFramePage && setFramePage((framePage as number) + 1)
          }
          disabled={
            framePage === 4 ||
            !frames?.frameData?.slice((framePage as number) * 4 + 4).length
          }
        >
          <div className={cn.pageTextWrapper}> Next page</div>
          <div className={cn.pageIconWrapper}>
            <IconArrowLeft width={40} height={40} />
          </div>
        </button>
      </div>
    </>
  );
}
