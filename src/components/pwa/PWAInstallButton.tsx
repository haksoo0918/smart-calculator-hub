import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, install } = usePWAInstall();

  // 설치 불가능한 브라우저이거나 이미 설치된 경우 숨김
  if (!isInstallable) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={install}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-[#112220] dark:text-slate-100 border border-[#e5e7eb] dark:border-slate-700 transition-colors shadow-sm ${className}`}
      >
        <Download className="w-4 h-4 text-[#23D486] dark:text-[#d1ff19] shrink-0" />
        <span className="truncate">스마트 계산기 앱 설치</span>
      </Button>
    );
  }

  // Header variant
  return (
    <div className={`flex items-center ${className}`}>
      {/* 데스크톱: 아이콘 + 텍스트 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={install}
        className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-xs font-bold rounded-lg border-[#e5e7eb] dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100 transition-colors shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-[#23D486] dark:text-[#d1ff19]" />
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
              className="h-9 w-9 rounded-lg border-[#e5e7eb] dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100"
              aria-label="스마트 계산기 앱 설치"
            >
              <Download className="w-4 h-4 text-[#23D486] dark:text-[#d1ff19]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">앱 설치</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
