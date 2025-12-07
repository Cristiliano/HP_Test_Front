import axios from 'axios';
import type {
  ForecastResponse,
  WeatherData,
  CurrentWeather,
  DailyForecast,
} from '@/types';
import { getWeatherDescription } from '@/types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT = 5000;

const forecastClient = axios.create({
  baseURL: FORECAST_URL,
  timeout: TIMEOUT,
});

export class WeatherError extends Error {
  constructor(message = 'Erro ao buscar dados climáticos.') {
    super(message);
    this.name = 'WeatherError';
  }
}

export interface FetchWeatherParams {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  city: string;
  state: string;
}

export async function fetchWeather({
  latitude,
  longitude,
  forecastDays = 7,
  city,
  state,
}: FetchWeatherParams): Promise<WeatherData> {
  try {
    const response = await forecastClient.get<ForecastResponse>('', {
      params: {
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'weather_code',
          'cloud_cover',
          'wind_speed_10m',
          'wind_direction_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'precipitation_probability_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: forecastDays,
      },
    });

    const data = response.data;
    return normalizeWeatherResponse(data, city, state);
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error);
    throw new WeatherError();
  }
}

function normalizeWeatherResponse(
  data: ForecastResponse,
  city: string,
  state: string
): WeatherData {
  const current = data.current;
  const daily = data.daily;

  if (!current || !daily) {
    throw new WeatherError('Dados climáticos incompletos.');
  }

  const normalizedCurrent: CurrentWeather = {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    weatherDescription: getWeatherDescription(current.weather_code),
    isDay: current.is_day === 1,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    cloudCover: current.cloud_cover,
    observationTime: new Date(current.time),
  };

  const normalizedDaily: DailyForecast[] = daily.time.map((time, index) => ({
    date: new Date(time),
    temperatureMin: daily.temperature_2m_min[index],
    temperatureMax: daily.temperature_2m_max[index],
    weatherCode: daily.weather_code[index],
    weatherDescription: getWeatherDescription(daily.weather_code[index]),
    precipitationSum: daily.precipitation_sum[index],
    precipitationProbability: daily.precipitation_probability_max[index],
  }));

  return {
    current: normalizedCurrent,
    daily: normalizedDaily,
    location: {
      city,
      state,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  };
}
