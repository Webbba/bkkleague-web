import { createContext, useMemo, useState } from 'react';

export const AnimationContext = createContext<{
  animationRequested: boolean | null;
  setAnimationRequested?: (data: boolean | null) => void;
}>({ animationRequested: null });

export default function HeaerCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [animationRequested, setAnimationRequested] = useState<boolean | null>(
    null,
  );

  const value = useMemo(
    () => ({
      animationRequested,
      setAnimationRequested,
    }),
    [animationRequested, setAnimationRequested],
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}
