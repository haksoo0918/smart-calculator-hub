import React from 'react';
import { UnitCategory } from '../../../types/unit';
import { UNIT_CATEGORIES } from '../../../utils/unitConverter';
import { Square, Ruler, Scale, Box, Thermometer } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

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
      isActive
        ? 'text-[#d1ff19]'
        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
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
      <Tabs
        value={activeCategory}
        onValueChange={(val) => onSelectCategory(val as UnitCategory)}
        className="w-full min-w-max"
      >
        <TabsList
          variant="slate-solid"
          size="default"
          className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-[#1e293b] rounded-xl border border-[#e5e7eb] dark:border-slate-800 min-w-max h-auto"
        >
          {UNIT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                variant="slate-solid"
                className="group h-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                {getIcon(cat.id, isActive)}
                <span className="pt-[0.5px] leading-normal">{cat.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19] ml-0.5 animate-pulse" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
