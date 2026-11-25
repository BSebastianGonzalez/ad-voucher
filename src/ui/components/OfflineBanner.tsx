import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  if (!isOffline) {
    return null;
  }

  return (
    <div className="offline-banner-wrap" role="status" aria-live="polite">
      <div className="offline-pill">
        <WifiOff size={16} strokeWidth={1.75} aria-hidden="true" />
        <span>Sin conexión — puedes seguir generando mensajes</span>
      </div>
    </div>
  );
}
