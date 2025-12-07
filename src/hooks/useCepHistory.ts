import { useState, useCallback, useEffect } from 'react';
import type { Address, CepHistoryItem } from '@/types';
import { HISTORY_CONFIG } from '@/lib/config';

function loadHistory(): CepHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_CONFIG.STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history: CepHistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_CONFIG.STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.warn('Falha ao salvar histórico no localStorage');
  }
}

export function useCepHistory() {
  const [history, setHistory] = useState<CepHistoryItem[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addToHistory = useCallback((address: Address) => {
    const newItem: CepHistoryItem = {
      cep: address.cep,
      cidade: address.cidade,
      uf: address.uf,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.cep !== newItem.cep);
      const updated = [newItem, ...filtered];
      return updated.slice(0, HISTORY_CONFIG.MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((cep: string) => {
    setHistory((prev) => prev.filter((item) => item.cep !== cep));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    isEmpty: history.length === 0,
  };
}
