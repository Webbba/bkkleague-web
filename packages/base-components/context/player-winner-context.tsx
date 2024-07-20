import { createContext, useMemo, useState } from 'react';

export const PlayerWinnerContext = createContext<{
  showPlayerWinner: boolean | null;
  setShowPlayerWinner?: (data: boolean | null) => void;
  winnerName: string | null;
  setWinnerName?: (data: string | null) => void;
}>({ showPlayerWinner: false, winnerName: '' });

export default function WinnerCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [showPlayerWinner, setShowPlayerWinner] = useState<boolean | null>(
    false,
  );
  const [winnerName, setWinnerName] = useState<string | null>('');

  const value = useMemo(
    () => ({
      showPlayerWinner,
      setShowPlayerWinner,
      winnerName,
      setWinnerName,
    }),
    [showPlayerWinner, setShowPlayerWinner, winnerName, setWinnerName],
  );

  return (
    <PlayerWinnerContext.Provider value={value}>
      {children}
    </PlayerWinnerContext.Provider>
  );
}
