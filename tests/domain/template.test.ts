import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  DEFAULT_MESSAGE_SETTINGS,
  renderReceiptMessage,
} from '../../src/domain/template';

describe('template', () => {
  it('renders the receipt matching the AGENTS.md example', () => {
    const message = renderReceiptMessage(
      {
        customerName: 'Carlos Pérez',
        customerPhone: '3001234567',
        products: [
          { id: '1', name: 'Producto A', quantity: 2, unitPrice: 10000 },
          { id: '2', name: 'Producto B', quantity: 1, unitPrice: 5000 },
        ],
      },
      DEFAULT_MESSAGE_SETTINGS
    );

    expect(message).toBe(
      [
        '🎄 ¡Gracias por comprar en AdrianaDigital!',
        '',
        'Nombre: Carlos Pérez',
        'Celular: 300 123 4567',
        '',
        '🎁 Productos:',
        '2 x Producto A — $20.000',
        '1 x Producto B — $5.000',
        '',
        'Total: $25.000',
        '',
        '¡Esperamos que regrese y le deseamos feliz navidad ^^! 🎅',
      ].join('\n')
    );
  });

  it('uses custom greeting and farewell and never includes the word factura', () => {
    const message = renderReceiptMessage(
      {
        customerName: 'Ana Gómez',
        customerPhone: '310 555 0000',
        products: [{ id: '1', name: 'Audífonos', quantity: 1, unitPrice: 45000 }],
      },
      {
        greeting: '¡Hola! Gracias por tu compra',
        farewell: '¡Vuelve pronto!',
      }
    );

    expect(message.startsWith('¡Hola! Gracias por tu compra')).toBe(true);
    expect(message.endsWith('¡Vuelve pronto!')).toBe(true);
    expect(message.toLowerCase()).not.toContain('factura');
  });

  it('encodes line breaks, accents, and emojis in the WhatsApp URL', () => {
    const url = buildWhatsAppUrl('573001234567', 'Hola\n🎄');
    expect(url).toBe('https://wa.me/573001234567?text=Hola%0A%F0%9F%8E%84');
  });
});
