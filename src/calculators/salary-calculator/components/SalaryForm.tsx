import React from 'react';
import { SalaryInput, SalaryPaymentType, SeveranceType } from '../../../types/salary';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import { RotateCcw, Users, Baby, HelpCircle } from 'lucide-react';
import { formatKoreanUnit, formatNumberWithWon } from '../../../utils/formatters';

interface SalaryFormProps {
  input: SalaryInput;
  onChange: (updated: SalaryInput) => void;
  onReset: () => void;
}

const PAYMENT_TYPE_OPTIONS: SegmentedOption<SalaryPaymentType>[] = [
  { id: 'annual', label: '연봉 기준' },
  { id: 'monthly', label: '월급 기준' },
];

const SEVERANCE_OPTIONS: SegmentedOption<SeveranceType>[] = [
  { id: 'separate', label: '퇴직금 별도 지급' },
  { id: 'included', label: '퇴직금 연봉 포함 (1/13)' },
];

const ANNUAL_AMOUNT_PRESETS = [
  { label: '3,000만', value: 30_000_000 },
  { label: '4,000만', value: 40_000_000 },
  { label: '5,000만', value: 50_000_000 },
  { label: '6,000만', value: 60_000_000 },
  { label: '7,000만', value: 70_000_000 },
  { label: '1억', value: 100_000_000 },
];

const MONTHLY_AMOUNT_PRESETS = [
  { label: '250만', value: 2_500_000 },
  { label: '300만', value: 3_000_000 },
  { label: '350만', value: 3_500_000 },
  { label: '400만', value: 4_000_000 },
  { label: '500만', value: 5_000_000 },
  { label: '700만', value: 7_000_000 },
];

const ANNUAL_INCREMENT_PRESETS = [
  { label: '+100만', value: 1_000_000 },
  { label: '+500만', value: 5_000_000 },
  { label: '+1,000만', value: 10_000_000 },
];

const MONTHLY_INCREMENT_PRESETS = [
  { label: '+10만', value: 100_000 },
  { label: '+50만', value: 500_000 },
  { label: '+100만', value: 1_000_000 },
];

const NON_TAXABLE_PRESETS = [
  { label: '비과세 없음', value: 0 },
  { label: '식대 10만 (종전)', value: 100_000 },
  { label: '식대 20만 (기본)', value: 200_000 },
];

export const SalaryForm: React.FC<SalaryFormProps> = ({
  input,
  onChange,
  onReset,
}) => {
  const updateField = <K extends keyof SalaryInput>(
    field: K,
    val: SalaryInput[K]
  ) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const isAnnual = input.paymentType === 'annual';

  const handleAmountIncrement = (inc: number) => {
    updateField('grossAmount', input.grossAmount + inc);
  };

  const amountPresets = isAnnual
    ? ANNUAL_AMOUNT_PRESETS
    : MONTHLY_AMOUNT_PRESETS;
  const incrementPresets = isAnnual
    ? ANNUAL_INCREMENT_PRESETS
    : MONTHLY_INCREMENT_PRESETS;

  return (
    <div className="bg-white dark:bg-[#1e293b] p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-5 sm:space-y-6">
      {/* 1. 폼 상단 헤더 및 초기화 버튼 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge variant="meta" size="sm">
              급여 설계
            </Badge>
            <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100">
              급여 조건 입력
            </h2>
          </div>
          <p className="text-xs text-[#64748b] dark:text-slate-400">
            2026년 최신 4대 보험 및 간이세액표가 자동 적용됩니다
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-[#112220] dark:hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </Button>
      </div>

      {/* 2. 급여 지급 기준 토글 */}
      <div>
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200 mb-2">
          급여 지급 형태
        </label>
        <SegmentedControl
          value={input.paymentType}
          options={PAYMENT_TYPE_OPTIONS}
          onChange={(val) => {
            // 연봉 <-> 월급 전환 시 수치 자연스러운 환산
            if (val === 'monthly' && input.paymentType === 'annual') {
              const converted = Math.round(input.grossAmount / 12);
              onChange({
                ...input,
                paymentType: val,
                grossAmount: converted > 0 ? converted : 3_500_000,
              });
            } else if (val === 'annual' && input.paymentType === 'monthly') {
              const converted = input.grossAmount * 12;
              onChange({
                ...input,
                paymentType: val,
                grossAmount: converted > 0 ? converted : 50_000_000,
              });
            } else {
              updateField('paymentType', val);
            }
          }}
          variant="dark-solid"
          itemClassName="py-2 text-xs sm:text-sm"
        />
      </div>

      {/* 3. 세전 급여 금액 입력 */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
          <label
            htmlFor="gross-amount-input"
            className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200 cursor-pointer"
          >
            {isAnnual ? '세전 연봉' : '세전 월급'}
          </label>
          {input.grossAmount > 0 && (
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19]">
              {formatKoreanUnit(input.grossAmount)}
            </span>
          )}
        </div>

        <div className="relative">
          <Input
            id="gross-amount-input"
            aria-label={isAnnual ? '세전 연봉 입력' : '세전 월급 입력'}
            type="text"
            inputMode="numeric"
            value={input.grossAmount ? input.grossAmount.toLocaleString('ko-KR') : ''}
            placeholder="0"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              updateField('grossAmount', raw ? parseInt(raw, 10) : 0);
            }}
            onBlur={() => {
              if (!input.grossAmount) {
                updateField('grossAmount', isAnnual ? 50_000_000 : 4_000_000);
              }
            }}
            className="w-full text-right font-bold text-[#112220] dark:text-slate-100 pl-3 pr-10 py-2 border border-[#e5e7eb] dark:border-slate-700 rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-slate-900/60 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] h-11"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            원
          </span>
        </div>

        {/* 대표 금액 프리셋 칩 */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {amountPresets.map((preset) => (
            <SelectableChip
              key={preset.value}
              isSelected={input.grossAmount === preset.value}
              onClick={() => updateField('grossAmount', preset.value)}
              className="text-xs px-2.5 py-1"
            >
              {preset.label}
            </SelectableChip>
          ))}
        </div>

        {/* 빠른 증감 칩 */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {incrementPresets.map((inc) => (
            <Button
              key={inc.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAmountIncrement(inc.value)}
              className="h-7 px-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {inc.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateField('grossAmount', 0)}
            className="h-7 px-2 text-xs font-semibold text-rose-500 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            정정
          </Button>
        </div>
      </div>

      {/* 4. 퇴직금 지급 방식 토글 */}
      <div className="pt-2 border-t border-[#e5e7eb] dark:border-slate-800">
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200 mb-2">
          퇴직금 지급 방식
        </label>
        <SegmentedControl
          value={input.severanceType}
          options={SEVERANCE_OPTIONS}
          onChange={(val) => updateField('severanceType', val)}
          variant="dark-solid"
          itemClassName="py-1.5 text-xs"
        />
        <p className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1.5">
          {input.severanceType === 'included'
            ? '연봉을 13분할하여 1개월분을 퇴직충당금으로 공제합니다.'
            : '퇴직금은 별도 지급되며 연봉을 12개월로 균등 분할합니다.'}
        </p>
      </div>

      {/* 5. 비과세 급여액 설정 */}
      <div className="pt-2 border-t border-[#e5e7eb] dark:border-slate-800">
        <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
          <label
            htmlFor="non-taxable-input"
            className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200 cursor-pointer flex items-center gap-1"
          >
            월 비과세 수당/식대
            <span
              className="text-slate-400 dark:text-slate-500 cursor-help"
              title="식대(월 20만 원 한도), 자가운전보조금 등 4대 보험 및 소득세가 과세되지 않는 급여 항목입니다."
            >
              <HelpCircle className="w-3.5 h-3.5 inline" />
            </span>
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19]">
            {formatNumberWithWon(input.nonTaxableAmount)}
          </span>
        </div>

        <div className="relative">
          <Input
            id="non-taxable-input"
            aria-label="월 비과세 수당 및 식대 입력"
            type="text"
            inputMode="numeric"
            value={
              input.nonTaxableAmount !== undefined
                ? input.nonTaxableAmount.toLocaleString('ko-KR')
                : ''
            }
            placeholder="200,000"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              updateField('nonTaxableAmount', raw ? parseInt(raw, 10) : 0);
            }}
            className="w-full text-right font-bold text-[#112220] dark:text-slate-100 pl-3 pr-10 py-2 border border-[#e5e7eb] dark:border-slate-700 rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-slate-900/60 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] h-11"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            원
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {NON_TAXABLE_PRESETS.map((preset) => (
            <SelectableChip
              key={preset.value}
              isSelected={input.nonTaxableAmount === preset.value}
              onClick={() => updateField('nonTaxableAmount', preset.value)}
              className="text-xs px-2.5 py-1"
            >
              {preset.label}
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 6. 부양가족 수 및 20세 이하 자녀 수 (인적공제) */}
      <div className="pt-2 border-t border-[#e5e7eb] dark:border-slate-800 space-y-2.5">
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200">
          인적공제 (부양가족 및 자녀)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 부양가족 수 */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-[#e5e7eb] dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                부양가족 수
              </span>
              <span className="font-mono font-bold text-xs text-[#112220] dark:text-slate-100">
                {input.familyCount}명
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] dark:text-slate-400 leading-tight">
              본인 포함 (1인당 연 150만 원 공제)
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700"
                disabled={input.familyCount <= 1}
                onClick={() =>
                  updateField('familyCount', Math.max(1, input.familyCount - 1))
                }
              >
                -
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700"
                disabled={input.familyCount >= 11}
                onClick={() =>
                  updateField('familyCount', Math.min(11, input.familyCount + 1))
                }
              >
                +
              </Button>
            </div>
          </div>

          {/* 20세 이하 자녀 수 */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-[#e5e7eb] dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#112220] dark:text-slate-200 flex items-center gap-1">
                <Baby className="w-3.5 h-3.5 text-slate-500" />
                20세 이하 자녀
              </span>
              <span className="font-mono font-bold text-xs text-[#112220] dark:text-slate-100">
                {input.childrenCount}명
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] dark:text-slate-400 leading-tight">
              자녀 세액공제 추가 적용
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700"
                disabled={input.childrenCount <= 0}
                onClick={() =>
                  updateField('childrenCount', Math.max(0, input.childrenCount - 1))
                }
              >
                -
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700"
                disabled={input.childrenCount >= 10}
                onClick={() =>
                  updateField('childrenCount', Math.min(10, input.childrenCount + 1))
                }
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
