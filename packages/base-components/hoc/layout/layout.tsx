import { useContext, useState } from 'react';
import Image from 'next/image';

import Header from '../header/header';
import HeaderLogo from '../header/assets/logo.png';
import { HeaderContext } from '../../context/header-context';
import { useRouter } from 'next/router';
import { AnimationContext } from '../../context/animation-context';

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
      <div
        className="content-loader"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image
          src={HeaderLogo}
          alt="logo-image"
          style={{ backgroundColor: '#000' }}
        />
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
