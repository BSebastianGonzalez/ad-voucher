import { useState } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { formatPesos, parsePesos } from '../../domain/currency';
import { calculateSaleTotal, validateSale } from '../../domain/sale';
import type { ProductItem, SaleInput } from '../../domain/types';
import { BottomBar } from '../components/BottomBar';

interface NewSaleScreenProps {
  sale: SaleInput;
  onChangeSale: (next: SaleInput) => void;
  onPreview: () => void;
}

export function NewSaleScreen({ sale, onChangeSale, onPreview }: NewSaleScreenProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedPriceId, setFocusedPriceId] = useState<string | null>(null);

  const validation = validateSale(sale);
  const total = calculateSaleTotal(sale.products);

  const markTouched = (key: string) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  const handleAddProduct = () => {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const nextProduct: ProductItem = {
      id,
      name: '',
      quantity: 1,
      unitPrice: 0,
    };

    onChangeSale({
      ...sale,
      products: [...sale.products, nextProduct],
    });
  };

  const handleUpdateProduct = (id: string, patch: Partial<ProductItem>) => {
    onChangeSale({
      ...sale,
      products: sale.products.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  const handleRemoveProduct = (id: string) => {
    onChangeSale({
      ...sale,
      products: sale.products.filter((item) => item.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      const allTouched: Record<string, boolean> = {
        customerName: true,
        customerPhone: true,
      };
      for (const p of sale.products) {
        allTouched[`name-${p.id}`] = true;
        allTouched[`qty-${p.id}`] = true;
        allTouched[`price-${p.id}`] = true;
      }
      setTouched(allTouched);
      return;
    }
    onPreview();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="main-content">
        <h1 className="screen-title">Nueva venta</h1>

        <section aria-labelledby="section-customer">
          <div className="section-header">
            <h2 id="section-customer" className="section-title">
              Cliente
            </h2>
          </div>

          <div className="card">
            <div className="field">
              <label htmlFor="customer-name" className="field-label">
                Nombre
              </label>
              <input
                id="customer-name"
                type="text"
                className={`input ${touched.customerName && validation.errors.customerName ? 'input--error' : ''}`}
                placeholder="Carlos Pérez"
                value={sale.customerName}
                onChange={(e) => onChangeSale({ ...sale, customerName: e.target.value })}
                onBlur={() => markTouched('customerName')}
                aria-invalid={Boolean(touched.customerName && validation.errors.customerName)}
                aria-describedby={
                  touched.customerName && validation.errors.customerName
                    ? 'customer-name-error'
                    : undefined
                }
              />
              {touched.customerName && validation.errors.customerName ? (
                <span id="customer-name-error" className="error-text" role="alert">
                  <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                  {validation.errors.customerName}
                </span>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="customer-phone" className="field-label">
                Celular
              </label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="tel"
                className={`input ${touched.customerPhone && validation.errors.customerPhone ? 'input--error' : ''}`}
                placeholder="300 123 4567"
                value={sale.customerPhone}
                onChange={(e) => onChangeSale({ ...sale, customerPhone: e.target.value })}
                onBlur={() => markTouched('customerPhone')}
                aria-invalid={Boolean(touched.customerPhone && validation.errors.customerPhone)}
                aria-describedby={
                  touched.customerPhone && validation.errors.customerPhone
                    ? 'customer-phone-error'
                    : undefined
                }
              />
              {touched.customerPhone && validation.errors.customerPhone ? (
                <span id="customer-phone-error" className="error-text" role="alert">
                  <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                  {validation.errors.customerPhone}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section aria-labelledby="section-products">
          <div className="section-header">
            <h2 id="section-products" className="section-title">
              Productos
            </h2>
          </div>

          <div className="product-list">
            {sale.products.length === 0 ? (
              <div className="card">
                <p className="empty-products">Agrega el primer producto</p>
              </div>
            ) : (
              sale.products.map((item) => {
                const itemErrors = validation.errors.productItems[item.id];
                const nameError = touched[`name-${item.id}`] ? itemErrors?.name : undefined;
                const qtyError = touched[`qty-${item.id}`] ? itemErrors?.quantity : undefined;
                const priceError = touched[`price-${item.id}`] ? itemErrors?.unitPrice : undefined;
                const isPriceFocused = focusedPriceId === item.id;

                return (
                  <div key={item.id} className="card">
                    <div className="field">
                      <label htmlFor={`product-name-${item.id}`} className="field-label">
                        Producto
                      </label>
                      <input
                        id={`product-name-${item.id}`}
                        type="text"
                        className={`input ${nameError ? 'input--error' : ''}`}
                        placeholder="Ej. Audífonos"
                        value={item.name}
                        onChange={(e) => handleUpdateProduct(item.id, { name: e.target.value })}
                        onBlur={() => markTouched(`name-${item.id}`)}
                        aria-invalid={Boolean(nameError)}
                        aria-describedby={nameError ? `product-name-error-${item.id}` : undefined}
                      />
                      {nameError ? (
                        <span id={`product-name-error-${item.id}`} className="error-text" role="alert">
                          <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                          {nameError}
                        </span>
                      ) : null}
                    </div>

                    <div className="product-row-grid">
                      <div className="field">
                        <label htmlFor={`product-qty-${item.id}`} className="field-label">
                          Cant.
                        </label>
                        <input
                          id={`product-qty-${item.id}`}
                          type="text"
                          inputMode="numeric"
                          className={`input ${qtyError ? 'input--error' : ''}`}
                          value={item.quantity === 0 ? '' : String(item.quantity)}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '');
                            handleUpdateProduct(item.id, {
                              quantity: digits ? Number.parseInt(digits, 10) : 0,
                            });
                          }}
                          onBlur={() => markTouched(`qty-${item.id}`)}
                          aria-invalid={Boolean(qtyError)}
                          aria-describedby={qtyError ? `product-qty-error-${item.id}` : undefined}
                        />
                        {qtyError ? (
                          <span id={`product-qty-error-${item.id}`} className="error-text" role="alert">
                            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                            {qtyError}
                          </span>
                        ) : null}
                      </div>

                      <div className="field">
                        <label htmlFor={`product-price-${item.id}`} className="field-label">
                          Precio
                        </label>
                        <input
                          id={`product-price-${item.id}`}
                          type="text"
                          inputMode="numeric"
                          className={`input ${priceError ? 'input--error' : ''}`}
                          placeholder="$0"
                          value={
                            isPriceFocused
                              ? item.unitPrice === 0
                                ? ''
                                : String(item.unitPrice)
                              : item.unitPrice === 0
                                ? ''
                                : formatPesos(item.unitPrice)
                          }
                          onFocus={() => setFocusedPriceId(item.id)}
                          onChange={(e) =>
                            handleUpdateProduct(item.id, {
                              unitPrice: parsePesos(e.target.value),
                            })
                          }
                          onBlur={() => {
                            setFocusedPriceId(null);
                            markTouched(`price-${item.id}`);
                          }}
                          aria-invalid={Boolean(priceError)}
                          aria-describedby={priceError ? `product-price-error-${item.id}` : undefined}
                        />
                        {priceError ? (
                          <span id={`product-price-error-${item.id}`} className="error-text" role="alert">
                            <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                            {priceError}
                          </span>
                        ) : null}
                      </div>

                      <div className="product-delete-wrap">
                        <button
                          type="button"
                          className="icon-button icon-button--danger"
                          onClick={() => handleRemoveProduct(item.id)}
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={20} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button type="button" className="btn-secondary" onClick={handleAddProduct}>
              <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
              Agregar producto
            </button>
          </div>
        </section>

        <div className="total-bar" aria-live="polite">
          <span className="total-label">Total</span>
          <span className="total-amount">{formatPesos(total)}</span>
        </div>
      </div>

      <BottomBar>
        <button type="submit" className="btn-primary" disabled={!validation.isValid}>
          Ver mensaje
        </button>
      </BottomBar>
    </form>
  );
}
