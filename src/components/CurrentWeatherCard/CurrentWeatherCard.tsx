import {
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudSun,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import type { CurrentWeather } from '@/types';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  city: string;
  state: string;
}

function getWeatherIconComponent(code: number, isDay: boolean) {
  const iconClass = 'w-12 h-12';
  
  if (code === 0 || code === 1) {
    return isDay ? <Sun className={`${iconClass} text-yellow-500`} /> : <Moon className={`${iconClass} text-slate-400`} />;
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
  if (code >= 61 && code <= 67 || code >= 80 && code <= 82) {
    return <CloudRain className={`${iconClass} text-blue-500`} />;
  }
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) {
    return <CloudSnow className={`${iconClass} text-blue-200`} />;
  }
  if (code >= 95) {
    return <CloudLightning className={`${iconClass} text-yellow-600`} />;
  }
  
  return <Cloud className={`${iconClass} text-gray-500`} />;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function CurrentWeatherCard({ weather, city, state }: CurrentWeatherCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Clima Atual
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {city}, {state}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
              {formatDate(weather.observationTime)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {getWeatherIconComponent(weather.weatherCode, weather.isDay)}
            <div>
              <p className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {weather.weatherDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sensação</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(weather.apparentTemperature)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Umidade</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {weather.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <Wind className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vento</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(weather.windSpeed)} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <Cloud className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nuvens</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {weather.cloudCover}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
