import { createContext, useMemo, useState } from 'react';
import { Season } from '../types';

export const SocketContext = createContext<{
  isConnected: boolean | null;
  setIsConnected?: (data: boolean | null) => void;
  subscribedMatches: number[] | null;
  setSubscribedMatches?: (data: number[]) => void;
}>({ isConnected: false, subscribedMatches: [] });

export default function SocketCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [subscribedMatches, setSubscribedMatches] = useState<number[] | null>(
    [],
  );

  const value = useMemo(
    () => ({
      isConnected,
      setIsConnected,
      subscribedMatches,
      setSubscribedMatches,
    }),
    [isConnected, setIsConnected, subscribedMatches, setSubscribedMatches],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
