import { http, HttpResponse } from 'msw';

// ============= CEP API RESPONSES =============

const brasilApiSuccessResponse = {
  cep: '01310100',
  state: 'SP',
  city: 'São Paulo',
  neighborhood: 'Bela Vista',
  street: 'Avenida Paulista',
  service: 'correios',
  location: {
    type: 'Point',
    coordinates: {
      longitude: -46.6565,
      latitude: -23.5647,
    },
  },
};

const viaCepSuccessResponse = {
  cep: '01310-100',
  logradouro: 'Avenida Paulista',
  complemento: 'de 1047 a 1865 - lado ímpar',
  unidade: '',
  bairro: 'Bela Vista',
  localidade: 'São Paulo',
  uf: 'SP',
  estado: 'São Paulo',
  regiao: 'Sudeste',
  ibge: '3550308',
  gia: '1004',
  ddd: '11',
  siafi: '7107',
};

const viaCepNotFoundResponse = {
  erro: true,
};

// ============= GEOCODING API RESPONSES =============

const geocodingSuccessResponse = {
  results: [
    {
      id: 3448439,
      name: 'São Paulo',
      latitude: -23.5475,
      longitude: -46.6361,
      elevation: 760,
      feature_code: 'PPLA',
      country_code: 'BR',
      country: 'Brasil',
      country_id: 3469034,
      timezone: 'America/Sao_Paulo',
      population: 10021295,
      admin1: 'São Paulo',
      admin1_id: 3448433,
    },
  ],
  generationtime_ms: 0.5,
};

const geocodingEmptyResponse = {
  generationtime_ms: 0.5,
};

// ============= WEATHER API RESPONSES =============

const weatherSuccessResponse = {
  latitude: -23.5475,
  longitude: -46.6361,
  elevation: 760,
  generationtime_ms: 0.5,
  utc_offset_seconds: -10800,
  timezone: 'America/Sao_Paulo',
  timezone_abbreviation: 'BRT',
  current: {
    time: '2025-12-07T10:00',
    interval: 900,
    temperature_2m: 25.5,
    relative_humidity_2m: 65,
    apparent_temperature: 27.2,
    is_day: 1,
    precipitation: 0,
    weather_code: 1,
    cloud_cover: 20,
    wind_speed_10m: 12.5,
    wind_direction_10m: 180,
  },
  daily: {
    time: ['2025-12-07', '2025-12-08', '2025-12-09'],
    weather_code: [1, 3, 61],
    temperature_2m_max: [28, 26, 24],
    temperature_2m_min: [18, 17, 16],
    precipitation_sum: [0, 0, 15],
    precipitation_probability_max: [10, 20, 80],
  },
};

export const handlers = [
  // ============= BRASIL API =============
  http.get('https://brasilapi.com.br/api/cep/v2/01310100', () => {
    return HttpResponse.json(brasilApiSuccessResponse);
  }),

  http.get('https://brasilapi.com.br/api/cep/v2/00000000', () => {
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('https://brasilapi.com.br/api/cep/v2/99999999', () => {
    return new HttpResponse(null, { status: 500 });
  }),

  // ============= VIACEP =============
  http.get('https://viacep.com.br/ws/99999999/json/', () => {
    return HttpResponse.json(viaCepSuccessResponse);
  }),

  http.get('https://viacep.com.br/ws/00000000/json/', () => {
    return HttpResponse.json(viaCepNotFoundResponse);
  }),

  // ============= GEOCODING API =============
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (name === 'CidadeInexistente') {
      return HttpResponse.json(geocodingEmptyResponse);
    }

    return HttpResponse.json(geocodingSuccessResponse);
  }),

  // ============= WEATHER API =============
  http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('latitude');

    if (lat === '0') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(weatherSuccessResponse);
  }),
];

export {
  brasilApiSuccessResponse,
  viaCepSuccessResponse,
  geocodingSuccessResponse,
  weatherSuccessResponse,
};
