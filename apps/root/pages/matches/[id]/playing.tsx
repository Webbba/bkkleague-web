import { useEffect, useState, useContext, useCallback } from 'react';
import { getMatch, getFrames, getPlayer } from 'api';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { MatchLayout } from 'base-components';
import { Frame } from 'base-components/types';
// import { useSocketIO } from 'react-use-websocket';
import { SocketContext } from 'base-components/context/socket-context';
import { PlayerWinnerContext } from 'base-components/context/player-winner-context';
import { TeamWinnerContext } from 'base-components/context/team-winner-context';
import { useRouter } from 'next/router';

const isOdd = (num: number) => {
  return num % 2;
};

const defaultFramesData = {
  firstBreak: '',
  frameData: [
    {
      frameNumber: 1,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 2,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 3,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 4,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 5,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 6,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 7,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 8,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 9,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 10,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 11,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 12,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 13,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 14,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 15,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 16,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 17,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 18,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 19,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
    {
      frameNumber: 20,
      homeTeamBreak: false,
      awayTeamBreak: false,
    },
  ],
};

export default function Playing({
  fallback,
}: {
  fallback?: {
    frames: {
      firstBreak: string;
      frameData: Frame[];
      teams: {
        home: any;
        away: any;
      };
    };
    match: any;
  };
}) {
  const [framePage, setFramePage] = useState(0);
  const [frames, setFrames] = useState<
    | {
        firstBreak?: string;
        frameData: Frame[];
        teams?: {
          home: any;
          away: any;
        };
      }
    | undefined
  >(defaultFramesData);

  const { query } = useRouter();
  const { setShowPlayerWinner, setWinnerName } =
    useContext(PlayerWinnerContext);
  const { setShowTeamWinner, setWinnerTeam } = useContext(TeamWinnerContext);

  const {
    setIsConnected,
    setSubscribedMatches,
    isConnected,
    subscribedMatches,
  } = useContext(SocketContext);

  // const { sendMessage, lastMessage } = useSocketIO(
  //   `${process.env.NEXT_PUBLIC_WSS_URL}`,
  //   {
  //     share: true,
  //     shouldReconnect: () => false,
  //     onOpen: () => {
  //       if (setSubscribedMatches) {
  //         setSubscribedMatches([Number(query.id) as number]);
  //       }

  //       if (setIsConnected) {
  //         setIsConnected(true);
  //       }

  //       sendMessage(`42["join", "match_${query.id}"]`);
  //     },
  //     onMessage: async (event) => {},
  //     retryOnError: true,
  //     reconnectAttempts: 1000,
  //     reconnectInterval: () => 3000,
  //   },
  //   true,
  // );

  const getFrame = useCallback(
    async (payload: any) => {
      const nextFrames: any = { ...frames };

      let nextFramesData = ([] as Frame[]).concat(
        nextFrames?.frameData as Frame[],
      );

      if (payload.type === 'players') {
        const playerResponse = await getPlayer(payload.playerId);

        if (playerResponse) {
          const name = playerResponse.res.name;

          const player = {
            playerId: payload.playerId,
            nickname: name,
          };

          let payloadFrameIndex = payload.frameIdx;

          if (payload.frameIdx > 4) {
            payloadFrameIndex = payload.frameIdx - 1;
          }

          if (payload.frameIdx > 8) {
            payloadFrameIndex = payload.frameIdx - 2;
          }

          if (payload.frameIdx > 13) {
            payloadFrameIndex = payload.frameIdx - 3;
          }

          if (payload.frameIdx > 18) {
            payloadFrameIndex = payload.frameIdx - 4;
          }

          const prevFrame = nextFramesData.find(
            (item) => item.frameNumber === payloadFrameIndex,
          );

          let homeBreak = false;
          let awayBreak = false;

          if (prevFrame) {
            homeBreak = prevFrame.homeTeamBreak ? false : true;
            awayBreak = prevFrame.awayTeamBreak ? false : true;
          } else {
            homeBreak = Boolean(nextFrames.firstBreak === 'home');
            awayBreak = Boolean(nextFrames.firstBreak === 'away');
          }

          if (
            nextFramesData.length &&
            nextFramesData.find(
              (item) => item.frameNumber === payloadFrameIndex + 1,
            )
          ) {
            nextFramesData = nextFramesData.map((item) => {
              const result = { ...item };

              const framePlayers = { ...result.players };
              let homePlayers = ([] as any[]).concat(framePlayers.home);
              let awayPlayers = ([] as any[]).concat(framePlayers.away);

              if (
                payload.side === 'home' &&
                item.frameNumber === payloadFrameIndex + 1
              ) {
                if (payload.playerIdx === 0) {
                  if (homePlayers.length > 0) {
                    homePlayers = homePlayers?.map((playerValues, index) => {
                      let result = { ...playerValues };
                      if (index === 0) {
                        result = player;
                      }
                      return result;
                    });
                  } else {
                    homePlayers.push(player);
                  }
                } else if (payload.playerIdx === 1) {
                  if (homePlayers.length > 1) {
                    homePlayers = homePlayers?.map((playerValues, index) => {
                      let result = { ...playerValues };
                      if (index === 1) {
                        result = player;
                      }
                      return result;
                    });
                  } else {
                    homePlayers.push(player);
                  }
                }
                framePlayers.home = homePlayers as any;
              }

              if (
                payload.side === 'away' &&
                item.frameNumber === payloadFrameIndex + 1
              ) {
                if (payload.playerIdx === 0) {
                  if (awayPlayers.length > 0) {
                    awayPlayers = awayPlayers?.map((playerValues, index) => {
                      let result = { ...playerValues };

                      if (index === 0) {
                        result = player;
                      }

                      return result;
                    });
                  } else {
                    awayPlayers.push(player);
                  }
                } else if (payload.playerIdx === 1) {
                  if (awayPlayers.length > 1) {
                    awayPlayers = awayPlayers?.map((playerValues, index) => {
                      let result = { ...playerValues };
                      if (index === 1) {
                        result = player;
                      }
                      return result;
                    });
                  } else {
                    awayPlayers.push(player);
                  }
                }

                framePlayers.away = awayPlayers as any;
              }

              if (result.frameNumber === payloadFrameIndex + 1) {
                result.homeTeamBreak = homeBreak;
                result.awayTeamBreak = awayBreak;
                result.players = framePlayers;
              }

              return result;
            });
          }

          nextFrames.frameData = nextFramesData;

          setFrames(nextFrames);
        }
      }
    },
    [frames],
  );

  const getBreakes = useCallback(
    (firstBreak: string) => {
      const nextFrames: any = { ...frames };

      const nextFramesMatches = nextFrames?.frameData?.map(
        (item: any, index: number) => {
          let result = { ...item };

          if (firstBreak === query?.homeTeam) {
            if (isOdd(index) === 0) {
              result.homeTeamBreak = true;
              result.awayTeamBreak = false;
            } else {
              result.awayTeamBreak = true;
              result.homeTeamBreak = false;
            }
          } else if (firstBreak === query?.awayTeam) {
            if (isOdd(index) === 0) {
              result.awayTeamBreak = true;
              result.homeTeamBreak = false;
            } else {
              result.homeTeamBreak = true;
              result.awayTeamBreak = false;
            }
          }

          return result;
        },
      );

      nextFrames.frameData = nextFramesMatches;

      setFrames(nextFrames);
    },
    [frames],
  );

  // useEffect(() => {
  //   if (lastMessage.type === 'frame_update') {
  //     const payload: any = lastMessage.payload;

  //     if (payload.type === 'players') {
  //       getFrame(payload);
  //     }

  //     if (payload.type === 'win') {
  //       let payloadFrameIndex = payload.frameIdx;

  //       if (payload.frameIdx > 4) {
  //         payloadFrameIndex = payload.frameIdx - 1;
  //       }

  //       if (payload.frameIdx > 8) {
  //         payloadFrameIndex = payload.frameIdx - 2;
  //       }

  //       if (payload.frameIdx > 12) {
  //         payloadFrameIndex = payload.frameIdx - 3;
  //       }

  //       if (payload.frameIdx > 18) {
  //         payloadFrameIndex = payload.frameIdx - 4;
  //       }

  //       const nextFrames: any = { ...frames };
  //       const nextFramesData = nextFrames?.frameData?.map((item: any) => {
  //         const result = { ...item };

  //         if (result.frameNumber === payloadFrameIndex + 1) {
  //           const side =
  //             query.homeTeam === payload.winnerTeamId.toString()
  //               ? 'home'
  //               : 'away';

  //           result.winner = {
  //             side: side,
  //             teamId: payload.winnerTeamId,
  //           };

  //           let playerName = '';
  //           let secondPlayerName = '';

  //           if (side === 'home') {
  //             playerName = result?.players?.home[0]?.nickname;

  //             if (result?.players?.home[0]) {
  //               secondPlayerName = result?.players?.home[1]?.nickname;
  //             }
  //           } else {
  //             playerName = result?.players?.away[0]?.nickname;

  //             if (result?.players?.away[0]) {
  //               secondPlayerName = result?.players?.away[1]?.nickname;
  //             }
  //           }

  //           if (playerName) {
  //             const playerNameArray = playerName.split(' ');
  //             let secondPlayerFormatted: string[] = [];

  //             if (secondPlayerName) {
  //               secondPlayerFormatted = secondPlayerName.split(' ');
  //             }

  //             if (setWinnerName) {
  //               setWinnerName(
  //                 `${playerNameArray[0]}${
  //                   secondPlayerFormatted?.length
  //                     ? ` & ${secondPlayerFormatted[0]}`
  //                     : ''
  //                 }`,
  //               );
  //             }
  //           }
  //         }

  //         return result;
  //       });

  //       nextFrames.frameData = nextFramesData;

  //       setFrames(nextFrames);

  //       const awayWinnerScore = nextFramesData?.filter(
  //         (frame: any) => frame.winner.side === 'away',
  //       );
  //       const homeWinnerScore = nextFramesData?.filter(
  //         (frame: any) => frame.winner.side === 'home',
  //       );

  //       console.log(awayWinnerScore.length);
  //       console.log(homeWinnerScore.length);

  //       if (setShowPlayerWinner) {
  //         setShowPlayerWinner(true);
  //       }

  //       if (homeWinnerScore.length === 11 && setShowTeamWinner) {
  //         setShowTeamWinner(true);

  //         if (setWinnerTeam) {
  //           setWinnerTeam({
  //             name: frames?.teams?.home.name,
  //             logo: `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.home.logo}`,
  //           });
  //         }
  //       }

  //       if (awayWinnerScore.length === 11 && setShowTeamWinner) {
  //         setShowTeamWinner(true);

  //         if (setWinnerTeam) {
  //           setWinnerTeam({
  //             name: frames?.teams?.away.name,
  //             logo: `${process.env.NEXT_PUBLIC_API_URL}/logos/${frames?.teams?.away.logo}`,
  //           });
  //         }
  //       }

  //       if (payloadFrameIndex + 1 === 4) {
  //         setFramePage(1);
  //       } else if (payloadFrameIndex + 1 === 8) {
  //         setFramePage(2);
  //       } else if (payloadFrameIndex + 1 === 12) {
  //         setFramePage(3);
  //       } else if (payloadFrameIndex + 1 === 16) {
  //         setFramePage(4);
  //       }
  //     }
  //   }

  //   if (lastMessage.type === 'match_update') {
  //     const payload: any = lastMessage.payload;

  //     getBreakes(payload?.data?.firstBreak?.toString());
  //   }
  // }, [lastMessage, frames, query]);

  // useEffect(() => {
  //   if (isConnected) {
  //     const nextSuscribedMatches = ([] as number[]).concat(
  //       subscribedMatches as number[],
  //     );

  //     if (!nextSuscribedMatches.find((item) => item === Number(query.id))) {
  //       nextSuscribedMatches.push(Number(query.id));

  //       sendMessage(`42["join", "match_${query.id}"]`);

  //       if (setSubscribedMatches) {
  //         setSubscribedMatches(nextSuscribedMatches);
  //       }
  //     }
  //   }
  // }, [isConnected]);

  useEffect(() => {
    if (fallback?.frames) {
      const nextFrames: any = { ...frames };

      const nextFramesMatches = nextFrames?.frameData?.map(
        (item: any, index: number) => {
          let result = { ...item };

          if (
            fallback?.frames.frameData.find(
              (frame) => frame.frameNumber === result.frameNumber,
            )
          ) {
            const currentFrame = fallback?.frames.frameData.find(
              (frame) => frame.frameNumber === result.frameNumber,
            );

            result = currentFrame;
          }

          if (fallback?.frames.firstBreak === 'home') {
            if (isOdd(index) === 0) {
              result.homeTeamBreak = true;
              result.awayTeamBreak = false;
            } else {
              result.awayTeamBreak = true;
              result.homeTeamBreak = false;
            }
          } else if (fallback?.frames.firstBreak === 'away') {
            if (isOdd(index) === 0) {
              result.awayTeamBreak = true;
              result.homeTeamBreak = false;
            } else {
              result.homeTeamBreak = true;
              result.awayTeamBreak = false;
            }
          }

          return result;
        },
      );

      nextFrames.frameData = nextFramesMatches;
      nextFrames.firstBreak = fallback?.frames.firstBreak;
      nextFrames.teams = fallback?.frames?.teams;

      const framesLength = fallback?.frames.frameData?.filter(
        (item) => item.winner,
      ).length;

      if (framesLength >= 4) {
        setFramePage(1);
      }

      if (framesLength >= 8) {
        setFramePage(2);
      }

      if (framesLength >= 12) {
        setFramePage(3);
      }

      if (framesLength >= 16) {
        setFramePage(4);
      }

      setFrames(nextFrames);
    }
  }, [fallback?.frames]);

  return (
    <>
      <Head>
        <title>Bangkok pool league | Match</title>
      </Head>
      <MatchLayout
        frames={frames}
        currentMatch={fallback?.match}
        framePage={framePage}
        setFramePage={setFramePage}
        playing
      />
    </>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { res: frames } = await getFrames(query?.id as string);
  const { res: match } = await getMatch(query?.id as string);

  return {
    props: {
      fallback: {
        frames: frames.data,
        match: match.data,
      },
    },
  };
}
