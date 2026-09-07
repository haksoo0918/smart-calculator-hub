import React from 'react';
import {
  CompoundingFrequency,
  ContributionFrequency,
  ScenarioInput,
  TaxType,
} from '../types/calculator';
import { formatKoreanUnit } from '../utils/formatters';
import { QuickAmountButtons } from './QuickAmountButtons';
import { Sparkles, Copy } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CalculatorFormProps {
  scenario: ScenarioInput;
  onChange: (updated: ScenarioInput) => void;
  accentColor?: 'teal' | 'indigo';
  badgeTitle?: string;
  onCopyFromOther?: () => void;
  copyButtonLabel?: string;
}

const RATE_PRESETS = [
  { label: '하락장 -10%', rate: -10.0 },
  { label: '약세장 -3%', rate: -3.0 },
  { label: '예적금 3.5%', rate: 3.5 },
  { label: '지수 ETF 8%', rate: 8.0 },
  { label: '공격투자 12%', rate: 12.0 },
];

const YEAR_PRESETS = [5, 10, 15, 20, 30];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  scenario,
  onChange,
  accentColor = 'teal',
  badgeTitle,
  onCopyFromOther,
  copyButtonLabel,
}) => {
  const isIndigo = accentColor === 'indigo';
  const borderFocusClass = 'focus:border-[#15171a] focus:ring-1 focus:ring-[#15171a]';
  const activeTabClass = 'bg-[#15171a] text-white';

  const updateField = <K extends keyof ScenarioInput>(field: K, value: ScenarioInput[K]) => {
    onChange({
      ...scenario,
      [field]: value,
    });
  };

  return (
    <div
      className={`bg-white rounded-[24px] p-5 sm:p-6 border border-[#e5e7eb] transition-colors ${
        isIndigo ? 'ring-1 ring-slate-900/5' : ''
      }`}
    >
      {/* 상단 뱃지 및 타이틀 */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Badge variant={isIndigo ? 'indigo' : 'teal'} className="font-bold uppercase tracking-wider">
            {badgeTitle || scenario.name}
          </Badge>
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            투자 조건 설정
          </h2>
        </div>

        {onCopyFromOther && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyFromOther}
            className="h-7 text-xs gap-1 text-slate-600"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copyButtonLabel || '복사'}</span>
          </Button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* 1. 초기 원금 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-xs sm:text-sm font-semibold text-[#112220]">
              초기 투자 원금
            </label>
            <span className="text-xs font-semibold text-[#112220]">
              {formatKoreanUnit(scenario.principal)}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={scenario.principal ? scenario.principal.toLocaleString('ko-KR') : ''}
              placeholder="0"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                updateField('principal', raw ? parseInt(raw, 10) : 0);
              }}
              className={`w-full text-right font-bold text-[#112220] pr-9 py-2 px-3 border border-[#e5e7eb] rounded-md text-base sm:text-lg tracking-tight bg-slate-50/50 focus:bg-white transition-colors ${borderFocusClass}`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              원
            </span>
          </div>
          <QuickAmountButtons
            onAdd={(amt) => updateField('principal', (scenario.principal || 0) + amt)}
            onClear={() => updateField('principal', 0)}
          />
        </div>

        {/* 2. 정기 적립액 및 주기 */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-xs sm:text-sm font-semibold text-[#112220]">
              정기 추가 적립금
            </label>
            {scenario.contributionFrequency !== 'none' && (
              <span className="text-xs font-semibold text-[#112220]">
                {formatKoreanUnit(scenario.regularContribution)}
              </span>
            )}
          </div>

          {/* 주기 탭 */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-md mb-2 text-xs font-semibold border border-[#e5e7eb]">
            {(
              [
                { id: 'monthly', label: '매월 적립' },
                { id: 'annual', label: '매년 적립' },
                { id: 'none', label: '적립 없음' },
              ] as { id: ContributionFrequency; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateField('contributionFrequency', tab.id)}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  scenario.contributionFrequency === tab.id
                    ? activeTabClass
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {scenario.contributionFrequency !== 'none' && (
            <>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={scenario.regularContribution ? scenario.regularContribution.toLocaleString('ko-KR') : ''}
                  placeholder="0"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    updateField('regularContribution', raw ? parseInt(raw, 10) : 0);
                  }}
                  className={`w-full text-right font-bold text-slate-900 pr-9 py-2 px-3 border border-slate-300 rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 focus:bg-white transition-all ${borderFocusClass}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                  원
                </span>
              </div>
              <QuickAmountButtons
                onAdd={(amt) => updateField('regularContribution', (scenario.regularContribution || 0) + amt)}
                onClear={() => updateField('regularContribution', 0)}
              />
            </>
          )}
        </div>

        {/* 3. 투자 기간 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">
              목표 투자 기간
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {scenario.years}
              </span>
              <span className="text-xs text-slate-500 font-semibold">년</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={scenario.years}
            onChange={(e) => updateField('years', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer my-1"
          />
          {/* 기간 프리셋 버튼 */}
          <div className="flex items-center justify-between gap-1 mt-1">
            {YEAR_PRESETS.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => updateField('years', yr)}
                className={`flex-1 py-1 text-[11px] font-medium rounded-md border transition-all ${
                  scenario.years === yr
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {yr}년
              </button>
            ))}
          </div>
        </div>

        {/* 4. 예상 연수익률 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
              <span>연 예상 수익률</span>
              {scenario.annualRate < 0 && (
                <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                  원금 손실 구간
                </span>
              )}
            </label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                step="0.1"
                min="-30"
                max="50"
                value={scenario.annualRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateField('annualRate', isNaN(val) ? 0 : val);
                }}
                className={`w-16 text-right font-extrabold text-lg p-0.5 border-b border-[#e5e7eb] focus:border-[#15171a] outline-none ${
                  scenario.annualRate < 0 ? 'text-rose-600' : 'text-[#112220]'
                }`}
              />
              <span className={`text-sm font-extrabold ${scenario.annualRate < 0 ? 'text-rose-500' : 'text-slate-600'}`}>%</span>
            </div>
          </div>
          <input
            type="range"
            min="-20"
            max="30"
            step="0.1"
            value={scenario.annualRate}
            onChange={(e) => updateField('annualRate', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-100 border border-[#e5e7eb] rounded-lg appearance-none cursor-pointer my-1"
          />
          {/* 수익률 프리셋 칩 */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mt-1.5">
            {RATE_PRESETS.map((preset) => {
              const isSelected = Math.abs(scenario.annualRate - preset.rate) < 0.05;
              const isNegative = preset.rate < 0;
              return (
                <button
                  key={preset.rate}
                  type="button"
                  onClick={() => updateField('annualRate', preset.rate)}
                  className={`px-1 py-1.5 text-[11px] font-medium rounded-md border transition-colors text-center flex items-center justify-center gap-0.5 ${
                    isSelected
                      ? isNegative
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                        : 'bg-[#15171a] text-white border-[#15171a] font-bold'
                      : 'bg-white text-[#334155] border-[#e5e7eb] hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className={`w-2.5 h-2.5 shrink-0 ${isSelected && !isNegative ? 'text-[#d1ff19]' : isNegative ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span className="truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 복리 주기 및 과세 체계 (간결한 2분할 레이아웃) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e5e7eb]">
          {/* 복리 주기 */}
          <div>
            <label className="block text-xs font-semibold text-[#112220] mb-1">
              복리 주기
            </label>
            <select
              value={scenario.compoundingFrequency}
              onChange={(e) =>
                updateField('compoundingFrequency', e.target.value as CompoundingFrequency)
              }
              className={`w-full py-2 px-2.5 text-xs font-semibold text-[#112220] bg-slate-50 border border-[#e5e7eb] rounded-md ${borderFocusClass}`}
            >
              <option value="monthly">월복리 (일반적/추천)</option>
              <option value="annual">연복리</option>
              <option value="quarterly">분기복리</option>
              <option value="daily">일복리</option>
            </select>
          </div>

          {/* 과세 체계 */}
          <div>
            <label className="block text-xs font-semibold text-[#112220] mb-1">
              이자소득 과세
            </label>
            <select
              value={scenario.taxType}
              onChange={(e) => updateField('taxType', e.target.value as TaxType)}
              className={`w-full py-2 px-2.5 text-xs font-semibold text-[#112220] bg-slate-50 border border-[#e5e7eb] rounded-md ${borderFocusClass}`}
            >
              <option value="normal">일반과세 (15.4%)</option>
              <option value="exempt">비과세 (0%)</option>
              <option value="isa">세금우대/ISA (9.9%)</option>
              <option value="custom">직접 입력</option>
            </select>
            {scenario.taxType === 'custom' && (
              <div className="mt-1.5 flex items-center justify-end gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={scenario.customTaxRate ?? 15.4}
                  onChange={(e) =>
                    updateField('customTaxRate', parseFloat(e.target.value) || 0)
                  }
                  className="w-16 text-right text-xs font-bold py-1 px-1.5 border border-[#e5e7eb] rounded-md text-[#112220] focus:border-[#15171a] outline-none"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
