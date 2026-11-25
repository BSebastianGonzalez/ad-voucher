import { normalizeColombianPhone } from './phone';
import type { ProductError, ProductItem, SaleInput, SaleValidationErrors } from './types';

/**
 * Calculates the integer COP subtotal for a single product line.
 */
export function calculateProductSubtotal(product: Pick<ProductItem, 'quantity' | 'unitPrice'>): number {
  const qty = Number.isFinite(product.quantity) ? Math.max(0, Math.trunc(product.quantity)) : 0;
  const price = Number.isFinite(product.unitPrice) ? Math.max(0, Math.trunc(product.unitPrice)) : 0;
  return qty * price;
}

/**
 * Calculates the total integer COP amount across all products.
 */
export function calculateSaleTotal(products: readonly ProductItem[]): number {
  return products.reduce((sum, item) => sum + calculateProductSubtotal(item), 0);
}

/**
 * Validates customer fields and product items before generating the WhatsApp message.
 */
export function validateSale(sale: SaleInput): {
  isValid: boolean;
  errors: SaleValidationErrors;
} {
  const errors: SaleValidationErrors = {
    productItems: {},
  };

  if (!sale.customerName.trim()) {
    errors.customerName = 'Ingresa el nombre del cliente';
  }

  const phoneResult = normalizeColombianPhone(sale.customerPhone);
  if (!phoneResult.isValid) {
    errors.customerPhone = phoneResult.error;
  }

  if (sale.products.length === 0) {
    errors.products = 'Agrega al menos un producto';
  }

  for (const item of sale.products) {
    const itemError: ProductError = {};
    if (!item.name.trim()) {
      itemError.name = 'Ingresa el nombre del producto';
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      itemError.quantity = 'Mínimo 1';
    }
    if (!Number.isInteger(item.unitPrice) || item.unitPrice <= 0) {
      itemError.unitPrice = 'Ingresa un precio válido';
    }

    if (Object.keys(itemError).length > 0) {
      errors.productItems[item.id] = itemError;
    }
  }

  const isValid =
    !errors.customerName &&
    !errors.customerPhone &&
    !errors.products &&
    Object.keys(errors.productItems).length === 0;

  return { isValid, errors };
}
