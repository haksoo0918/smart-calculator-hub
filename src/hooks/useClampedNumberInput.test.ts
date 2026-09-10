import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClampedNumberInput } from './useClampedNumberInput';

describe('useClampedNumberInput', () => {
  it('초기 prop value를 문자열로 올바르게 렌더링한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({ value: 10, onChange, min: 1, max: 40, fallback: 1 })
    );

    expect(result.current.value).toBe('10');
  });

  it('입력을 완전히 지웠을 때 화면은 빈 값을 유지하고 부모에게 fallback을 전달한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({ value: 10, onChange, min: 1, max: 40, fallback: 1 })
    );

    act(() => {
      result.current.onChange({ target: { value: '' } } as any);
    });

    expect(result.current.value).toBe('');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('음수 허용 모드에서 "-" 입력 시 부호를 유지하고 숫자를 붙였을 때 정상 파싱한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({
        value: 3.5,
        onChange,
        min: -5,
        max: 50,
        fallback: 0,
        allowNegative: true,
      })
    );

    act(() => {
      result.current.onChange({ target: { value: '-' } } as any);
    });
    expect(result.current.value).toBe('-');

    act(() => {
      result.current.onChange({ target: { value: '-3' } } as any);
    });
    expect(result.current.value).toBe('-3');
    expect(onChange).toHaveBeenCalledWith(-3);
  });

  it('onBlur 시 범위를 초과하는 값을 max/min으로 클램핑한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({ value: 10, onChange, min: 1, max: 40, fallback: 1 })
    );

    act(() => {
      result.current.onChange({ target: { value: '99' } } as any);
    });
    expect(result.current.value).toBe('99');

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.value).toBe('40');
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('onBlur 시 min 미만 값도 min으로 클램핑한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({
        value: 5,
        onChange,
        min: -5,
        max: 50,
        fallback: 0,
        allowNegative: true,
      })
    );

    act(() => {
      result.current.onChange({ target: { value: '-10' } } as any);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.value).toBe('-5');
    expect(onChange).toHaveBeenCalledWith(-5);
  });

  it('onBlur 시 빈 값 상태이면 fallback으로 안전하게 복원한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({ value: 10, onChange, min: 1, max: 40, fallback: 1 })
    );

    act(() => {
      result.current.onChange({ target: { value: '' } } as any);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.value).toBe('1');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('외부에서 prop value가 변경되면 (슬라이더/프리셋) input에 동기화된다', () => {
    const onChange = vi.fn();
    let externalValue = 10;
    const { result, rerender } = renderHook(() =>
      useClampedNumberInput({ value: externalValue, onChange, min: 1, max: 40, fallback: 1 })
    );

    expect(result.current.value).toBe('10');

    externalValue = 20;
    rerender();

    expect(result.current.value).toBe('20');
  });

  it('precision 옵션에 따라 소수점 자릿수를 반올림한다', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useClampedNumberInput({
        value: 3.5,
        onChange,
        min: -5,
        max: 50,
        fallback: 0,
        precision: 1,
      })
    );

    act(() => {
      result.current.onChange({ target: { value: '8.456' } } as any);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.value).toBe('8.5');
    expect(onChange).toHaveBeenCalledWith(8.5);
  });
});
