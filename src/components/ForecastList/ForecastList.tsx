import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudSun,
  Droplets,
} from 'lucide-react';
import type { DailyForecast } from '@/types';

interface ForecastListProps {
  forecasts: DailyForecast[];
}

function getWeatherIconComponent(code: number) {
  const iconClass = 'w-8 h-8';
  
  if (code === 0 || code === 1) {
    return <Sun className={`${iconClass} text-yellow-500`} />;
  }
  if (code === 2) {
    return <CloudSun className={`${iconClass} text-gray-400`} />;
  }
  if (code === 3) {
    return <Cloud className={`${iconClass} text-gray-500`} />;
  }
  if (code >= 45 && code <= 48) {
    return <CloudFog className={`${iconClass} text-gray-400`} />;
  }
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle className={`${iconClass} text-blue-400`} />;
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className={`${iconClass} text-blue-500`} />;
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return <CloudSnow className={`${iconClass} text-blue-200`} />;
  }
  if (code >= 95) {
    return <CloudLightning className={`${iconClass} text-yellow-600`} />;
  }
  
  return <Cloud className={`${iconClass} text-gray-500`} />;
}

function formatDayOfWeek(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export function ForecastList({ forecasts }: ForecastListProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Previsão para os próximos dias
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="
              flex items-center gap-3 p-4 rounded-xl
              bg-white dark:bg-slate-800
              border border-gray-100 dark:border-slate-700
              shadow-sm
            "
          >
            <div className="flex-shrink-0">
              {getWeatherIconComponent(forecast.weatherCode)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {formatDayOfWeek(forecast.date)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(forecast.date)}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {forecast.weatherDescription}
              </p>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {Math.round(forecast.temperatureMax)}°
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {Math.round(forecast.temperatureMin)}°
              </p>
            </div>

            {forecast.precipitationProbability > 0 && (
              <div className="flex items-center gap-1 text-blue-500">
                <Droplets className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {forecast.precipitationProbability}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
