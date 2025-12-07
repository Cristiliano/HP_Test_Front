// ============= GEOCODING API =============

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  country: string;
  country_id: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
  admin1?: string; // Estado
  admin1_id?: number;
  admin2?: string; // Cidade
  admin2_id?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

// ============= FORECAST API =============

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number; // 1 = dia, 0 = noite
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation: string;
  weather_code: string;
  cloud_cover: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current?: CurrentWeatherData;
  current_units?: CurrentUnits;
  daily?: DailyWeatherData;
  daily_units?: DailyUnits;
}

// ============= TIPOS NORMALIZADOS DA APLICAÇÃO =============

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  observationTime: Date;
}

export interface DailyForecast {
  date: Date;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationSum: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
}

// ============= CÓDIGOS WMO DE CLIMA =============

export const WMO_WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Céu limpo', icon: 'sun' },
  1: { description: 'Predominantemente limpo', icon: 'sun' },
  2: { description: 'Parcialmente nublado', icon: 'cloud-sun' },
  3: { description: 'Nublado', icon: 'cloud' },
  45: { description: 'Neblina', icon: 'cloud-fog' },
  48: { description: 'Neblina com geada', icon: 'cloud-fog' },
  51: { description: 'Garoa leve', icon: 'cloud-drizzle' },
  53: { description: 'Garoa moderada', icon: 'cloud-drizzle' },
  55: { description: 'Garoa intensa', icon: 'cloud-drizzle' },
  56: { description: 'Garoa congelante leve', icon: 'cloud-drizzle' },
  57: { description: 'Garoa congelante intensa', icon: 'cloud-drizzle' },
  61: { description: 'Chuva leve', icon: 'cloud-rain' },
  63: { description: 'Chuva moderada', icon: 'cloud-rain' },
  65: { description: 'Chuva forte', icon: 'cloud-rain' },
  66: { description: 'Chuva congelante leve', icon: 'cloud-rain' },
  67: { description: 'Chuva congelante forte', icon: 'cloud-rain' },
  71: { description: 'Neve leve', icon: 'cloud-snow' },
  73: { description: 'Neve moderada', icon: 'cloud-snow' },
  75: { description: 'Neve forte', icon: 'cloud-snow' },
  77: { description: 'Grãos de neve', icon: 'cloud-snow' },
  80: { description: 'Pancadas de chuva leves', icon: 'cloud-rain' },
  81: { description: 'Pancadas de chuva moderadas', icon: 'cloud-rain' },
  82: { description: 'Pancadas de chuva violentas', icon: 'cloud-rain' },
  85: { description: 'Pancadas de neve leves', icon: 'cloud-snow' },
  86: { description: 'Pancadas de neve fortes', icon: 'cloud-snow' },
  95: { description: 'Tempestade', icon: 'cloud-lightning' },
  96: { description: 'Tempestade com granizo leve', icon: 'cloud-lightning' },
  99: { description: 'Tempestade com granizo forte', icon: 'cloud-lightning' },
};

export function getWeatherDescription(code: number): string {
  return WMO_WEATHER_CODES[code]?.description || 'Desconhecido';
}

export function getWeatherIcon(code: number): string {
  return WMO_WEATHER_CODES[code]?.icon || 'cloud';
}
