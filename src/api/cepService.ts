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
 * Busca dados de CEP utilizando múltiplos provedores com fallback:
 * 1. Tenta BrasilAPI primeiro (possui coordenadas)
 * 2. Em caso de falha, faz fallback para ViaCEP (sem coordenadas)
 * 3. Se ambas falham, lança erro 
 */
export async function fetchCep(cep: string): Promise<Address> {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new CepNotFoundError('CEP inválido. Deve conter 8 dígitos.');
  }

  try {
    // Tenta BrasilAPI primeiro
    const address = await fetchCepFromBrasilApi(cleanCep);
    return address;
  } catch (brasilApiError) {
    console.warn('BrasilAPI falhou, tentando ViaCEP...', brasilApiError);

    try {
      // Fallback para ViaCEP
      const address = await fetchCepFromViaCep(cleanCep);
      return address;
    } catch (viaCepError) {
      console.error('Ambas as APIs falharam', { brasilApiError, viaCepError });

      // Verifica se é um erro de "não encontrado"
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
