import React from 'react';
import { QuickPreset, UnitCategory } from '../../../types/unit';
import { QUICK_PRESETS } from '../../../utils/unitConverter';
import { Badge } from '../../../components/ui/badge';

interface QuickPresetChipsProps {
  category: UnitCategory;
  onSelectPreset: (preset: QuickPreset) => void;
}

export const QuickPresetChips: React.FC<QuickPresetChipsProps> = ({
  category,
  onSelectPreset,
}) => {
  const presets = QUICK_PRESETS.filter((p) => p.category === category);

  if (presets.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-4 sm:p-5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
          자주 찾는 생활 프리셋
        </span>
        <span className="text-[11px] text-[#94a3b8]">원클릭 자동 입력</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-[#e5e7eb] hover:border-[#15171a] hover:bg-white text-[#112220] transition-all cursor-pointer shadow-2xs"
          >
            <span>{preset.label}</span>
            {preset.badge && (
              <Badge
                variant={preset.badge === '인기' ? 'eyebrow' : 'outline'}
                className="text-[9px] px-1 py-0 h-4"
              >
                {preset.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
