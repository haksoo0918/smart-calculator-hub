import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { siteConfig } from '../../config/site';

interface GlobalHeaderProps {
  currentCalculator: CalculatorItem;
  onOpenMobileMenu: () => void;
  headerActions?: React.ReactNode;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentCalculator,
  onOpenMobileMenu,
  headerActions,
}) => {
  return (
    <header className="bg-white dark:bg-[#0b1120] border-b border-[#e5e7eb] dark:border-slate-800 sticky top-0 z-30 h-16 flex items-center shrink-0 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* 좌측: 모바일 햄버거 메뉴 버튼 + 계산기 타이틀 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="lg:hidden shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onOpenMobileMenu}
                  className="h-9 w-9 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="메뉴 열기"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">메뉴 열기</TooltipContent>
            </Tooltip>
          </div>

          <div className="min-w-0">
            {/* Ghost Signature: 12px Uppercase Eyebrow */}
            <div className="text-[11px] font-bold text-[#112220] dark:text-slate-300 uppercase tracking-widest leading-normal mb-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d1ff19]" />
              <span className="pt-[0.5px]">{siteConfig.nameEn}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-[#112220] dark:text-slate-100 truncate tracking-tight leading-tight">
                {currentCalculator.name}
              </h1>
              {currentCalculator.badge && (
                <Badge variant={currentCalculator.badge === 'NEW' ? 'eyebrow' : 'default'} className="text-[10px] px-1.5 py-0 shrink-0">
                  {currentCalculator.badge}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 커스텀 액션, PWA 앱 설치 버튼 및 테마 토글 스위치 */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {headerActions}
          <PWAInstallButton variant="header" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
