import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. 이미 standalone 모드인지 확인
    const isStandalone =
      Boolean(typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)')?.matches) ||
      Boolean(typeof window !== 'undefined' && (window.navigator as unknown as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // 3. appinstalled 이벤트 리스너
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
    } catch (err) {
      console.error('Error during PWA prompt:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
  };
}
