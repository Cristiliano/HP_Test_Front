export const CACHE_TIMES = {
  FIVE_MINUTES: 1000 * 60 * 5,
  TEN_MINUTES: 1000 * 60 * 10,
  THIRTY_MINUTES: 1000 * 60 * 30,
} as const;

export const API_TIMEOUT = 5000;

export const HISTORY_CONFIG = {
  MAX_ITEMS: 6,
  STORAGE_KEY: 'cep-history',
} as const;
