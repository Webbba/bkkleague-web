'use client';

import { createContext, useEffect, useMemo, useState } from 'react';

export const ActiveTabContext = createContext<{
  focused: boolean;
}>({ focused: true });

export default function ActiveTabCtxProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [focused, setFocused] = useState<boolean>(true);

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        onBlur();
      } else {
        onFocus();
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      focused,
      setFocused,
    }),
    [focused, setFocused],
  );

  return (
    <ActiveTabContext.Provider value={value}>
      {children}
    </ActiveTabContext.Provider>
  );
}
