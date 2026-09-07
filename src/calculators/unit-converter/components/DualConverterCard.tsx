import React from 'react';
import { DecimalPrecision, UnitDefinition } from '../../../types/unit';
import { ArrowLeftRight, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface DualConverterCardProps {
  units: UnitDefinition[];
  fromUnitId: string;
  toUnitId: string;
  inputValue: number | '';
  formattedConvertedValue: string;
  precision: DecimalPrecision;
  onInputChange: (val: number | '') => void;
  onFromUnitChange: (id: string) => void;
  onToUnitChange: (id: string) => void;
  onSwapUnits: () => void;
  onPrecisionChange: (p: DecimalPrecision) => void;
  ratioInfoText?: string;
}

export const DualConverterCard: React.FC<DualConverterCardProps> = ({
  units,
  fromUnitId,
  toUnitId,
  inputValue,
  formattedConvertedValue,
  precision,
  onInputChange,
  onFromUnitChange,
  onToUnitChange,
  onSwapUnits,
  onPrecisionChange,
  ratioInfoText,
}) => {
  const fromUnit = units.find((u) => u.id === fromUnitId) || units[0];
  const toUnit = units.find((u) => u.id === toUnitId) || units[1] || units[0];

  const precisionOptions: DecimalPrecision[] = [0, 2, 4, 6];

  return (
    <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-4 sm:p-6 space-y-4">
      {/* 상단: 정밀도(소수점 자릿수) 선택 바 */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-medium">
          <span>실시간 양방향 변환</span>
          {ratioInfoText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{ratioInfoText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#64748b] font-medium mr-1">소수점</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-[#e5e7eb]">
            {precisionOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPrecisionChange(p)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                  precision === p
                    ? 'bg-[#15171a] text-white'
                    : 'text-[#64748b] hover:text-[#112220]'
                }`}
              >
                {p}자리
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 듀얼 인터랙티브 변환 영역 (모바일: 1열 세로, 데스크톱: 3열 좌/중/우) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* 1. 출발(From) 단위 입력 박스 */}
        <div className="bg-slate-50/70 border border-[#e5e7eb] rounded-2xl p-4 focus-within:border-[#15171a] focus-within:bg-white transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              변환할 값 (From)
            </span>
            <select
              value={fromUnitId}
              onChange={(e) => onFromUnitChange(e.target.value)}
              className="bg-white text-xs font-bold text-[#112220] border border-[#e5e7eb] rounded-lg px-2 py-1 outline-none focus:border-[#15171a] cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                onInputChange(val === '' ? '' : parseFloat(val));
              }}
              placeholder="0"
              className="w-full bg-transparent font-extrabold text-2xl sm:text-3xl text-[#112220] outline-none tracking-tight placeholder-slate-300"
            />
            <span className="text-sm sm:text-base font-bold text-slate-500 shrink-0">
              {fromUnit?.symbol}
            </span>
          </div>

          {fromUnit?.description && (
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {fromUnit.description}
            </p>
          )}
        </div>

        {/* 2. 중앙 스왑(Swap) 버튼 */}
        <div className="flex justify-center my-1 md:my-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSwapUnits}
                className="w-10 h-10 rounded-full border-[#e5e7eb] bg-white hover:bg-slate-100 shadow-xs hover:border-[#15171a] transition-all"
                aria-label="단위 맞바꾸기"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#112220]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">단위 맞바꾸기 (Swap)</TooltipContent>
          </Tooltip>
        </div>

        {/* 3. 도착(To) 단위 결과 박스 */}
        <div className="bg-[#15171a] text-white rounded-2xl p-4 border border-[#15171a] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#d1ff19] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19]" />
              결과 (To)
            </span>
            <select
              value={toUnitId}
              onChange={(e) => onToUnitChange(e.target.value)}
              className="bg-[#24272c] text-xs font-bold text-white border border-slate-700 rounded-lg px-2 py-1 outline-none focus:border-[#d1ff19] cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-baseline justify-between gap-2 overflow-x-auto">
            <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight break-all">
              {formattedConvertedValue}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#d1ff19] shrink-0">
              {toUnit?.symbol}
            </span>
          </div>

          {toUnit?.description && (
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {toUnit.description}
            </p>
          )}
        </div>
      </div>

      {/* 환산 공식 / 배율 가이드 배너 */}
      {ratioInfoText && (
        <div className="px-3.5 py-2 bg-slate-50 border border-[#e5e7eb] rounded-xl flex items-center justify-between text-xs text-[#475569]">
          <span className="font-medium">기준 공식</span>
          <span className="font-bold text-[#112220]">{ratioInfoText}</span>
        </div>
      )}
    </div>
  );
};
