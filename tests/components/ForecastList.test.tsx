import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ForecastList } from '../../src/components/ForecastList';
import type { DailyForecast } from '../../src/types';

describe('ForecastList', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-07T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockForecasts: DailyForecast[] = [
    {
      date: new Date('2025-12-07'),
      temperatureMin: 18,
      temperatureMax: 28,
      weatherCode: 1,
      weatherDescription: 'Céu limpo',
      precipitationSum: 0,
      precipitationProbability: 10,
    },
    {
      date: new Date('2025-12-08'),
      temperatureMin: 17,
      temperatureMax: 26,
      weatherCode: 3,
      weatherDescription: 'Nublado',
      precipitationSum: 0,
      precipitationProbability: 20,
    },
    {
      date: new Date('2025-12-09'),
      temperatureMin: 16,
      temperatureMax: 24,
      weatherCode: 61,
      weatherDescription: 'Chuva leve',
      precipitationSum: 15,
      precipitationProbability: 80,
    },
  ];

  it('should render forecast list title', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('Previsão para os próximos dias')).toBeInTheDocument();
  });

  it('should render all forecast items', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('Céu limpo')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('Chuva leve')).toBeInTheDocument();
  });

  it('should display "Hoje" for current date', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('Hoje')).toBeInTheDocument();
  });

  it('should display "Amanhã" for next day', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('Amanhã')).toBeInTheDocument();
  });

  it('should display temperature max and min', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('28°')).toBeInTheDocument();
    expect(screen.getByText('18°')).toBeInTheDocument();
  });

  it('should display precipitation probability when greater than 0', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('should not display precipitation for 0% probability', () => {
    const forecastsWithZeroPrecip: DailyForecast[] = [
      {
        ...mockForecasts[0],
        precipitationProbability: 0,
      },
    ];

    render(<ForecastList forecasts={forecastsWithZeroPrecip} />);

    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('should render date in DD/MM format', () => {
    render(<ForecastList forecasts={mockForecasts} />);

    expect(screen.getByText('07/12')).toBeInTheDocument();
    expect(screen.getByText('08/12')).toBeInTheDocument();
  });

  it('should handle empty forecasts array', () => {
    render(<ForecastList forecasts={[]} />);

    expect(screen.getByText('Previsão para os próximos dias')).toBeInTheDocument();
  });
});
