import { formatPesos } from './currency';
import { formatPhoneForMessage } from './phone';
import { calculateProductSubtotal, calculateSaleTotal } from './sale';
import type { MessageSettings, SaleInput } from './types';

export const DEFAULT_MESSAGE_SETTINGS: MessageSettings = {
  greeting: '🎄 ¡Gracias por comprar en AdrianaDigital!',
  farewell: '¡Esperamos que regrese y le deseamos feliz navidad ^^! 🎅',
};

/**
 * Renders the WhatsApp receipt message from the active greeting, farewell, and sale details.
 */
export function renderReceiptMessage(sale: SaleInput, settings: MessageSettings): string {
  const greeting = settings.greeting.trim() || DEFAULT_MESSAGE_SETTINGS.greeting;
  const farewell = settings.farewell.trim() || DEFAULT_MESSAGE_SETTINGS.farewell;

  const productLines = sale.products.map((item) => {
    const qty = Math.max(0, Math.trunc(item.quantity));
    const lineTotal = formatPesos(calculateProductSubtotal(item));
    return `${qty} x ${item.name.trim()} — ${lineTotal}`;
  });

  const totalFormatted = formatPesos(calculateSaleTotal(sale.products));
  const phoneFormatted = formatPhoneForMessage(sale.customerPhone);

  return [
    greeting,
    '',
    `Nombre: ${sale.customerName.trim()}`,
    `Celular: ${phoneFormatted}`,
    '',
    '🎁 Productos:',
    ...productLines,
    '',
    `Total: ${totalFormatted}`,
    '',
    farewell,
  ].join('\n');
}

/**
 * Builds the `https://wa.me/` deep link with URL-encoded message text.
 */
export function buildWhatsAppUrl(normalizedPhone: string, message: string): string {
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
