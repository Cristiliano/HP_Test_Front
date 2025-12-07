import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../src/components/Footer';

describe('Footer', () => {
  it('should display default message when no provider is specified', () => {
    render(<Footer />);

    expect(screen.getByText(/Consulta de CEP utilizando/i)).toBeInTheDocument();
    expect(screen.getByText('BrasilAPI')).toBeInTheDocument();
    expect(screen.getByText('ViaCEP')).toBeInTheDocument();
  });

  it('should display BrasilAPI provider when specified', () => {
    render(<Footer provider="BrasilAPI" />);

    expect(screen.getByText(/Dados fornecidos pela/i)).toBeInTheDocument();
    expect(screen.getByText('API BrasilAPI')).toBeInTheDocument();
  });

  it('should display ViaCEP provider when specified', () => {
    render(<Footer provider="ViaCEP" />);

    expect(screen.getByText(/Dados fornecidos pela/i)).toBeInTheDocument();
    expect(screen.getByText('API ViaCEP')).toBeInTheDocument();
  });

  it('should have links to API documentation when no provider', () => {
    render(<Footer />);

    const brasilApiLink = screen.getByRole('link', { name: 'BrasilAPI' });
    const viaCepLink = screen.getByRole('link', { name: 'ViaCEP' });

    expect(brasilApiLink).toHaveAttribute('href', 'https://brasilapi.com.br');
    expect(viaCepLink).toHaveAttribute('href', 'https://viacep.com.br');
  });
});
