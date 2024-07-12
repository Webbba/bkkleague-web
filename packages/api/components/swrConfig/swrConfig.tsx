import { SWRConfig } from 'swr';
import { get } from '../../utils/fetcher';

export default function SwrConfig({
  fallback,
  children,
}: {
  fallback?: {
    [key: string]: any;
  };
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fallback,
        refreshInterval: 60000 * 30,
        fetcher: get,
        onError: (error, key) => {
          if (error.status !== 403 && error.status !== 404) {
            // show notification in UI
          }
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Never retry on 404
          if (error.status === 404) return;
          // Only retry up to 3 times
          if (retryCount >= 3) return;
          // Retry after 5 seconds
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
