import { QueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: CACHE_TIMES.FIVE_MINUTES,
    },
  },
});
