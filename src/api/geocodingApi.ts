import axios from 'axios';
import type { GeocodingResponse, GeocodingResult } from '@/types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT = 5000;

const geocodingClient = axios.create({
  baseURL: GEOCODING_URL,
  timeout: TIMEOUT,
});

export class GeocodingError extends Error {
  constructor(message = 'Erro ao buscar coordenadas da cidade.') {
    super(message);
    this.name = 'GeocodingError';
  }
}

export class CityNotFoundError extends Error {
  constructor(message = 'Cidade não encontrada.') {
    super(message);
    this.name = 'CityNotFoundError';
  }
}

const UF_TO_STATE_NAME: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

export async function geocodeCity(city: string, state?: string): Promise<GeocodingResult> {
  try {
    const response = await geocodingClient.get<GeocodingResponse>('', {
      params: {
        name: city,
        count: 10,
        language: 'pt',
        format: 'json',
      },
    });

    const results = response.data.results;

    if (!results || results.length === 0) {
      throw new CityNotFoundError();
    }

    const brazilResults = results.filter(
      (r: GeocodingResult) => r.country_code === 'BR'
    );

    if (brazilResults.length === 0) {
      throw new CityNotFoundError();
    }

    if (state) {
      const stateUpper = state.toUpperCase();
      const stateName = UF_TO_STATE_NAME[stateUpper];
      
      const stateMatch = brazilResults.find((r: GeocodingResult) => {
        const admin1 = r.admin1?.toLowerCase() || '';
        
        return (
          admin1 === stateUpper.toLowerCase() ||
          (stateName && admin1 === stateName.toLowerCase())
        );
      });
      
      if (stateMatch) {
        return stateMatch;
      }
    }

    return brazilResults[0];
  } catch (error) {
    if (error instanceof CityNotFoundError) {
      throw error;
    }
    console.error('Erro ao geocodificar cidade:', error);
    throw new GeocodingError();
  }
}
