import * as React from 'react';

export interface UseClampedNumberInputOptions {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  fallback?: number;
  allowNegative?: boolean;
  precision?: number;
}

export interface UseClampedNumberInputReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

/**
 * 숫자 입력 필드의 타이핑 버퍼링, 빈 값/음수 부호 허용, 외부 동기화, onBlur 클램핑을 총괄하는 커스텀 훅
 */
export function useClampedNumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  fallback = 0,
  allowNegative = false,
  precision = 1,
}: UseClampedNumberInputOptions): UseClampedNumberInputReturn {
  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (value === undefined || isNaN(value)) return '';
    return value.toString();
  });

  const lastEmittedValueRef = React.useRef<number>(value);
  const prevValueRef = React.useRef<number>(value);

  // 외부 값(슬라이더, 프리셋 버튼 등) 변경 시 동기화
  React.useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      if (value === undefined || isNaN(value)) {
        if (displayValue !== '') {
          setDisplayValue('');
          lastEmittedValueRef.current = NaN;
        }
      } else if (value !== lastEmittedValueRef.current) {
        setDisplayValue(value.toString());
        lastEmittedValueRef.current = value;
      }
    }
  }, [value, displayValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // 1. 완전히 비운 경우: 화면은 빈 값 유지, 부모에는 fallback 전달
      if (raw === '') {
        setDisplayValue('');
        lastEmittedValueRef.current = fallback;
        onChange(fallback);
        return;
      }

      // 2. 음수 부호만 입력된 경우 (음수 허용 모드)
      if (allowNegative && raw === '-') {
        setDisplayValue('-');
        return;
      }

      // 3. 숫자 파싱
      const parsed = parseFloat(raw);
      if (isNaN(parsed)) {
        setDisplayValue('');
        lastEmittedValueRef.current = fallback;
        onChange(fallback);
        return;
      }

      setDisplayValue(raw);
      lastEmittedValueRef.current = parsed;
      onChange(parsed);
    },
    [allowNegative, fallback, onChange]
  );

  const handleBlur = React.useCallback(() => {
    // 빈 값 또는 부호만 남은 상태에서 포커스 아웃 시 fallback으로 안전 보정
    if (displayValue === '' || displayValue === '-') {
      const clampedFallback = Math.max(min, Math.min(max, fallback));
      setDisplayValue(clampedFallback.toString());
      lastEmittedValueRef.current = clampedFallback;
      onChange(clampedFallback);
      return;
    }

    const parsed = parseFloat(displayValue);
    const num = isNaN(parsed) ? fallback : parsed;

    // 소수점 자리수 반올림
    const factor = Math.pow(10, precision);
    const rounded = Math.round(num * factor) / factor;

    // 범위 클램핑
    const clamped = Math.max(min, Math.min(max, rounded));
    setDisplayValue(clamped.toString());
    lastEmittedValueRef.current = clamped;
    onChange(clamped);
  }, [displayValue, fallback, max, min, onChange, precision]);

  return {
    value: displayValue,
    onChange: handleChange,
    onBlur: handleBlur,
  };
}
