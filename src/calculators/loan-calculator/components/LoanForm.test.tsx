import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoanForm } from './LoanForm';
import { LoanInput } from '../../../types/loan';

const MOCK_INPUT: LoanInput = {
  loanAmount: 300_000_000,
  annualRate: 4.5,
  loanTermYears: 30,
  gracePeriodMonths: 0,
  repaymentMethod: 'equal_payment',
  earlyRepayment: {
    enabled: false,
    afterMonths: 24,
    amount: 10_000_000,
    feeRate: 1.2,
  },
};

describe('Seam: LoanForm Early Repayment Switch Toggle', () => {
  it('중도상환 토글 버튼은 shadcn Button의 기본 높이/패딩 대신 명시적인 switch size 또는 h-6 w-11 규격을 가져야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <LoanForm
        input={MOCK_INPUT}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    expect(switchBtn).toBeInTheDocument();
    
    // switch 규격(h-6 w-11)이 정확히 클래스에 반영되어야 함
    expect(switchBtn.className).toContain('h-6');
    expect(switchBtn.className).toContain('w-11');
    expect(switchBtn.className).not.toContain('h-[39px]');
  });
});
