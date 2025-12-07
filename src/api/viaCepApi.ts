import axios from 'axios';
import type { ViaCepResponse, Address } from '@/types';
import { API_CONFIG } from '@/config';

const viaCepClient = axios.create({
  baseURL: API_CONFIG.VIACEP_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export async function fetchCepFromViaCep(cep: string): Promise<Address> {
  const cleanCep = cep.replace(/\D/g, '');
  
  const response = await viaCepClient.get<ViaCepResponse>(`/${cleanCep}/json/`);
  const data = response.data;

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return normalizeViaCepResponse(data);
}

function normalizeViaCepResponse(data: ViaCepResponse): Address {
  return {
    cep: data.cep,
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || '',
    ddd: data.ddd || undefined,
    ibge: data.ibge || undefined,
    siafi: data.siafi || undefined,
    latitude: undefined,
    longitude: undefined,
    provider: 'ViaCEP',
  };
}
