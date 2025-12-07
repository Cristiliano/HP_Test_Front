import axios from 'axios';
import type { BrasilApiCepResponse } from '@/types';
import type { Address } from '@/types';

const BRASIL_API_URL = 'https://brasilapi.com.br/api/cep/v2';
const TIMEOUT = 5000;

const brasilApiClient = axios.create({
  baseURL: BRASIL_API_URL,
  timeout: TIMEOUT,
});

export async function fetchCepFromBrasilApi(cep: string): Promise<Address> {
  const cleanCep = cep.replace(/\D/g, '');
  
  const response = await brasilApiClient.get<BrasilApiCepResponse>(`/${cleanCep}`);
  const data = response.data;

  return normalizeBrasilApiResponse(data);
}

function normalizeBrasilApiResponse(data: BrasilApiCepResponse): Address {
  return {
    cep: formatCep(data.cep),
    logradouro: data.street || '',
    bairro: data.neighborhood || '',
    cidade: data.city || '',
    uf: data.state || '',
    latitude: data.location?.coordinates?.latitude,
    longitude: data.location?.coordinates?.longitude,
    provider: 'BrasilAPI',
  };
}

function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
}
