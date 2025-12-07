import axios from 'axios';
import type { ViaCepResponse } from '@/types';
import type { Address } from '@/types';

const VIACEP_URL = 'https://viacep.com.br/ws';
const TIMEOUT = 5000;

const viaCepClient = axios.create({
  baseURL: VIACEP_URL,
  timeout: TIMEOUT,
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
