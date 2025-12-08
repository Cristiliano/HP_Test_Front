import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardHeader, CardContent, Spinner, Alert } from '@/components/ui';
import { DaysSelector } from '@/components/DaysSelector';
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastList } from '@/components/ForecastList';
import { useWeatherQuery } from '@/hooks';
import type { Address } from '@/types';

interface WeatherSectionProps {
  address: Address;
}

export function WeatherSection({ address }: WeatherSectionProps) {
  const [forecastDays, setForecastDays] = useState(1);
  
  const {
    data: weather,
    isLoading,
    isError,
    errorMessage,
  } = useWeatherQuery(address, {
    forecastDays,
    enabled: true,
  });

  const hasCoordinates = address.latitude != null && address.longitude != null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Previsão do Tempo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {address.cidade}, {address.uf}
                </p>
              </div>
            </div>
            
            {weather && (
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <Navigation className="w-3 h-3" />
                <span>
                  {weather.location.latitude.toFixed(4)}, {weather.location.longitude.toFixed(4)}
                </span>
                {!hasCoordinates && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
                    Geocodificado
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DaysSelector
            value={forecastDays}
            onChange={setForecastDays}
            min={1}
            max={7}
          />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="py-8">
          <Spinner size="lg" />
          <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
            Buscando dados climáticos...
          </p>
        </div>
      )}

      {isError && errorMessage && (
        <Alert variant="error" title="Erro ao buscar clima">
          {errorMessage}
        </Alert>
      )}

      {weather && !isLoading && !isError && (
        <div className="space-y-6">
          <CurrentWeatherCard
            weather={weather.current}
            city={weather.location.city}
            state={weather.location.state}
          />

          <ForecastList forecasts={weather.daily} />
        </div>
      )}
    </div>
  );
}
