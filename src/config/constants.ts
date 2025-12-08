export const API_CONFIG = {
  BRASIL_API_URL: 'https://brasilapi.com.br/api/cep/v2',
  VIACEP_URL: 'https://viacep.com.br/ws',
  GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST_URL: 'https://api.open-meteo.com/v1/forecast',
  TIMEOUT: 5000,
} as const;

export const CACHE_TIMES = {
  FIVE_MINUTES: 1000 * 60 * 5,
  TEN_MINUTES: 1000 * 60 * 10,
  THIRTY_MINUTES: 1000 * 60 * 30,
} as const;

export const HISTORY_CONFIG = {
  MAX_ITEMS: 6,
  STORAGE_KEY: 'cep-history',
} as const;

export const DARK_MODE_CONFIG = {
  STORAGE_KEY: 'dark-mode',
} as const;
