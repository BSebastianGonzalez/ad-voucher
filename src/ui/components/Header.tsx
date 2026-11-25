import { ArrowLeft, Settings } from 'lucide-react';
import logoUrl from '../../assets/logo.png';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onOpenSettings?: () => void;
}

export function Header({
  showBack = false,
  onBack,
  showSettings = true,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-slot-left">
          {showBack && onBack ? (
            <button
              type="button"
              className="icon-button"
              onClick={onBack}
              aria-label="Volver"
            >
              <ArrowLeft size={24} strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <img
          src={logoUrl}
          alt="AdrianaDigital"
          className="header-logo"
        />

        <div className="header-slot-right">
          {showSettings && onOpenSettings ? (
            <button
              type="button"
              className="icon-button"
              onClick={onOpenSettings}
              aria-label="Ajustes"
            >
              <Settings size={24} strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="header-gradient" aria-hidden="true" />
    </header>
  );
}
