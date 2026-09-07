import React from 'react';
import {
  CalculatorId,
  CALCULATORS_LIST,
  CATEGORY_NAMES,
  CalculatorCategory,
} from '../../types/navigation';
import {
  TrendingUp,
  Ruler,
  Coins,
  Landmark,
  Calendar,
  Target,
  Calculator,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { siteConfig } from '../../config/site';
import { ThemeToggle } from './ThemeToggle';

interface SidebarDrawerProps {
  activeId: CalculatorId;
  onSelect: (id: CalculatorId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  activeId,
  onSelect,
  isOpenMobile,
  onCloseMobile,
}) => {
  const renderIcon = (id: CalculatorId, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 ${isActive ? 'text-[#112220] dark:text-white' : 'text-[#64748b] dark:text-slate-400'}`;
    switch (id) {
      case 'compound':
        return <TrendingUp className={cls} />;
      case 'unit':
        return <Ruler className={cls} />;
      case 'exchange':
        return <Coins className={cls} />;
      case 'loan':
        return <Landmark className={cls} />;
      case 'dividend':
        return <Calendar className={cls} />;
      case 'goal':
        return <Target className={cls} />;
      default:
        return <Calculator className={cls} />;
    }
  };

  const categories: CalculatorCategory[] = ['finance', 'lifestyle', 'global'];

  const menuContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0b1120] text-[#112220] dark:text-slate-100 transition-colors duration-200">
      {/* 헤더 로고 영역 (h-16 고정 및 수직 중앙 정렬 완벽 보정) */}
      <div className="h-16 px-4 border-b border-[#e5e7eb] dark:border-slate-800 flex items-center shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-md bg-[#15171a] dark:bg-slate-800 border dark:border-slate-700 text-white flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-white dark:text-[#d1ff19]" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-bold text-[15px] tracking-tight text-[#112220] dark:text-slate-100 block leading-snug truncate pt-[1px]">
              {siteConfig.name}
            </span>
            <span className="text-[11px] text-[#64748b] dark:text-slate-400 font-medium block leading-normal tracking-tight truncate">
              {siteConfig.shortNameEn}
            </span>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((cat) => {
          const items = CALCULATORS_LIST.filter((calc) => calc.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 mb-1.5 text-[11px] font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider">
                {CATEGORY_NAMES[cat]}
              </div>

              {items.map((item) => {
                const isActive = activeId === item.id;
                const isComingSoon = item.status === 'coming-soon';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-[#112220] dark:text-white font-bold border border-[#e5e7eb] dark:border-slate-700'
                        : isComingSoon
                        ? 'text-[#94a3b8] dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        : 'text-[#334155] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#112220] dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {renderIcon(item.id, isActive)}
                      <span className="text-xs sm:text-sm truncate pt-[0.5px] leading-normal">
                        {item.shortName}
                      </span>
                    </div>

                    {item.badge && (
                      <Badge
                        variant={
                          item.badge === 'NEW'
                            ? 'eyebrow'
                            : item.badge === '추천'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-[10px] px-1.5 py-0 shrink-0 ml-1.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* 하단 테마 전환 및 버전/카피라이트 푸터 */}
      <div className="p-3 border-t border-[#e5e7eb] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#64748b] dark:text-slate-400">
            화면 테마 설정
          </span>
          <ThemeToggle />
        </div>
        <p className="text-[11px] text-[#94a3b8] dark:text-slate-500 font-medium text-center border-t border-slate-200/60 dark:border-slate-800/80 pt-2">
          {siteConfig.copyright} • {siteConfig.shortName} v{siteConfig.version}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. 데스크톱 고정 사이드바 */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-[#0b1120] min-h-screen sticky top-0 h-screen z-20 transition-colors duration-200">
        {menuContent}
      </aside>

      {/* 2. 모바일 shadcn Sheet 드로어 */}
      <Sheet open={isOpenMobile} onOpenChange={(open) => !open && onCloseMobile()}>
        <SheetContent side="left" className="w-4/5 max-w-xs p-0 border-r border-[#e5e7eb] dark:border-slate-800 dark:bg-[#0b1120]">
          <SheetTitle className="sr-only">전체 계산기 메뉴</SheetTitle>
          {menuContent}
        </SheetContent>
      </Sheet>
    </>
  );
};
