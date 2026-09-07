import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from './table';

describe('Seam 1-3: shadcn Input and Table Components', () => {
  it('Input에 값을 입력하면 onChange 핸들러가 호출되어야 한다', async () => {
    const handleChange = vi.fn();
    render(<Input placeholder="금액 입력" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('금액 입력');
    await userEvent.type(input, '100');
    expect(handleChange).toHaveBeenCalled();
  });

  it('Table 컴포넌트가 행과 열을 정상적으로 렌더링해야 한다', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>연차</TableHead>
            <TableHead>원금</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1년</TableCell>
            <TableCell>1,000만 원</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText('연차')).toBeInTheDocument();
    expect(screen.getByText('1년')).toBeInTheDocument();
    expect(screen.getByText('1,000만 원')).toBeInTheDocument();
  });
});
