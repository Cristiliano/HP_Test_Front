import axios from 'axios';
import type { BrasilApiCepResponse, Address } from '@/types';
import { API_CONFIG } from '@/config';

const brasilApiClient = axios.create({
  baseURL: API_CONFIG.BRASIL_API_URL,
  timeout: API_CONFIG.TIMEOUT,
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
    latitude: data.location?.coordinates?.latitude 
      ? parseFloat(String(data.location.coordinates.latitude))
      : undefined,
    longitude: data.location?.coordinates?.longitude 
      ? parseFloat(String(data.location.coordinates.longitude))
      : undefined,
    provider: 'BrasilAPI',
  };
}

function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
}
