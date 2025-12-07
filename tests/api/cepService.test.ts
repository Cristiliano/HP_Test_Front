import { describe, it, expect } from 'vitest';
import { fetchCep, CepNotFoundError, CepServiceError } from '../../src/api/cepService';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('CEP Service', () => {
  describe('fetchCep', () => {
    it('should fetch CEP from BrasilAPI successfully', async () => {
      const address = await fetchCep('01310100');

      expect(address).toBeDefined();
      expect(address.cep).toBe('01310-100');
      expect(address.cidade).toBe('São Paulo');
      expect(address.uf).toBe('SP');
      expect(address.bairro).toBe('Bela Vista');
      expect(address.logradouro).toBe('Avenida Paulista');
      expect(address.provider).toBe('BrasilAPI');
      expect(address.latitude).toBeDefined();
      expect(address.longitude).toBeDefined();
    });

    it('should fallback to ViaCEP when BrasilAPI fails', async () => {
      const address = await fetchCep('99999999');

      expect(address).toBeDefined();
      expect(address.provider).toBe('ViaCEP');
      expect(address.cidade).toBe('São Paulo');
      expect(address.ddd).toBe('11');
      expect(address.ibge).toBe('3550308');
      // ViaCEP doesn't provide coordinates
      expect(address.latitude).toBeUndefined();
      expect(address.longitude).toBeUndefined();
    });

    it('should throw CepNotFoundError when CEP is not found in both APIs', async () => {
      await expect(fetchCep('00000000')).rejects.toThrow(CepNotFoundError);
    });

    it('should throw error for invalid CEP format', async () => {
      await expect(fetchCep('123')).rejects.toThrow('CEP inválido');
    });

    it('should handle CEP with hyphen', async () => {
      const address = await fetchCep('01310-100');

      expect(address).toBeDefined();
      expect(address.cep).toBe('01310-100');
    });

    it('should throw CepServiceError when both APIs fail with server error', async () => {
      // Override handlers for this test
      server.use(
        http.get('https://brasilapi.com.br/api/cep/v2/11111111', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('https://viacep.com.br/ws/11111111/json/', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(fetchCep('11111111')).rejects.toThrow(CepServiceError);
    });
  });
});
