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
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30 h-16 flex items-center shrink-0">
      <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 flex items-center justify-between gap-2">
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
                  className="h-9 w-9"
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
            <div className="text-[11px] font-bold text-[#112220] uppercase tracking-widest leading-normal mb-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d1ff19]" />
              <span className="pt-[0.5px]">{siteConfig.nameEn}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-[#112220] truncate tracking-tight leading-tight">
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

        {/* 우측: 커스텀 액션 */}
        {headerActions && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {headerActions}
          </div>
        )}
      </div>
    </header>
  );
};
