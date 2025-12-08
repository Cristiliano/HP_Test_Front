import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatCep, cleanCep } from '../../src/utils/formatters';

describe('formatters', () => {
  describe('formatCep', () => {
    it('should format CEP with 8 digits correctly', () => {
      expect(formatCep('01310100')).toBe('01310-100');
    });

    it('should return original value if not 8 digits', () => {
      expect(formatCep('0131010')).toBe('0131010');
      expect(formatCep('013101001')).toBe('013101001');
    });

    it('should handle CEP with hyphen', () => {
      expect(formatCep('01310-100')).toBe('01310-100');
    });

    it('should handle empty string', () => {
      expect(formatCep('')).toBe('');
    });
  });

  describe('cleanCep', () => {
    it('should remove non-numeric characters', () => {
      expect(cleanCep('01310-100')).toBe('01310100');
      expect(cleanCep('01.310.100')).toBe('01310100');
      expect(cleanCep('01310100abc')).toBe('01310100');
    });

    it('should return empty string for empty input', () => {
      expect(cleanCep('')).toBe('');
    });

    it('should handle already clean CEP', () => {
      expect(cleanCep('01310100')).toBe('01310100');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-07T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "agora mesmo" for less than a minute', () => {
      const timestamp = Date.now() - 30 * 1000; // 30 segundos atrás
      expect(formatRelativeTime(timestamp)).toBe('agora mesmo');
    });

    it('should return "há 1 minuto" for 1 minute ago', () => {
      const timestamp = Date.now() - 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 1 minuto');
    });

    it('should return "há X minutos" for multiple minutes', () => {
      const timestamp = Date.now() - 5 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 5 minutos');
    });

    it('should return "há 1 hora" for 1 hour ago', () => {
      const timestamp = Date.now() - 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 1 hora');
    });

    it('should return "há X horas" for multiple hours', () => {
      const timestamp = Date.now() - 3 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 3 horas');
    });

    it('should return "ontem" for 1 day ago', () => {
      const timestamp = Date.now() - 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('ontem');
    });

    it('should return "há X dias" for multiple days', () => {
      const timestamp = Date.now() - 5 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 5 dias');
    });

    it('should return "há 1 semana" for 1 week ago', () => {
      const timestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 1 semana');
    });

    it('should return "há X semanas" for multiple weeks', () => {
      const timestamp = Date.now() - 14 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 2 semanas');
    });

    it('should return "há 1 mês" for 1 month ago', () => {
      const timestamp = Date.now() - 30 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 1 mês');
    });

    it('should return "há X meses" for multiple months', () => {
      const timestamp = Date.now() - 60 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(timestamp)).toBe('há 2 meses');
    });
  });
});
