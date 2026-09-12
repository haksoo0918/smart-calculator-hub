import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NumericInput } from './numeric-input';

describe('NumericInput Component', () => {
  it('천 단위 콤마가 적용되어 포맷팅된 값을 렌더링해야 한다', () => {
    render(
      <NumericInput
        aria-label="금액 입력"
        value={50000000}
        thousandSeparator
        suffix="원"
      />
    );

    const input = screen.getByLabelText('금액 입력') as HTMLInputElement;
    expect(input.value).toBe('50,000,000');
    expect(screen.getByText('원')).toBeInTheDocument();
  });

  it('값이 0이고 displayZero가 false일 때 빈 값으로 표시되어 placeholder가 노출되어야 한다', () => {
    render(
      <NumericInput
        aria-label="금액 입력"
        value={0}
        placeholder="0"
        thousandSeparator
      />
    );

    const input = screen.getByLabelText('금액 입력') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('0');
  });

  it('displayZero가 true일 때 0이 정상 표시되어야 한다', () => {
    render(
      <NumericInput
        aria-label="수치 입력"
        value={0}
        displayZero
      />
    );

    const input = screen.getByLabelText('수치 입력') as HTMLInputElement;
    expect(input.value).toBe('0');
  });

  it('사용자 입력 시 상태가 업데이트되고 최종 값이 포맷팅되어야 한다', async () => {
    const TestComponent = () => {
      const [val, setVal] = useState<number>(0);
      return (
        <NumericInput
          aria-label="금액 입력"
          value={val}
          thousandSeparator
          onNumberChange={setVal}
          suffix="원"
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByLabelText('금액 입력') as HTMLInputElement;
    await userEvent.type(input, '1234');
    expect(input.value).toBe('1,234');
  });

  it('allowDecimals가 true일 때 소수점 입력이 정상 동작해야 한다', async () => {
    const handleNumberChange = vi.fn();
    const TestComponent = () => {
      const [val, setVal] = useState<string>('');
      return (
        <NumericInput
          aria-label="금리 입력"
          value={val}
          allowDecimals
          suffix="%"
          onChange={(e) => setVal(e.target.value)}
          onNumberChange={handleNumberChange}
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByLabelText('금리 입력') as HTMLInputElement;
    await userEvent.type(input, '4.5');
    expect(input.value).toBe('4.5');
    expect(handleNumberChange).toHaveBeenLastCalledWith(4.5);
  });
});
