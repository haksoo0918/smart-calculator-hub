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
    const cls = `w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-500'}`;
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
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* 헤더 로고 영역 */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
              스마트 계산기 허브
            </span>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
              Multi-Calculator Hub
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
              <div className="px-2.5 mb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-900 font-bold shadow-xs border border-teal-200/80'
                        : isComingSoon
                        ? 'text-slate-500 hover:bg-slate-50 opacity-80'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {renderIcon(item.id, isActive)}
                      <span className="text-xs sm:text-sm truncate">
                        {item.shortName}
                      </span>
                    </div>

                    {item.badge && (
                      <Badge
                        variant={
                          isActive
                            ? 'default'
                            : item.badge === 'NEW'
                            ? 'teal'
                            : item.badge === '추천'
                            ? 'indigo'
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

      {/* 하단 버전 푸터 */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          스마트 계산기 v1.3.0 • shadcn/ui
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. 데스크톱 고정 사이드바 */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 bg-white min-h-screen sticky top-0 h-screen z-20">
        {menuContent}
      </aside>

      {/* 2. 모바일 shadcn Sheet 드로어 */}
      <Sheet open={isOpenMobile} onOpenChange={(open) => !open && onCloseMobile()}>
        <SheetContent side="left" className="w-4/5 max-w-xs p-0 border-r border-slate-200">
          <SheetTitle className="sr-only">전체 계산기 메뉴</SheetTitle>
          {menuContent}
        </SheetContent>
      </Sheet>
    </>
  );
};
