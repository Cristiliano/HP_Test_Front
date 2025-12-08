import { describe, it, expect } from 'vitest';
import { geocodeCity, CityNotFoundError, GeocodingError } from '../../src/api/geocodingApi';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Geocoding API', () => {
  describe('geocodeCity', () => {
    it('should geocode city successfully', async () => {
      const result = await geocodeCity('São Paulo', 'SP');

      expect(result).toBeDefined();
      expect(result.latitude).toBe(-23.5475);
      expect(result.longitude).toBe(-46.6361);
      expect(result.name).toBe('São Paulo');
      expect(result.country_code).toBe('BR');
    });

    it('should geocode city without state', async () => {
      const result = await geocodeCity('São Paulo');

      expect(result).toBeDefined();
      expect(result.latitude).toBeDefined();
      expect(result.longitude).toBeDefined();
    });

    it('should throw CityNotFoundError when city is not found', async () => {
      await expect(geocodeCity('CidadeInexistente')).rejects.toThrow(CityNotFoundError);
    });

    it('should throw GeocodingError on API failure', async () => {
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(geocodeCity('São Paulo')).rejects.toThrow(GeocodingError);
    });

    it('should filter results by Brazil', async () => {
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
          return HttpResponse.json({
            results: [
              { id: 1, name: 'Test', latitude: 0, longitude: 0, country_code: 'US' },
              { id: 2, name: 'Test', latitude: -23, longitude: -46, country_code: 'BR', admin1: 'São Paulo' },
            ],
          });
        })
      );

      const result = await geocodeCity('Test', 'SP');
      expect(result.country_code).toBe('BR');
    });

    it('should throw CityNotFoundError when no Brazilian results', async () => {
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
          return HttpResponse.json({
            results: [
              { id: 1, name: 'Test', latitude: 0, longitude: 0, country_code: 'US' },
            ],
          });
        })
      );

      await expect(geocodeCity('Test')).rejects.toThrow(CityNotFoundError);
    });
  });
});
