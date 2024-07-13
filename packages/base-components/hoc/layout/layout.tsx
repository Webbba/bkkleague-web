import { useContext, useState } from 'react';
import Image from 'next/image';

import Header from '../header/header';
import HeaderLogo from '../header/assets/logo-black.png';
import { HeaderContext } from '../../context/header-context';
import { useRouter } from 'next/router';
import { AnimationContext } from '../../context/animation-context';

import cn from './layout.module.css';

export default function BaseLayout({ children }: { children?: JSX.Element }) {
  const [isContentLoading, setIsContentLoading] = useState(false);

  const { season } = useContext(HeaderContext);
  const { animationRequested } = useContext(AnimationContext);

  const { events } = useRouter();

  events?.on('routeChangeStart', () => {
    if (!animationRequested) {
      setIsContentLoading(true);
    }
  });

  events?.on('routeChangeComplete', () => {
    if (!animationRequested) {
      setIsContentLoading(false);
    }
  });

  let content;

  if (isContentLoading) {
    content = (
      <div className={cn.contentLoader}>
        <Image src={HeaderLogo} alt="logo-image" />
      </div>
    );
  } else {
    content = children;
  }

  return (
    <div id="base-layout">
      <Header season={season} />

      {content}
    </div>
  );
}
