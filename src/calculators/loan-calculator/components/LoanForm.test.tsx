import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoanForm } from './LoanForm';
import { LoanInput } from '../../../types/loan';

const MOCK_INPUT_OFF: LoanInput = {
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

const MOCK_INPUT_ON: LoanInput = {
  ...MOCK_INPUT_OFF,
  earlyRepayment: {
    ...MOCK_INPUT_OFF.earlyRepayment!,
    enabled: true,
  },
};

describe('Seam: LoanForm Early Repayment Switch Toggle Position', () => {
  it('스위치 버튼은 justify-start 속성을 가져 썸이 중앙에 뜨지 않고 왼쪽 끝에서 시작해야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <LoanForm
        input={MOCK_INPUT_OFF}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    expect(switchBtn).toBeInTheDocument();
    
    // 버튼 기본의 justify-center를 덮어쓰고 justify-start로 정렬되어야 썸이 왼쪽 끝에 위치함
    expect(switchBtn.className).toContain('justify-start');
  });

  it('OFF 상태일 때 썸은 translate-x-0이어야 하고, ON 상태일 때 translate-x-5로 이동해야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    const { rerender } = render(
      <LoanForm
        input={MOCK_INPUT_OFF}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    let switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    let thumb = switchBtn.firstElementChild;
    expect(thumb?.className).toContain('translate-x-0');
    expect(thumb?.className).not.toContain('translate-x-5');

    // ON 상태로 리렌더링
    rerender(
      <LoanForm
        input={MOCK_INPUT_ON}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    thumb = switchBtn.firstElementChild;
    expect(thumb?.className).toContain('translate-x-5');
  });
});
