import React, { useEffect, useMemo } from 'react';
import { SalaryInput } from '../../types/salary';
import { calculateSalary } from '../../utils/salaryCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SalaryForm } from './components/SalaryForm';
import { SalarySummaryCards } from './components/SalarySummaryCards';
import { SalaryChartDashboard } from './components/SalaryChartDashboard';
import { DeductionBreakdownTable } from './components/DeductionBreakdownTable';
import { SalaryInfoCard } from './components/SalaryInfoCard';
import { siteConfig } from '../../config/site';

const DEFAULT_SALARY_INPUT: SalaryInput = {
  paymentType: 'annual',
  grossAmount: 50_000_000, // 기본 5,000만 원
  severanceType: 'separate', // 퇴직금 별도 지급
  nonTaxableAmount: 200_000, // 식대 비과세 20만 원
  familyCount: 1, // 본인 1인
  childrenCount: 0,
};

const STORAGE_KEY = 'salary_calculator_input_v1';

export const SalaryApp: React.FC = () => {
  const [input, setInput] = useLocalStorage<SalaryInput>(
    STORAGE_KEY,
    DEFAULT_SALARY_INPUT
  );

  useEffect(() => {
    document.title = siteConfig.getTitle('연봉 실수령액 계산기');
  }, []);

  const handleReset = () => {
    setInput(DEFAULT_SALARY_INPUT);
  };

  const result = useMemo(() => {
    return calculateSalary(input);
  }, [input]);

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 */}
        <div className="lg:col-span-5 w-full min-w-0">
          <SalaryForm
            input={input}
            onChange={setInput}
            onReset={handleReset}
          />
        </div>

        {/* 우측 결과 대시보드 */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
          {/* 1. 월 실수령액 메인 카드 및 3단 서브 요약 지표 */}
          <SalarySummaryCards result={result} />

          {/* 2. 시각화 대시보드 (공제 비중 도넛 차트) */}
          <SalaryChartDashboard result={result} />

          {/* 3. 6대 공제 세부 명세표 (근로자/회사 탭) */}
          <DeductionBreakdownTable result={result} />

          {/* 4. 급여 및 4대 보험 상식 안내 카드 */}
          <SalaryInfoCard />
        </div>
      </div>
    </div>
  );
};
