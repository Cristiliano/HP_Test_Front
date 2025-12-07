import { fetchCepFromBrasilApi } from './brasilApi';
import { fetchCepFromViaCep } from './viaCepApi';
import type { Address } from '@/types';

export class CepNotFoundError extends Error {
  constructor(message = 'CEP não encontrado') {
    super(message);
    this.name = 'CepNotFoundError';
  }
}

export class CepServiceError extends Error {
  constructor(message = 'Erro ao consultar CEP. Tente novamente.') {
    super(message);
    this.name = 'CepServiceError';
  }
}

/**
 * Fetches CEP data with fallback strategy:
 * 1. Try BrasilAPI first (has coordinates)
 * 2. On failure, fallback to ViaCEP
 * 3. If both fail, throw appropriate error
 */
export async function fetchCep(cep: string): Promise<Address> {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new CepNotFoundError('CEP inválido. Deve conter 8 dígitos.');
  }

  try {
    // Try BrasilAPI first
    const address = await fetchCepFromBrasilApi(cleanCep);
    return address;
  } catch (brasilApiError) {
    console.warn('BrasilAPI failed, trying ViaCEP...', brasilApiError);

    try {
      // Fallback to ViaCEP
      const address = await fetchCepFromViaCep(cleanCep);
      return address;
    } catch (viaCepError) {
      console.error('Both APIs failed', { brasilApiError, viaCepError });

      // Check if it's a "not found" error
      if (
        viaCepError instanceof Error &&
        viaCepError.message === 'CEP não encontrado'
      ) {
        throw new CepNotFoundError();
      }

      throw new CepServiceError();
    }
  }
}
