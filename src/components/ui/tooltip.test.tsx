import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

describe('Seam 1-4: shadcn Tooltip Component', () => {
  it('마우스 호버 시 툴팁 내용이 나타나야 한다', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>초기화 버튼</button>
          </TooltipTrigger>
          <TooltipContent>기본값으로 초기화</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const button = screen.getByRole('button', { name: '초기화 버튼' });
    expect(screen.queryByText('기본값으로 초기화')).not.toBeInTheDocument();

    await userEvent.hover(button);
    expect(await screen.findByText('기본값으로 초기화')).toBeInTheDocument();
  });
});
