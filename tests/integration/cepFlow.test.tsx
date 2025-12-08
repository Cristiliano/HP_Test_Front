import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from '../../src/pages/Home';

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

describe('CEP Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  it('should complete full CEP search flow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    expect(screen.getByText('Consulta de CEP e Clima')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '01310100');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Avenida Paulista')).toBeInTheDocument();
    expect(screen.getByText('Bela Vista')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('BrasilAPI')).toBeInTheDocument();
  });

  it('should add CEP to history after successful search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '01310100');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Consultas Recentes')).toBeInTheDocument();
    expect(screen.getAllByText('São Paulo, SP').length).toBeGreaterThan(0);
  });

  it('should show error for invalid CEP', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '00000000');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText(/CEP não encontrado/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should fallback to ViaCEP when BrasilAPI fails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '99999999');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('ViaCEP')).toBeInTheDocument();
  });

  it('should show weather section after CEP search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const input = screen.getByPlaceholderText('00000-000');
    await user.type(input, '01310100');

    const button = screen.getByRole('button', { name: /buscar/i });
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText('Previsão do Tempo')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should toggle dark mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const darkModeToggle = screen.getByRole('button', { name: /ativar modo escuro/i });
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(darkModeToggle);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should select CEP from history', async () => {
    localStorage.setItem(
      'cep-history',
      JSON.stringify([
        { cep: '01310-100', cidade: 'São Paulo', uf: 'SP', timestamp: Date.now() },
      ])
    );

    const user = userEvent.setup();
    renderWithProviders(<Home />);

    expect(screen.getByText('Consultas Recentes')).toBeInTheDocument();

    const historyItem = screen.getByText('01310-100').closest('div[class*="cursor-pointer"]');
    await user.click(historyItem!);

    await waitFor(
      () => {
        expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should clear history', async () => {
    localStorage.setItem(
      'cep-history',
      JSON.stringify([
        { cep: '01310-100', cidade: 'São Paulo', uf: 'SP', timestamp: Date.now() },
      ])
    );

    const user = userEvent.setup();
    renderWithProviders(<Home />);

    expect(screen.getByText('Consultas Recentes')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /limpar/i });
    await user.click(clearButton);

    expect(screen.getByText('Nenhuma consulta recente')).toBeInTheDocument();
  });
});
