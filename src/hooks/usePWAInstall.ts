import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// 브라우저의 일회성 beforeinstallprompt 이벤트를 컴포넌트 간 공유하기 위한 모듈 캐시
let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    cachedDeferredPrompt = e as BeforeInstallPromptEvent;
    subscribers.forEach((cb) => cb(cachedDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    cachedDeferredPrompt = null;
    subscribers.forEach((cb) => cb(null));
  });
}

/**
 * PWA 설치 이벤트 관리 및 설치 유도 모달 제어를 위한 커스텀 훅
 * - standalone(기존 설치 실행) 여부 감지
 * - beforeinstallprompt 네이티브 이벤트 전역 캡처 및 구독
 * - 네이티브 미지원 플랫폼(iOS 등) 대응 설치 가이드 모달 상태 제공
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(cachedDeferredPrompt);
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

    const handler = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
      if (!prompt) {
        const standaloneCheck =
          Boolean(typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)')?.matches) ||
          Boolean(typeof window !== 'undefined' && (window.navigator as unknown as { standalone?: boolean }).standalone === true);
        if (standaloneCheck) {
          setIsInstalled(true);
          setIsModalOpen(false);
        }
      }
    };

    subscribers.add(handler);
    setDeferredPrompt(cachedDeferredPrompt);

    return () => {
      subscribers.delete(handler);
    };
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const install = useCallback(async () => {
    // 브라우저 네이티브 설치 프롬프트가 지원되면 즉시 실행
    if (cachedDeferredPrompt) {
      try {
        await cachedDeferredPrompt.prompt();
        const choiceResult = await cachedDeferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          cachedDeferredPrompt = null;
          subscribers.forEach((cb) => cb(null));
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error during PWA prompt:', err);
      }
      return;
    }

    // 네이티브 프롬프트가 없는 환경(iOS Safari, 데스크톱 등)에서는 안내 모달 오픈
    setIsModalOpen(true);
  }, []);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isModalOpen,
    openModal,
    closeModal,
    install,
  };
}

