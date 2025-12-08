import { describe, it, expect } from 'vitest';
import { fetchWeather, WeatherError } from '../../src/api/weatherApi';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Weather API', () => {
  describe('fetchWeather', () => {
    it('should fetch weather data successfully', async () => {
      const result = await fetchWeather({
        latitude: -23.5475,
        longitude: -46.6361,
        forecastDays: 3,
        city: 'São Paulo',
        state: 'SP',
      });

      expect(result).toBeDefined();
      expect(result.current).toBeDefined();
      expect(result.current.temperature).toBe(25.5);
      expect(result.current.humidity).toBe(65);
      expect(result.current.weatherCode).toBe(1);
      expect(result.current.isDay).toBe(true);
      expect(result.daily).toHaveLength(3);
      expect(result.location.city).toBe('São Paulo');
      expect(result.location.state).toBe('SP');
    });

    it('should normalize daily forecast data', async () => {
      const result = await fetchWeather({
        latitude: -23.5475,
        longitude: -46.6361,
        forecastDays: 3,
        city: 'São Paulo',
        state: 'SP',
      });

      const firstDay = result.daily[0];
      expect(firstDay.temperatureMax).toBe(28);
      expect(firstDay.temperatureMin).toBe(18);
      expect(firstDay.weatherCode).toBe(1);
      expect(firstDay.precipitationSum).toBe(0);
      expect(firstDay.precipitationProbability).toBe(10);
      expect(firstDay.date).toBeInstanceOf(Date);
    });

    it('should throw WeatherError on API failure', async () => {
      await expect(
        fetchWeather({
          latitude: 0,
          longitude: 0,
          forecastDays: 3,
          city: 'Test',
          state: 'TS',
        })
      ).rejects.toThrow(WeatherError);
    });

    it('should throw WeatherError when data is incomplete', async () => {
      server.use(
        http.get('https://api.open-meteo.com/v1/forecast', () => {
          return HttpResponse.json({
            latitude: -23.5,
            longitude: -46.6,
          });
        })
      );

      await expect(
        fetchWeather({
          latitude: -23.5,
          longitude: -46.6,
          forecastDays: 3,
          city: 'São Paulo',
          state: 'SP',
        })
      ).rejects.toThrow(WeatherError);
    });

    it('should use default forecastDays when not provided', async () => {
      const result = await fetchWeather({
        latitude: -23.5475,
        longitude: -46.6361,
        city: 'São Paulo',
        state: 'SP',
      });

      expect(result).toBeDefined();
      expect(result.daily.length).toBeGreaterThan(0);
    });
  });
});
