import React from 'react';
import { BmiInput, Gender } from '../../../types/bmi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Slider } from '../../../components/ui/slider';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import { RotateCcw } from 'lucide-react';
import { useClampedNumberInput } from '../../../hooks/useClampedNumberInput';

interface BmiFormProps {
  input: BmiInput;
  onChange: (updated: BmiInput) => void;
  onReset: () => void;
}

const GENDER_OPTIONS: SegmentedOption<Gender>[] = [
  { id: 'male', label: '남성' },
  { id: 'female', label: '여성' },
];

const HEIGHT_PRESETS = [160, 165, 170, 175, 180];
const WEIGHT_PRESETS = [50, 60, 70, 80, 90];

export const BmiForm: React.FC<BmiFormProps> = ({ input, onChange, onReset }) => {
  const updateField = <K extends keyof BmiInput>(field: K, val: BmiInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const heightInput = useClampedNumberInput({
    value: input.height,
    onChange: (val) => updateField('height', val),
    min: 100,
    max: 250,
    fallback: 170,
    precision: 0,
  });

  const weightInput = useClampedNumberInput({
    value: input.weight,
    onChange: (val) => updateField('weight', val),
    min: 30,
    max: 200,
    fallback: 65,
    precision: 1,
  });

  const ageInput = useClampedNumberInput({
    value: input.age ?? 30,
    onChange: (val) => updateField('age', val),
    min: 10,
    max: 100,
    fallback: 30,
    precision: 0,
  });

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-5 shadow-2xs transition-colors">
      {/* 1. 상단 타이틀 & 표준 초기화 버튼 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-slate-800 gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="meta" size="sm" className="shrink-0">
              건강 측정
            </Badge>
            <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 whitespace-nowrap">
              신체 정보 입력
            </h2>
          </div>
          <p className="text-xs text-[#64748b] dark:text-slate-400 break-keep">
            대한비만학회(KSSO) 한국인 표준 체질량지수 기준 적용
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2.5 gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#112220] dark:hover:text-white rounded-lg shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </Button>
      </div>

      {/* 2. 성별 선택 */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[#112220] dark:text-slate-200">
          성별
        </label>
        <SegmentedControl
          options={GENDER_OPTIONS}
          value={input.gender}
          onChange={(val) => updateField('gender', val)}
          variant="slate-solid"
          itemClassName="py-2 text-xs sm:text-sm font-bold"
        />
      </div>

      {/* 3. 신장 (키) 입력 */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="bmi-height" className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-slate-200 cursor-pointer">
            신장 (키)
          </label>
          <span className="text-xs font-semibold text-[#112220] dark:text-slate-200">
            {input.height} cm
          </span>
        </div>

        <div className="relative">
          <Input
            id="bmi-height"
            type="number"
            value={heightInput.value}
            onChange={heightInput.onChange}
            onBlur={heightInput.onBlur}
            placeholder="170"
            className="pr-12 text-sm sm:text-base font-bold tabular-nums"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748b] dark:text-slate-400 pointer-events-none">
            cm
          </span>
        </div>

        {/* 신장 정밀 슬라이더 */}
        <div className="pt-1 px-1">
          <Slider
            min={100}
            max={220}
            step={1}
            value={[input.height]}
            onValueChange={(val) => updateField('height', val[0])}
            aria-label="신장 슬라이더"
          />
        </div>

        {/* 신장 퀵 프리셋 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {HEIGHT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateField('height', preset)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                input.height === preset
                  ? 'bg-[#15171a] dark:bg-white text-white dark:text-[#112220] border-[#15171a] dark:border-white font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {preset}cm
            </button>
          ))}
        </div>
      </div>

      {/* 4. 체중 (몸무게) 입력 */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="bmi-weight" className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-slate-200 cursor-pointer">
            체중 (몸무게)
          </label>
          <span className="text-xs font-semibold text-[#112220] dark:text-slate-200">
            {input.weight} kg
          </span>
        </div>

        <div className="relative">
          <Input
            id="bmi-weight"
            type="number"
            step="0.1"
            value={weightInput.value}
            onChange={weightInput.onChange}
            onBlur={weightInput.onBlur}
            placeholder="65"
            className="pr-12 text-sm sm:text-base font-bold tabular-nums"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748b] dark:text-slate-400 pointer-events-none">
            kg
          </span>
        </div>

        {/* 체중 정밀 슬라이더 */}
        <div className="pt-1 px-1">
          <Slider
            min={30}
            max={150}
            step={0.5}
            value={[input.weight]}
            onValueChange={(val) => updateField('weight', Number(val[0].toFixed(1)))}
            aria-label="체중 슬라이더"
          />
        </div>

        {/* 체중 퀵 프리셋 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {WEIGHT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateField('weight', preset)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                input.weight === preset
                  ? 'bg-[#15171a] dark:bg-white text-white dark:text-[#112220] border-[#15171a] dark:border-white font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {preset}kg
            </button>
          ))}
        </div>
      </div>

      {/* 5. 나이 (선택) */}
      <div className="space-y-1.5">
        <label htmlFor="bmi-age" className="block text-xs font-bold text-[#112220] dark:text-slate-200 cursor-pointer">
          나이 (만 나이)
        </label>
        <div className="relative">
          <Input
            id="bmi-age"
            type="number"
            value={ageInput.value}
            onChange={ageInput.onChange}
            onBlur={ageInput.onBlur}
            placeholder="30"
            className="pr-12 text-sm sm:text-base font-medium tabular-nums"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748b] dark:text-slate-400 pointer-events-none">
            세
          </span>
        </div>
      </div>
    </div>
  );
};
