import { createContext, useMemo, useState } from 'react';

export const TeamWinnerContext = createContext<{
  showTeamWinner: boolean | null;
  setShowTeamWinner?: (data: boolean | null) => void;
  winnerTeam: { logo: string; name: string } | null;
  setWinnerTeam?: (data: { logo: string; name: string } | null) => void;
}>({ showTeamWinner: false, winnerTeam: { logo: '', name: '' } });

export default function WinnerCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [showTeamWinner, setShowTeamWinner] = useState<boolean | null>(false);
  const [winnerTeam, setWinnerTeam] = useState<{
    logo: string;
    name: string;
  } | null>({ logo: '', name: '' });

  const value = useMemo(
    () => ({
      showTeamWinner,
      setShowTeamWinner,
      winnerTeam,
      setWinnerTeam,
    }),
    [showTeamWinner, setShowTeamWinner, winnerTeam, winnerTeam],
  );

  return (
    <TeamWinnerContext.Provider value={value}>
      {children}
    </TeamWinnerContext.Provider>
  );
}
