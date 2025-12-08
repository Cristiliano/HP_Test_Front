import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentWeatherCard } from '../../src/components/CurrentWeatherCard';
import type { CurrentWeather } from '../../src/types';

describe('CurrentWeatherCard', () => {
  const mockWeather: CurrentWeather = {
    temperature: 25.5,
    apparentTemperature: 27.2,
    humidity: 65,
    precipitation: 0,
    weatherCode: 1,
    weatherDescription: 'Céu limpo',
    isDay: true,
    windSpeed: 12.5,
    windDirection: 180,
    cloudCover: 20,
    observationTime: new Date('2025-12-07T10:00:00'),
  };

  it('should render temperature', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('26°C')).toBeInTheDocument();
  });

  it('should render city and state', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
  });

  it('should render weather description', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Céu limpo')).toBeInTheDocument();
  });

  it('should render apparent temperature', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Sensação')).toBeInTheDocument();
    expect(screen.getByText('27°C')).toBeInTheDocument();
  });

  it('should render humidity', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Umidade')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should render wind speed', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Vento')).toBeInTheDocument();
    expect(screen.getByText('13 km/h')).toBeInTheDocument();
  });

  it('should render cloud cover', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Nuvens')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<CurrentWeatherCard weather={mockWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Clima Atual')).toBeInTheDocument();
  });

  it('should render correctly for night time', () => {
    const nightWeather = { ...mockWeather, isDay: false };
    render(<CurrentWeatherCard weather={nightWeather} city="São Paulo" state="SP" />);

    expect(screen.getByText('Clima Atual')).toBeInTheDocument();
  });
});
