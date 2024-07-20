import { useCallback, useEffect, useContext, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SwrConfig, getSeason } from 'api';
import { useSocketIO } from 'react-use-websocket';
import {
  DefaultStyles,
  HeaderContext as HeaderContextProvider,
  AnimationContext as AnimationContextProvider,
  IconClose,
  IconPrize,
  SocketContext,
  PlayerWinnerContext as PlayerWinnerContextProvider,
  TeamWinnerContext as TeamWinnerContextProvider,
} from 'base-components';
import { HeaderContext } from 'base-components/context/header-context';
import { AnimationContext } from 'base-components/context/animation-context';
import { PlayerWinnerContext } from 'base-components/context/player-winner-context';
import { TeamWinnerContext } from 'base-components/context/team-winner-context';
import HeaderLogo from './assets/logo.png';
import { socket } from './socket';

import './base.css';

const phrases = [
  'Easy for',
  'Congratulations,',
  'Outstanding match,',
  'Tremendous,',
  'Splendid victory,',
  'Excellent performance,',
  'Job well done,',
  'And the winner is',
  'Phenomenal performance,',
  'Outstanding play,',
];

function AppContent({ Component, pageProps }: AppProps) {
  const { setSeason } = useContext(HeaderContext);
  const { animationRequested, setAnimationRequested } =
    useContext(AnimationContext);
  const [playerWinPopupVisible, setPlayerWinPopupVisible] = useState(false);
  const [teamWinPopupVisible, setTeamWinPopupVisible] = useState(false);
  const [phraseNumber, setPhraseNumber] = useState<number | undefined>(
    undefined,
  );
  const [isConnected] = useState(socket.connected);

  const { events, pathname, push } = useRouter();
  const { winnerName, setWinnerName, showPlayerWinner, setShowPlayerWinner } =
    useContext(PlayerWinnerContext);
  const { showTeamWinner, setShowTeamWinner, setWinnerTeam, winnerTeam } =
    useContext(TeamWinnerContext);

  const { readyState, sendMessage } = useSocketIO(
    `${process.env.NEXT_PUBLIC_WSS_URL}`,
    {
      share: true,
      shouldReconnect: () => false,
      onOpen: () => {},
      onMessage: async (event) => {},
      retryOnError: true,
      reconnectAttempts: 1000,
      reconnectInterval: () => 3000,
    },
    true,
  );

  const getSeasonAction = useCallback(async () => {
    const { res } = await getSeason();

    if (res && !res.error && setSeason) {
      setSeason(res[0]);
    }
  }, []);

  events?.on('routeChangeStart', () => {
    if (animationRequested) {
      const body = document.getElementsByTagName('body');

      if (body && body[0]) {
        body[0].style.overflow = 'hidden';
      }
    }
  });

  events?.on('routeChangeComplete', () => {
    if (animationRequested && setAnimationRequested) {
      setAnimationRequested(false);
      const body = document.getElementsByTagName('body');

      setTimeout(() => {
        if (body && body[0]) {
          body[0].style.overflow = 'initial';
        }
      }, 1500);
    }
  });

  const getRandomInt = () => {
    const min = 0;
    const max = 9;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const colors = ['#bb0000', '#ffffff'];

  const end = Date.now() + 10 * 1000;
  const teamEnd = Date.now() + 60 * 1000;

  const frame = () => {
    //@ts-ignore
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    //@ts-ignore
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  const teamFrame = () => {
    //@ts-ignore
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    //@ts-ignore
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < teamEnd) {
      requestAnimationFrame(teamFrame);
    }
  };

  useEffect(() => {
    getSeasonAction();
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      push('/upcoming');
    }
  }, [pathname]);

  useEffect(() => {
    if (teamWinPopupVisible) {
      setTimeout(() => {
        setTeamWinPopupVisible(false);

        if (setShowTeamWinner) {
          setShowTeamWinner(false);
        }

        if (setWinnerTeam) {
          setWinnerTeam({ name: '', logo: '' });
        }
      }, 60500);
    }
  }, [teamWinPopupVisible]);

  useEffect(() => {
    if (playerWinPopupVisible) {
      setTimeout(() => {
        setPlayerWinPopupVisible(false);
        setPhraseNumber(undefined);

        if (setShowPlayerWinner) {
          setShowPlayerWinner(false);
        }

        if (setWinnerName) {
          setWinnerName('');
        }
      }, 10500);
    }
  }, [playerWinPopupVisible]);

  useEffect(() => {
    if (showPlayerWinner) {
      setPhraseNumber(getRandomInt());
      setPlayerWinPopupVisible(true);
      frame();
    }
  }, [showPlayerWinner]);

  useEffect(() => {
    if (showTeamWinner) {
      setTeamWinPopupVisible(true);
      teamFrame();
    }
  }, [showPlayerWinner]);

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
      <div
        className={`player-win-popup ${
          playerWinPopupVisible ? 'show-popup' : ''
        }`}
      >
        <button
          className="close-button"
          onClick={() => {
            setPlayerWinPopupVisible(false);
            setPhraseNumber(undefined);
          }}
        >
          <IconClose />
        </button>
        <div className="icon-wrapper">
          <IconPrize />
        </div>
        {phraseNumber !== undefined && (
          <div className="text">{phrases[phraseNumber]}</div>
        )}
        <div
          className={`player-name ${
            winnerName && winnerName?.split('&')?.length > 0 ? 'small-size' : ''
          }`}
        >
          {winnerName}
        </div>
      </div>
      <div
        className={`player-win-popup ${
          teamWinPopupVisible ? 'show-popup' : ''
        }`}
      >
        <button
          className="close-button"
          onClick={() => {
            setTeamWinPopupVisible(false);
          }}
        >
          <IconClose />
        </button>
        <div className="winner-logo">
          {winnerTeam?.logo && <img src={winnerTeam.logo as string} />}
          {!winnerTeam?.logo && <div>{winnerTeam?.name}</div>}
        </div>
        <div className="player-name">Is Winner!</div>
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SwrConfig fallback={pageProps.fallback}>
      <DefaultStyles />
      <HeaderContextProvider>
        <AnimationContextProvider>
          <SocketContext>
            <PlayerWinnerContextProvider>
              <TeamWinnerContextProvider>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <AppContent pageProps={pageProps} Component={Component} />
              </TeamWinnerContextProvider>
            </PlayerWinnerContextProvider>
          </SocketContext>
        </AnimationContextProvider>
      </HeaderContextProvider>
    </SwrConfig>
  );
}
