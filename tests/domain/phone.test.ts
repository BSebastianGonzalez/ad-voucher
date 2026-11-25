import { describe, expect, it } from 'vitest';
import { formatPhoneForMessage, normalizeColombianPhone } from '../../src/domain/phone';

describe('phone', () => {
  it('strips spaces, hyphens, and symbols and prepends 57 for 10-digit numbers', () => {
    expect(normalizeColombianPhone('300 123 4567')).toEqual({
      isValid: true,
      normalized: '573001234567',
    });
    expect(normalizeColombianPhone('300-123-4567')).toEqual({
      isValid: true,
      normalized: '573001234567',
    });
  });

  it('accepts numbers that already include +57 or 57', () => {
    expect(normalizeColombianPhone('+57 300 123 4567')).toEqual({
      isValid: true,
      normalized: '573001234567',
    });
    expect(normalizeColombianPhone('573001234567')).toEqual({
      isValid: true,
      normalized: '573001234567',
    });
  });

  it('rejects empty or invalid-length numbers', () => {
    expect(normalizeColombianPhone('').isValid).toBe(false);
    expect(normalizeColombianPhone('300123').isValid).toBe(false);
    expect(normalizeColombianPhone('300123456789').isValid).toBe(false);
  });

  it('formats valid Colombian numbers for the receipt message', () => {
    expect(formatPhoneForMessage('3001234567')).toBe('300 123 4567');
    expect(formatPhoneForMessage('+57 315-987-6543')).toBe('315 987 6543');
  });
});
