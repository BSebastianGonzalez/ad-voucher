import { useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { DEFAULT_MESSAGE_SETTINGS, renderReceiptMessage } from '../../domain/template';
import type { MessageSettings, SaleInput } from '../../domain/types';
import { BottomBar } from '../components/BottomBar';

interface SettingsScreenProps {
  settings: MessageSettings;
  onSave: (next: MessageSettings) => void;
}

const SAMPLE_SALE: SaleInput = {
  customerName: 'Carlos Pérez',
  customerPhone: '300 123 4567',
  products: [
    { id: 'sample-1', name: 'Producto A', quantity: 2, unitPrice: 10000 },
    { id: 'sample-2', name: 'Producto B', quantity: 1, unitPrice: 5000 },
  ],
};

export function SettingsScreen({ settings, onSave }: SettingsScreenProps) {
  const [greeting, setGreeting] = useState(settings.greeting);
  const [farewell, setFarewell] = useState(settings.farewell);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }
    const timer = window.setTimeout(() => setShowToast(false), 2000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const previewMessage = renderReceiptMessage(SAMPLE_SALE, { greeting, farewell });

  const handleRestore = () => {
    setGreeting(DEFAULT_MESSAGE_SETTINGS.greeting);
    setFarewell(DEFAULT_MESSAGE_SETTINGS.farewell);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      greeting: greeting.trim() || DEFAULT_MESSAGE_SETTINGS.greeting,
      farewell: farewell.trim() || DEFAULT_MESSAGE_SETTINGS.farewell,
    });
    setShowToast(true);
  };

  return (
    <form onSubmit={handleSave}>
      <div className="main-content">
        <h1 className="screen-title">Ajustes de mensaje</h1>

        <div className="card">
          <div className="field">
            <label htmlFor="settings-greeting" className="field-label">
              Saludo
            </label>
            <textarea
              id="settings-greeting"
              className="textarea"
              rows={2}
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-farewell" className="field-label">
              Despedida
            </label>
            <textarea
              id="settings-farewell"
              className="textarea"
              rows={2}
              value={farewell}
              onChange={(e) => setFarewell(e.target.value)}
            />
          </div>

          <button type="button" className="btn-secondary" onClick={handleRestore}>
            <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            Restaurar original
          </button>
        </div>

        <section aria-labelledby="section-live-preview">
          <div className="section-header">
            <h2 id="section-live-preview" className="section-title">
              Vista previa
            </h2>
          </div>

          <div className="wa-preview-container">
            <div className="wa-bubble">{previewMessage}</div>
          </div>
        </section>
      </div>

      {showToast ? (
        <div className="toast" role="status" aria-live="polite">
          <Check size={18} strokeWidth={2} aria-hidden="true" />
          <span>Ajustes guardados</span>
        </div>
      ) : null}

      <BottomBar>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </BottomBar>
    </form>
  );
}
