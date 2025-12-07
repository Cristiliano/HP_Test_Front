import { http, HttpResponse } from 'msw';

// Respostas simuladas
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

export const handlers = [
  // BrasilAPI - Sucesso
  http.get('https://brasilapi.com.br/api/cep/v2/01310100', () => {
    return HttpResponse.json(brasilApiSuccessResponse);
  }),

  // BrasilAPI - Não encontrado (fallback para ViaCEP)
  http.get('https://brasilapi.com.br/api/cep/v2/00000000', () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // BrasilAPI - Erro do servidor (fallback para ViaCEP)
  http.get('https://brasilapi.com.br/api/cep/v2/99999999', () => {
    return new HttpResponse(null, { status: 500 });
  }),

  // ViaCEP - Sucesso (fallback)
  http.get('https://viacep.com.br/ws/99999999/json/', () => {
    return HttpResponse.json(viaCepSuccessResponse);
  }),

  // ViaCEP - Não encontrado
  http.get('https://viacep.com.br/ws/00000000/json/', () => {
    return HttpResponse.json(viaCepNotFoundResponse);
  }),
];
