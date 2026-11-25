import { describe, expect, it } from 'vitest';
import { formatPesos, parsePesos } from '../../src/domain/currency';

describe('currency', () => {
  it('formats integer pesos with dot thousands separator', () => {
    expect(formatPesos(0)).toBe('$0');
    expect(formatPesos(500)).toBe('$500');
    expect(formatPesos(5000)).toBe('$5.000');
    expect(formatPesos(25000)).toBe('$25.000');
    expect(formatPesos(1250000)).toBe('$1.250.000');
  });

  it('truncates decimals and clamps negatives to zero', () => {
    expect(formatPesos(10999.9)).toBe('$10.999');
    expect(formatPesos(-500)).toBe('$0');
    expect(formatPesos(Number.NaN)).toBe('$0');
  });

  it('parses formatted or raw peso strings to integers', () => {
    expect(parsePesos('$20.000')).toBe(20000);
    expect(parsePesos('15000')).toBe(15000);
    expect(parsePesos('')).toBe(0);
    expect(parsePesos('abc')).toBe(0);
  });
});
