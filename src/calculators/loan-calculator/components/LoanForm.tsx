import React from 'react';
import { LoanInput, RepaymentMethod } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { Input } from '../../../components/ui/input';
import { Slider } from '../../../components/ui/slider';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { RotateCcw } from 'lucide-react';

interface LoanFormProps {
  input: LoanInput;
  onChange: (updated: LoanInput) => void;
  onReset: () => void;
}

const AMOUNT_PRESETS = [
  { label: '+1,000만', value: 10_000_000 },
  { label: '+5,000만', value: 50_000_000 },
  { label: '+1억', value: 100_000_000 },
];

const RATE_PRESETS = [
  { label: '3.2% 특판', value: 3.2 },
  { label: '3.8% 주담대', value: 3.8 },
  { label: '4.5% 전세대출', value: 4.5 },
  { label: '5.5% 신용대출', value: 5.5 },
];

const TERM_PRESETS = [1, 3, 5, 10, 20, 30, 40];

const GRACE_PRESETS = [
  { label: '거치 없음', months: 0 },
  { label: '1년', months: 12 },
  { label: '2년', months: 24 },
  { label: '3년', months: 36 },
];

const EARLY_MONTH_PRESETS = [
  { label: '1년 뒤', months: 12 },
  { label: '2년 뒤', months: 24 },
  { label: '3년 뒤', months: 36 },
  { label: '5년 뒤', months: 60 },
];

export const LoanForm: React.FC<LoanFormProps> = ({ input, onChange, onReset }) => {
  const updateField = <K extends keyof LoanInput>(field: K, val: LoanInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const updateEarlyRepayment = (
    updater: (
      prev: NonNullable<LoanInput['earlyRepayment']>
    ) => NonNullable<LoanInput['earlyRepayment']>
  ) => {
    const current = input.earlyRepayment ?? {
      enabled: false,
      afterMonths: 24,
      amount: 30_000_000,
      feeRate: 1.2,
    };
    onChange({
      ...input,
      earlyRepayment: updater(current),
    });
  };

  const isEarlyEnabled = Boolean(input.earlyRepayment?.enabled);

  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-6">
      {/* 1. 상단 타이틀 및 초기화 버튼 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#112220] dark:text-slate-100 flex items-center gap-2">
            <span>대출 조건 설정</span>
            <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-300 dark:border-slate-700">
              실시간 시뮬레이션
            </Badge>
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            원금, 금리, 기간을 조절하여 3대 상환방식을 비교하세요
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-xs text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          초기화
        </Button>
      </div>

      {/* 2. 상환 방식 선택 탭 (원리금균등 / 원금균등 / 만기일시) */}
      <div>
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200 mb-2">
          상환 방식
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800">
          {(
            [
              { id: 'equal_payment', label: '원리금균등' },
              { id: 'equal_principal', label: '원금균등' },
              { id: 'bullet', label: '만기일시' },
            ] as { id: RepaymentMethod; label: string }[]
          ).map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateField('repaymentMethod', tab.id)}
              className={`h-auto py-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center ${
                input.repaymentMethod === tab.id
                  ? 'bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 3. 대출 원금 */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label htmlFor="loan-amount" className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200 cursor-pointer">
            대출 원금
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19]">
            {formatKoreanLoanAmount(input.loanAmount)}
          </span>
        </div>
        <div className="relative">
          <Input
            id="loan-amount"
            aria-label="대출 원금 입력"
            type="text"
            inputMode="numeric"
            value={input.loanAmount ? input.loanAmount.toLocaleString('ko-KR') : ''}
            placeholder="0"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              updateField('loanAmount', raw ? parseInt(raw, 10) : 0);
            }}
            className="w-full text-right font-bold text-[#112220] dark:text-slate-100 pl-3 pr-10 py-2 border border-[#e5e7eb] dark:border-slate-700 rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-slate-900/60 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] h-11"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            원
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {AMOUNT_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateField('loanAmount', (input.loanAmount || 0) + preset.value)}
              className="h-7 px-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {preset.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateField('loanAmount', 0)}
            className="h-7 px-2 text-xs font-semibold text-rose-500 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            정정
          </Button>
        </div>
      </div>

      {/* 4. 대출 금리 (% 연이율) */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label htmlFor="loan-rate" className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200 cursor-pointer">
            연 대출 금리
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-slate-200">
            연 {input.annualRate.toFixed(2)}%
          </span>
        </div>
        <div className="relative">
          <Input
            id="loan-rate"
            aria-label="연 대출 금리 입력"
            type="number"
            step="0.1"
            min="0.1"
            max="30"
            value={input.annualRate}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateField('annualRate', isNaN(val) ? 0 : val);
            }}
            className="w-full text-right font-bold text-[#112220] dark:text-slate-100 pl-3 pr-10 py-2 border border-[#e5e7eb] dark:border-slate-700 rounded-xl text-base sm:text-lg tracking-tight bg-slate-50/50 dark:bg-slate-900/60 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] h-11"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            %
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {RATE_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateField('annualRate', preset.value)}
              className={`h-7 px-2.5 text-xs font-semibold ${
                input.annualRate === preset.value
                  ? 'border-[#15171a] hover:border-[#2e3238] dark:border-white bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220]'
                  : 'bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 5. 대출 기간 */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label htmlFor="loan-term" className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200 cursor-pointer">
            대출 기간
          </label>
          <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19]">
            {input.loanTermYears}년 ({input.loanTermYears * 12}개월)
          </span>
        </div>
        <Slider
          id="loan-term"
          value={[input.loanTermYears]}
          min={1}
          max={40}
          step={1}
          onValueChange={([val]) => updateField('loanTermYears', val)}
          className="my-3"
        />
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {TERM_PRESETS.map((term) => (
            <Button
              key={term}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateField('loanTermYears', term)}
              className={`h-7 px-2.5 text-xs font-semibold ${
                input.loanTermYears === term
                  ? 'border-[#15171a] hover:border-[#2e3238] dark:border-white bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220]'
                  : 'bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {term}년
            </Button>
          ))}
        </div>
      </div>

      {/* 6. 거치 기간 (이자만 납입) */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200">
            거치 기간 (원금 상환 유예)
          </label>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {input.gracePeriodMonths === 0
              ? '거치 없음 (즉시 원금 상환)'
              : `${Math.floor(input.gracePeriodMonths / 12)}년 (${input.gracePeriodMonths}개월)`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {GRACE_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateField('gracePeriodMonths', preset.months)}
              className={`h-auto py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                input.gracePeriodMonths === preset.months
                  ? 'border-[#15171a] hover:border-[#2e3238] dark:border-white bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220]'
                  : 'border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 7. 중도상환 시뮬레이터 (선택 옵션) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-bold text-[#112220] dark:text-slate-200">
              중도상환 시뮬레이션
            </span>
            <p className="text-[11px] text-[#64748b] dark:text-slate-400">
              조기 상환 시 아낄 수 있는 이자와 수수료를 계산합니다
            </p>
          </div>
          <Button
            type="button"
            role="switch"
            variant="ghost"
            aria-checked={isEarlyEnabled}
            aria-label="중도상환 시뮬레이션 토글"
            onClick={() =>
              updateEarlyRepayment((prev) => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
            className={`w-11 h-6 p-1 rounded-full hover:bg-transparent dark:hover:bg-transparent ${
              isEarlyEnabled ? 'bg-[#15171a] dark:bg-[#d1ff19]' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`bg-white dark:bg-[#112220] w-4 h-4 rounded-full shadow-md transform transition-transform block ${
                isEarlyEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </Button>
        </div>

        {isEarlyEnabled && (
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-[#e5e7eb] dark:border-slate-800 space-y-3">
            {/* 상환 시점 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-[#112220] dark:text-slate-200">중도상환 시점</span>
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  대출 실행 후 {input.earlyRepayment?.afterMonths}개월 뒤
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {EARLY_MONTH_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateEarlyRepayment((prev) => ({
                        ...prev,
                        afterMonths: preset.months,
                      }))
                    }
                    className={`h-7 text-xs font-semibold ${
                      input.earlyRepayment?.afterMonths === preset.months
                        ? 'border-[#15171a] hover:border-[#2e3238] dark:border-white bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220]'
                        : 'bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 상환 금액 */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-[#112220] dark:text-slate-200">중도상환 금액</span>
                <span className="font-bold text-[#112220] dark:text-[#d1ff19]">
                  {formatKoreanLoanAmount(input.earlyRepayment?.amount || 0)}
                </span>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={
                    input.earlyRepayment?.amount
                      ? input.earlyRepayment.amount.toLocaleString('ko-KR')
                      : ''
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    updateEarlyRepayment((prev) => ({
                      ...prev,
                      amount: raw ? parseInt(raw, 10) : 0,
                    }));
                  }}
                  className="w-full text-right font-bold pl-3 pr-10 py-1.5 h-9 text-sm border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                  원
                </span>
              </div>
            </div>

            {/* 수수료율 */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">
                수수료율 (3년 경과 시 0원 면제)
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={input.earlyRepayment?.feeRate ?? 1.2}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateEarlyRepayment((prev) => ({
                      ...prev,
                      feeRate: isNaN(val) ? 0 : val,
                    }));
                  }}
                  className="w-16 h-7 text-right text-xs font-bold border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
