import { describe, it, expect } from 'vitest';
import { cepSchema } from '../../src/schemas/cepSchema';

describe('CEP Schema Validation', () => {
  it('should validate a valid CEP with hyphen', () => {
    const result = cepSchema.safeParse({ cep: '01310-100' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cep).toBe('01310100');
    }
  });

  it('should validate a valid CEP without hyphen', () => {
    const result = cepSchema.safeParse({ cep: '01310100' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cep).toBe('01310100');
    }
  });

  it('should reject a CEP with less than 8 digits', () => {
    const result = cepSchema.safeParse({ cep: '0131010' });
    expect(result.success).toBe(false);
  });

  it('should reject a CEP with more than 8 digits', () => {
    const result = cepSchema.safeParse({ cep: '013101000' });
    expect(result.success).toBe(false);
  });

  it('should reject an empty CEP', () => {
    const result = cepSchema.safeParse({ cep: '' });
    expect(result.success).toBe(false);
  });

  it('should strip non-numeric characters', () => {
    const result = cepSchema.safeParse({ cep: '01310-100abc' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cep).toBe('01310100');
    }
  });
});
