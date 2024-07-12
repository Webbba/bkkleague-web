import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IconFullScreen from '../icons/fullscreen';
import IconUpcoming from '../icons/upcoming';
import IconCompleted from '../icons/completed';
import IconMissed from '../icons/missed';
import { Season } from '../../types';
import HeaderLogo from './assets/logo.png';

import cn from './header.module.css';
import Image from 'next/image';

export default function Header({ season }: { season?: Season | null }) {
  const [fullscreen, setFullscreen] = useState(false);
  const router = useRouter();

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
    <div className={cn.headerWrapper}>
      <div className={cn.header}>
        <div className={cn.headerLeft}>
          <Image src={HeaderLogo} alt="Logo" />
        </div>
        <div className={cn.headerRight}>
          <div className={cn.headerRightSeason}>{season?.short_name}</div>
          <button
            type="button"
            aria-label="Full Screen Button"
            onClick={onFullScreenButtonClick}
          >
            <IconFullScreen />
          </button>
        </div>
      </div>
      <div className={cn.tabs}>
        <Link
          href="/upcoming"
          className={`${cn.headerLink} ${
            router.pathname.includes('upcoming') ? cn.headerLinkActive : ''
          }`}
        >
          <div className={cn.linkIconWrapper}>
            <IconUpcoming />
          </div>
          <div className={cn.linkIconText}>Upcoming</div>
        </Link>
        <Link
          href="/completed"
          className={`${cn.headerLink} ${
            router.pathname.includes('completed') ? cn.headerLinkActive : ''
          }`}
        >
          <div className={cn.linkIconWrapper}>
            <IconCompleted />
          </div>
          <div className={cn.linkIconText}>Completed</div>
        </Link>
        <Link
          href="/missed"
          className={`${cn.headerLink} ${
            router.pathname.includes('missed') ? cn.headerLinkActive : ''
          }`}
        >
          <div className={cn.linkIconWrapper}>
            <IconMissed />
          </div>
          <div className={cn.linkIconText}>Missed mathces</div>
        </Link>
      </div>
    </div>
  );
}
