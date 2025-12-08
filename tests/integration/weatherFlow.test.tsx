import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherSection } from '../../src/components/WeatherSection';
import type { Address } from '../../src/types';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('Weather Flow Integration', () => {
  const mockAddress: Address = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    latitude: -23.5475,
    longitude: -46.6361,
    provider: 'BrasilAPI',
  };

  const mockAddressWithoutCoords: Address = {
    ...mockAddress,
    latitude: undefined,
    longitude: undefined,
    provider: 'ViaCEP',
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should load weather data when address has coordinates', async () => {
    renderWithProviders(<WeatherSection address={mockAddress} />);

    expect(screen.getByText('Previsão do Tempo')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('Clima Atual')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Previsão para os próximos dias')).toBeInTheDocument();
  });

  it('should geocode city when address has no coordinates', async () => {
    renderWithProviders(<WeatherSection address={mockAddressWithoutCoords} />);

    await waitFor(
      () => {
        expect(screen.getByText('Clima Atual')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Geocodificado')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    renderWithProviders(<WeatherSection address={mockAddress} />);

    expect(screen.getByText('Buscando dados climáticos...')).toBeInTheDocument();
  });

  it('should allow changing forecast days', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<WeatherSection address={mockAddress} />);

    await waitFor(
      () => {
        expect(screen.getByText('Clima Atual')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const day7Button = screen.getByText('7 dias');
    await user.click(day7Button);

    expect(day7Button).toHaveClass('bg-indigo-600');
  });

  it('should display current weather details', async () => {
    renderWithProviders(<WeatherSection address={mockAddress} />);

    await waitFor(
      () => {
        expect(screen.getByText('Clima Atual')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Sensação')).toBeInTheDocument();
    expect(screen.getByText('Umidade')).toBeInTheDocument();
    expect(screen.getByText('Vento')).toBeInTheDocument();
    expect(screen.getByText('Nuvens')).toBeInTheDocument();
  });

  it('should display coordinates in header', async () => {
    renderWithProviders(<WeatherSection address={mockAddress} />);

    await waitFor(
      () => {
        expect(screen.getByText('Clima Atual')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText(/-23\.\d+, -46\.\d+/)).toBeInTheDocument();
  });
});
