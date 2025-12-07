import { useQuery } from '@tanstack/react-query';
import { fetchWeather, geocodeCity, WeatherError } from '@/api';
import type { WeatherData, Address } from '@/types';
import { CACHE_TIMES } from '@/config';

interface UseWeatherQueryOptions {
  enabled?: boolean;
  forecastDays?: number;
}

export function useWeatherQuery(
  address: Address | null,
  options: UseWeatherQueryOptions = {}
) {
  const { enabled = true, forecastDays = 7 } = options;

  const hasCoordinates = address?.latitude != null && address?.longitude != null;

  const query = useQuery<WeatherData, Error>({
    queryKey: [
      'weather',
      address?.cidade,
      address?.uf,
      address?.latitude,
      address?.longitude,
      forecastDays,
    ],
    queryFn: async () => {
      if (!address) {
        throw new WeatherError('Endereço não disponível.');
      }

      let latitude: number;
      let longitude: number;

      if (hasCoordinates) {
        latitude = address.latitude!;
        longitude = address.longitude!;
      } else {
        const geoResult = await geocodeCity(address.cidade, address.uf);
        latitude = geoResult.latitude;
        longitude = geoResult.longitude;
      }

      return fetchWeather({
        latitude,
        longitude,
        forecastDays,
        city: address.cidade,
        state: address.uf,
      });
    },
    enabled: enabled && address != null,
    staleTime: CACHE_TIMES.TEN_MINUTES,
    gcTime: CACHE_TIMES.THIRTY_MINUTES,
    retry: 1,
  });

  const getErrorMessage = (): string | null => {
    if (!query.error) return null;

    if (query.error instanceof WeatherError) {
      return query.error.message;
    }

    return 'Erro ao buscar dados climáticos. Tente novamente.';
  };

  return {
    data: query.data ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    error: query.error,
    errorMessage: getErrorMessage(),
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
}
