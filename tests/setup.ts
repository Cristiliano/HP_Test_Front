import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Estabelecer mock de API antes de todos os testes.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Resetar qualquer handler de requisição que adicionemos durante os testes,
// para que não afetem outros testes.
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Limpar após os testes serem finalizados.
afterAll(() => server.close());
