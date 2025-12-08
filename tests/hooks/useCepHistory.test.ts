import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCepHistory } from '../../src/hooks/useCepHistory';
import type { Address } from '../../src/types';

const mockAddress: Address = {
  cep: '01310-100',
  logradouro: 'Avenida Paulista',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  uf: 'SP',
  provider: 'BrasilAPI',
};

const mockAddress2: Address = {
  cep: '22041-080',
  logradouro: 'Avenida Atlântica',
  bairro: 'Copacabana',
  cidade: 'Rio de Janeiro',
  uf: 'RJ',
  provider: 'ViaCEP',
};

describe('useCepHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-07T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with empty history', () => {
    const { result } = renderHook(() => useCepHistory());

    expect(result.current.history).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it('should add item to history', () => {
    const { result } = renderHook(() => useCepHistory());

    act(() => {
      result.current.addToHistory(mockAddress);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].cep).toBe('01310-100');
    expect(result.current.history[0].cidade).toBe('São Paulo');
    expect(result.current.history[0].uf).toBe('SP');
    expect(result.current.isEmpty).toBe(false);
  });

  it('should persist history to localStorage', () => {
    const { result } = renderHook(() => useCepHistory());

    act(() => {
      result.current.addToHistory(mockAddress);
    });

    const stored = localStorage.getItem('cep-history');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].cep).toBe('01310-100');
  });

  it('should load history from localStorage on mount', () => {
    const existingHistory = [
      { cep: '01310-100', cidade: 'São Paulo', uf: 'SP', timestamp: Date.now() },
    ];
    localStorage.setItem('cep-history', JSON.stringify(existingHistory));

    const { result } = renderHook(() => useCepHistory());

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].cep).toBe('01310-100');
  });

  it('should move existing CEP to top when added again', () => {
    const { result } = renderHook(() => useCepHistory());

    act(() => {
      result.current.addToHistory(mockAddress);
    });

    vi.advanceTimersByTime(1000);

    act(() => {
      result.current.addToHistory(mockAddress2);
    });

    expect(result.current.history[0].cep).toBe('22041-080');
    expect(result.current.history[1].cep).toBe('01310-100');

    vi.advanceTimersByTime(1000);

    act(() => {
      result.current.addToHistory(mockAddress);
    });

    expect(result.current.history[0].cep).toBe('01310-100');
    expect(result.current.history[1].cep).toBe('22041-080');
    expect(result.current.history).toHaveLength(2);
  });

  it('should limit history to 6 items', () => {
    const { result } = renderHook(() => useCepHistory());

    for (let i = 0; i < 8; i++) {
      vi.advanceTimersByTime(100);
      act(() => {
        result.current.addToHistory({
          ...mockAddress,
          cep: `0000000${i}`,
          cidade: `Cidade ${i}`,
        });
      });
    }

    expect(result.current.history).toHaveLength(6);
    expect(result.current.history[0].cep).toBe('00000007');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useCepHistory());

    act(() => {
      result.current.addToHistory(mockAddress);
      result.current.addToHistory(mockAddress2);
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it('should remove specific item from history', () => {
    const { result } = renderHook(() => useCepHistory());

    act(() => {
      result.current.addToHistory(mockAddress);
    });

    vi.advanceTimersByTime(100);

    act(() => {
      result.current.addToHistory(mockAddress2);
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.removeFromHistory('01310-100');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].cep).toBe('22041-080');
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('cep-history', 'invalid json');

    const { result } = renderHook(() => useCepHistory());

    expect(result.current.history).toEqual([]);
  });

  it('should handle non-array localStorage data', () => {
    localStorage.setItem('cep-history', '{"not": "an array"}');

    const { result } = renderHook(() => useCepHistory());

    expect(result.current.history).toEqual([]);
  });
});
