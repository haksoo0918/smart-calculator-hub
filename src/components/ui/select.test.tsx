import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

describe('shadcn Select Component Tests', () => {
  it('Select 컴포넌트가 트리거와 선택된 값을 정상 렌더링해야 한다', () => {
    render(
      <Select defaultValue="sqm">
        <SelectTrigger aria-label="단위 선택">
          <SelectValue placeholder="단위 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sqm">제곱미터 (㎡)</SelectItem>
          <SelectItem value="pyeong">평 (坪)</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('제곱미터 (㎡)');
  });
});
