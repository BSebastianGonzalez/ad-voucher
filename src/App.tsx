import { useEffect, useState } from 'react';
import type { MessageSettings, SaleInput } from './domain/types';
import { loadMessageSettings, saveMessageSettings } from './storage/settingsStorage';
import { Header } from './ui/components/Header';
import { OfflineBanner } from './ui/components/OfflineBanner';
import { NewSaleScreen } from './ui/screens/NewSaleScreen';
import { PreviewScreen } from './ui/screens/PreviewScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';

type Screen = 'new-sale' | 'preview' | 'settings';

function createInitialSale(): SaleInput {
  return {
    customerName: '',
    customerPhone: '',
    products: [
      {
        id: 'initial-1',
        name: '',
        quantity: 1,
        unitPrice: 0,
      },
    ],
  };
}

export function App() {
  const [screen, setScreen] = useState<Screen>('new-sale');
  const [returnScreen, setReturnScreen] = useState<'new-sale' | 'preview'>('new-sale');
  const [sale, setSale] = useState<SaleInput>(createInitialSale);
  const [settings, setSettings] = useState<MessageSettings>(() => loadMessageSettings());
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOpenSettings = () => {
    if (screen !== 'settings') {
      setReturnScreen(screen);
      setScreen('settings');
    }
  };

  const handleBack = () => {
    if (screen === 'settings') {
      setScreen(returnScreen);
    } else if (screen === 'preview') {
      setScreen('new-sale');
    }
  };

  const handleSaveSettings = (next: MessageSettings) => {
    setSettings(next);
    saveMessageSettings(next);
  };

  return (
    <div className="app-shell">
      <Header
        showBack={screen !== 'new-sale'}
        onBack={handleBack}
        showSettings={screen !== 'settings'}
        onOpenSettings={handleOpenSettings}
      />
      <OfflineBanner isOffline={isOffline} />

      <main>
        {screen === 'new-sale' ? (
          <NewSaleScreen
            sale={sale}
            onChangeSale={setSale}
            onPreview={() => setScreen('preview')}
          />
        ) : null}

        {screen === 'preview' ? <PreviewScreen sale={sale} settings={settings} /> : null}

        {screen === 'settings' ? (
          <SettingsScreen settings={settings} onSave={handleSaveSettings} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
