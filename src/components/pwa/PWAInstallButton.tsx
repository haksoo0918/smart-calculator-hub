import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar';
  className?: string;
}

/**
 * PWA 원클릭 설치 유도 버튼 컴포넌트
 * - 헤더(Header) 및 사이드바(Sidebar) 듀얼 스타일 지원
 * - standalone 구동 시 자동 숨김
 * - 네이티브 설치 미지원 브라우저 클릭 시 가이드 모달 연결
 */
export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstalled, isModalOpen, closeModal, install } = usePWAInstall();

  // 이미 독립 실행(standalone) 앱으로 구동 중인 경우 숨김
  if (isInstalled) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          aria-label="스마트 계산기 앱 설치"
          onClick={install}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#112220] dark:text-slate-100 border border-[#e5e7eb] dark:border-slate-700 transition-colors ${className}`}
        >
          <Download className="w-4 h-4 text-[#112220] dark:text-slate-100 shrink-0" />
          <span className="truncate">스마트 계산기 앱 설치</span>
        </Button>
        <PWAInstallModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }

  // Header variant (상시 노출)
  return (
    <>
      <div className={`flex items-center ${className}`}>
        {/* 데스크톱: 아이콘 + 텍스트 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="스마트 계산기 앱 설치"
          onClick={install}
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-md border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100 transition-colors"
        >
          <Download className="w-4 h-4 text-[#112220] dark:text-slate-100 shrink-0" />
          <span>앱 설치</span>
        </Button>

        {/* 모바일: 아이콘 단독 + 툴팁 */}
        <div className="sm:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={install}
                className="h-9 w-9 rounded-md border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100 transition-colors"
                aria-label="스마트 계산기 앱 설치"
              >
                <Download className="w-4 h-4 text-[#112220] dark:text-slate-100" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">앱 설치</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <PWAInstallModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};
