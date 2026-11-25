import { normalizeColombianPhone } from '../../domain/phone';
import { buildWhatsAppUrl, renderReceiptMessage } from '../../domain/template';
import type { MessageSettings, SaleInput } from '../../domain/types';
import { BottomBar } from '../components/BottomBar';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

interface PreviewScreenProps {
  sale: SaleInput;
  settings: MessageSettings;
}

export function PreviewScreen({ sale, settings }: PreviewScreenProps) {
  const message = renderReceiptMessage(sale, settings);
  const phoneResult = normalizeColombianPhone(sale.customerPhone);
  const whatsappUrl = buildWhatsAppUrl(phoneResult.normalized, message);

  return (
    <>
      <div className="main-content">
        <h1 className="screen-title">Así lo recibirá el cliente</h1>

        <div className="wa-preview-container">
          <div className="wa-bubble">{message}</div>
        </div>
      </div>

      <BottomBar>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <WhatsAppIcon />
          Enviar por WhatsApp
        </a>
      </BottomBar>
    </>
  );
}
