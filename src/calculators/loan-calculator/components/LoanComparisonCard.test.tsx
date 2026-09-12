import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoanComparisonCard } from './LoanComparisonCard';
import { LoanComparisonSummary } from '../../../types/loan';

const MOCK_COMPARISON: LoanComparisonSummary = {
  equalPayment: {
    method: 'equal_payment',
    totalRepayment: 547220123,
    totalInterest: 247220123,
    firstMonthPayment: 1520056,
    lastMonthPayment: 1520019,
    monthlyAveragePayment: 1520056,
    maxMonthlyPayment: 1520056,
    minMonthlyPayment: 1520019,
    schedule: [],
  },
  equalPrincipal: {
    method: 'equal_principal',
    totalRepayment: 503062500,
    totalInterest: 203062500,
    firstMonthPayment: 1958333,
    lastMonthPayment: 836250,
    monthlyAveragePayment: 1397292,
    maxMonthlyPayment: 1958333,
    minMonthlyPayment: 836250,
    schedule: [],
  },
  bullet: {
    method: 'bullet',
    totalRepayment: 705000000,
    totalInterest: 405000000,
    firstMonthPayment: 1125000,
    lastMonthPayment: 301125000,
    monthlyAveragePayment: 1125000,
    maxMonthlyPayment: 301125000,
    minMonthlyPayment: 1125000,
    schedule: [],
  },
  lowestInterestMethod: 'equal_principal',
  interestSavingsVsEqualPayment: 44157623,
};

describe('Seam: LoanComparisonCard Presentation and Interaction', () => {
  it('3대 상환방식의 뱃지와 계산된 총이자 수치가 정확히 노출되어야 한다', () => {
    const handleSelect = vi.fn();
    render(
      <LoanComparisonCard
        comparison={MOCK_COMPARISON}
        activeMethod="equal_payment"
        onSelectMethod={handleSelect}
      />
    );

    // 1. 3대 방식 대표 뱃지 렌더링 검증
    expect(screen.getByText('가장 대중적')).toBeInTheDocument();
    expect(screen.getByText('최저 총이자')).toBeInTheDocument();
    expect(screen.getByText('초기부담 최소')).toBeInTheDocument();

    // 2. 방식별 설명 문구 노출 검증
    expect(screen.getByText(/상환액이 일정하여 자금 계획 수립/)).toBeInTheDocument();
    expect(screen.getByText(/이자가 줄어들어.*총이자 부담이 가장 적음/)).toBeInTheDocument();
    expect(screen.getByText(/이자만 납입하므로 초기 현금흐름/)).toBeInTheDocument();

    // 3. 계산된 금융 수치 노출 검증
    expect(screen.getByText(/247,220,123/)).toBeInTheDocument();
    expect(screen.getByText(/203,062,500/)).toBeInTheDocument();
    expect(screen.getByText(/405,000,000/)).toBeInTheDocument();

    // 4. 최저 이자 추천 배너 안내 노출 검증
    expect(screen.getByText(/원금균등 선택 시 약.*절약/)).toBeInTheDocument();
  });

  it('다른 상환방식 카드를 클릭하면 해당 방식 ID와 함께 onSelectMethod가 호출되어야 한다', () => {
    const handleSelect = vi.fn();
    render(
      <LoanComparisonCard
        comparison={MOCK_COMPARISON}
        activeMethod="equal_payment"
        onSelectMethod={handleSelect}
      />
    );

    // 원금균등 카드의 버튼 선택 및 클릭
    const principalBtn = screen.getByText('원금균등').closest('button');
    expect(principalBtn).not.toBeNull();
    principalBtn?.click();
    expect(handleSelect).toHaveBeenCalledWith('equal_principal');
  });
});
