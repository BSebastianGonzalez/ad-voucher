import { describe, expect, it } from 'vitest';
import { calculateProductSubtotal, calculateSaleTotal, validateSale } from '../../src/domain/sale';

describe('sale', () => {
  it('calculates product subtotals and total as integer sum of quantity x unitPrice', () => {
    const products = [
      { id: '1', name: 'Producto A', quantity: 2, unitPrice: 10000 },
      { id: '2', name: 'Producto B', quantity: 1, unitPrice: 5000 },
    ];
    expect(calculateProductSubtotal(products[0])).toBe(20000);
    expect(calculateSaleTotal(products)).toBe(25000);
  });

  it('handles zero quantity safely', () => {
    expect(calculateProductSubtotal({ quantity: 0, unitPrice: 10000 })).toBe(0);
    expect(calculateSaleTotal([])).toBe(0);
  });

  it('validates required customer and product fields', () => {
    const invalid = validateSale({
      customerName: ' ',
      customerPhone: '123',
      products: [{ id: 'p1', name: '', quantity: 0, unitPrice: 0 }],
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.customerName).toBeDefined();
    expect(invalid.errors.customerPhone).toBeDefined();
    expect(invalid.errors.productItems.p1?.name).toBeDefined();
    expect(invalid.errors.productItems.p1?.quantity).toBeDefined();
    expect(invalid.errors.productItems.p1?.unitPrice).toBeDefined();

    const valid = validateSale({
      customerName: 'Carlos Pérez',
      customerPhone: '300 123 4567',
      products: [{ id: 'p1', name: 'Producto A', quantity: 2, unitPrice: 10000 }],
    });
    expect(valid.isValid).toBe(true);
  });
});
