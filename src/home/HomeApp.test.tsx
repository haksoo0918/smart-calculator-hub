import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomeApp from './HomeApp';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomeApp Compact Dashboard Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderHomeApp = () =>
    render(
      <MemoryRouter>
        <HomeApp />
      </MemoryRouter>
    );

  it('헤더와 5대 계산기 카드가 렌더링되어야 한다', () => {
    renderHomeApp();

    expect(screen.getByText('계산기 모아보기')).toBeInTheDocument();

    // 5대 활성 계산기 shortName 노출 확인
    expect(screen.getByText('연복리 계산기')).toBeInTheDocument();
    expect(screen.getByText('대출이자 계산기')).toBeInTheDocument();
    expect(screen.getByText('연봉 계산기')).toBeInTheDocument();
    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.getByText('환율 계산기')).toBeInTheDocument();

    // 준비 중인 계산기 노출 확인
    expect(screen.getByText('배당금 계산기')).toBeInTheDocument();
    expect(screen.getByText('목표자산 역산')).toBeInTheDocument();
  });

  it('카테고리 칩 "생활 & 측정" 클릭 시 단위 변환기만 필터링되어야 한다', () => {
    renderHomeApp();

    const lifestyleChip = screen.getByRole('button', { name: '생활 & 측정' });
    fireEvent.click(lifestyleChip);

    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.queryByText('연복리 계산기')).not.toBeInTheDocument();
    expect(screen.queryByText('대출이자 계산기')).not.toBeInTheDocument();
  });

  it('카테고리 칩 "금융 & 자산" 클릭 시 금융 계산기들이 필터링되어야 한다', () => {
    renderHomeApp();

    const financeChip = screen.getByRole('button', { name: '금융 & 자산' });
    fireEvent.click(financeChip);

    expect(screen.getByText('연복리 계산기')).toBeInTheDocument();
    expect(screen.getByText('대출이자 계산기')).toBeInTheDocument();
    expect(screen.getByText('연봉 계산기')).toBeInTheDocument();
    expect(screen.queryByText('단위 변환기')).not.toBeInTheDocument();
    expect(screen.queryByText('환율 계산기')).not.toBeInTheDocument();
  });

  it('계산기 카드 클릭 시 해당 URL로 이동해야 한다', () => {
    renderHomeApp();

    const loanCard = screen.getByText('대출이자 계산기');
    fireEvent.click(loanCard);

    expect(mockNavigate).toHaveBeenCalledWith('/loan');
  });
});
