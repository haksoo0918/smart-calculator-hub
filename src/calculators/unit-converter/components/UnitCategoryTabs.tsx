import React from 'react';
import { UnitCategory } from '../../../types/unit';
import { UNIT_CATEGORIES } from '../../../utils/unitConverter';
import { Square, Ruler, Scale, Box, Thermometer } from 'lucide-react';

interface UnitCategoryTabsProps {
  activeCategory: UnitCategory;
  onSelectCategory: (category: UnitCategory) => void;
}

export const UnitCategoryTabs: React.FC<UnitCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (cat: UnitCategory, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 transition-colors ${
      isActive ? 'text-[#d1ff19]' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
    }`;
    switch (cat) {
      case 'area':
        return <Square className={cls} />;
      case 'length':
        return <Ruler className={cls} />;
      case 'weight':
        return <Scale className={cls} />;
      case 'volume':
        return <Box className={cls} />;
      case 'temperature':
        return <Thermometer className={cls} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-[#1e293b] rounded-xl border border-[#e5e7eb] dark:border-slate-800 min-w-max transition-colors">
        {UNIT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#15171a] dark:bg-slate-900 text-white shadow-xs border dark:border-slate-700'
                  : 'text-[#475569] dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800 hover:text-[#112220] dark:hover:text-white'
              }`}
            >
              {getIcon(cat.id, isActive)}
              <span className="pt-[1px] leading-normal">{cat.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19] ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
