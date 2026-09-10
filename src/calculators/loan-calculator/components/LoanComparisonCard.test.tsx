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

describe('Seam: LoanComparisonCard Header and Alignment', () => {
  it('모든 비교 카드의 뱃지는 타이틀과 동일한 행에서 찌그러짐 없이 일관된 레이아웃을 가져야 한다', () => {
    const handleSelect = vi.fn();
    render(
      <LoanComparisonCard
        comparison={MOCK_COMPARISON}
        activeMethod="equal_payment"
        onSelectMethod={handleSelect}
      />
    );

    // 3개 뱃지 모두 렌더링 확인
    expect(screen.getByText('가장 대중적')).toBeInTheDocument();
    expect(screen.getByText('최저 총이자')).toBeInTheDocument();
    expect(screen.getByText('초기부담 최소')).toBeInTheDocument();

    // 설명 문구 한글 단어 보존(break-keep) 확인
    const descElements = screen.getAllByText(/상환액이 일정하여|이자가 줄어들어|이자만 납입하므로/);
    expect(descElements).toHaveLength(3);
    descElements.forEach((el) => {
      expect(el).toHaveClass('break-keep');
    });

    // 선택 체크 아이콘이 제거되어 타이틀 대칭성이 보존되었는지 확인 (방법 1)
    expect(screen.queryByTestId('check-circle')).toBeNull();

    // 시맨틱 dl dt dd 마크업 확인 (방법 3)
    const dtElements = screen.getAllByText('총 대출이자');
    expect(dtElements).toHaveLength(3);
    expect(dtElements[0].tagName).toBe('DT');
    const ddElements = screen.getAllByText(/247,220,123원|203,062,500원|405,000,000원/);
    expect(ddElements).toHaveLength(3);
    expect(ddElements[0].tagName).toBe('DD');
  });
});
