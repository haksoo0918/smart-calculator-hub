import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 py-2.5 sm:px-6 flex items-center justify-between gap-2">
        {/* 좌측: 모바일 햄버거 메뉴 버튼 + 계산기 타이틀 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onOpenMobileMenu}
            className="lg:hidden h-9 w-9 shrink-0"
            aria-label="메뉴 열기"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate tracking-tight">
                {currentCalculator.name}
              </h1>
              {currentCalculator.badge && (
                <Badge variant="teal" className="text-[10px] px-1.5 py-0 font-bold shrink-0">
                  {currentCalculator.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium truncate hidden sm:block">
              {currentCalculator.description}
            </p>
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
