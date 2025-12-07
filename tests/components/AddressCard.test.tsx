import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddressCard } from '../../src/components/AddressCard';
import type { Address } from '../../src/types';

describe('AddressCard', () => {
  const mockAddressBrasilAPI: Address = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    ddd: '11',
    ibge: '3550308',
    siafi: '7107',
    latitude: -23.5647,
    longitude: -46.6565,
    provider: 'BrasilAPI',
  };

  const mockAddressViaCEP: Address = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    ddd: '11',
    ibge: '3550308',
    siafi: '7107',
    latitude: undefined,
    longitude: undefined,
    provider: 'ViaCEP',
  };

  it('should render all address fields', () => {
    render(<AddressCard address={mockAddressBrasilAPI} />);

    expect(screen.getByText('01310-100')).toBeInTheDocument();
    expect(screen.getByText('Avenida Paulista')).toBeInTheDocument();
    expect(screen.getByText('Bela Vista')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('3550308')).toBeInTheDocument();
    expect(screen.getByText('7107')).toBeInTheDocument();
  });

  it('should display coordinates when available (BrasilAPI)', () => {
    render(<AddressCard address={mockAddressBrasilAPI} />);

    expect(screen.getByText(/Coordenadas/i)).toBeInTheDocument();
    expect(screen.getByText(/-23.564700, -46.656500/)).toBeInTheDocument();
  });

  it('should NOT display coordinates when unavailable (ViaCEP)', () => {
    render(<AddressCard address={mockAddressViaCEP} />);

    expect(screen.queryByText(/Coordenadas/i)).not.toBeInTheDocument();
  });

  it('should display BrasilAPI provider badge', () => {
    render(<AddressCard address={mockAddressBrasilAPI} />);

    expect(screen.getByText('BrasilAPI')).toBeInTheDocument();
  });

  it('should display ViaCEP provider badge', () => {
    render(<AddressCard address={mockAddressViaCEP} />);

    expect(screen.getByText('ViaCEP')).toBeInTheDocument();
  });

  it('should render header with icon and title', () => {
    render(<AddressCard address={mockAddressBrasilAPI} />);

    expect(screen.getByText('Endereço Encontrado')).toBeInTheDocument();
  });
});
