import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Seam 1-1: shadcn Button Component', () => {
  it('버튼 텍스트를 정상적으로 렌더링해야 한다', () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByRole('button', { name: '테스트 버튼' })).toBeInTheDocument();
  });

  it('클릭 시 onClick 콜백이 호출되어야 한다', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭 버튼</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: '클릭 버튼' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태일 때는 클릭이 되지 않아야 한다', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>비활성 버튼</Button>);
    
    const btn = screen.getByRole('button', { name: '비활성 버튼' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('outline variant 적용 시 해당 스타일 클래스를 포함해야 한다', () => {
    render(<Button variant="outline">아웃라인</Button>);
    const btn = screen.getByRole('button', { name: '아웃라인' });
    expect(btn.className).toContain('border');
  });
});
