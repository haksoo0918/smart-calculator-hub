import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA 설치 이벤트 관리 및 설치 유도 모달 제어를 위한 커스텀 훅
 * - standalone(기존 설치 실행) 여부 감지
 * - beforeinstallprompt 네이티브 이벤트 캡처
 * - 네이티브 미지원 플랫폼(iOS 등) 대응 설치 가이드 모달 상태 제공
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    // 브라우저 네이티브 설치 프롬프트가 지원되면 즉시 실행
    if (deferredPrompt) {
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
      return;
    }

    // 네이티브 프롬프트가 없는 환경(iOS Safari, 데스크톱 등)에서는 안내 모달 오픈
    setIsModalOpen(true);
  };

  return {
    isInstallable,
    isInstalled,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    install,
  };
}
