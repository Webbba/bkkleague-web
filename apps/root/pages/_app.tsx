import { useCallback, useEffect, useContext, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SwrConfig, getSeason } from 'api';
import {
  DefaultStyles,
  HeaderContext as HeaderContextProvider,
  AnimationContext as AnimationContextProvider,
} from 'base-components';
import { HeaderContext } from 'base-components/context/header-context';
import { AnimationContext } from 'base-components/context/animation-context';
import HeaderLogo from './assets/logo.png';
import Image from 'next/image';

import './base.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { setSeason } = useContext(HeaderContext);
  const { animationRequested, setAnimationRequested } =
    useContext(AnimationContext);

  const { events } = useRouter();

  const getSeasonAction = useCallback(async () => {
    const { res } = await getSeason();

    if (res && !res.error && setSeason) {
      setSeason(res[0]);
    }
  }, []);

  useEffect(() => {
    getSeasonAction();
  }, []);

  return (
    <div className="wrapper" id="wrapper">
      <div className={`loader-wrapper ${animationRequested ? 'show' : ''}`}>
        <div className={`loader-left ${animationRequested ? 'show' : ''}`}>
          <div className="text">
            <Image src={HeaderLogo} alt="Logo" className="logo-image" />
          </div>
        </div>
        <div className={`loader-right ${animationRequested ? 'show' : ''}`}>
          <div className="text">
            <Image src={HeaderLogo} alt="Logo" className="logo-image" />
          </div>
        </div>
      </div>
      <Component {...pageProps} />;
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SwrConfig fallback={pageProps.fallback}>
      <DefaultStyles />
      <HeaderContextProvider>
        <AnimationContextProvider>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <AppContent pageProps={pageProps} Component={Component} />
        </AnimationContextProvider>
      </HeaderContextProvider>
    </SwrConfig>
  );
}
