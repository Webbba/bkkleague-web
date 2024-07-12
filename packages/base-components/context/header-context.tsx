import { createContext, useMemo, useState } from 'react';
import { Season } from '../types';

export const HeaderContext = createContext<{
  season: Season | null;
  setSeason?: (data: Season | null) => void;
}>({ season: null });

export default function HeaderCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [season, setSeason] = useState<Season | null>(null);

  const value = useMemo(
    () => ({
      season,
      setSeason,
    }),
    [season, setSeason],
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}
