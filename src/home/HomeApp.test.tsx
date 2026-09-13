import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomeApp from './HomeApp';

describe('HomeApp Dashboard Component Tests', () => {
  const renderHomeApp = () =>
    render(
      <MemoryRouter>
        <HomeApp />
      </MemoryRouter>
    );

  it('히어로 섹션과 전체 계산기 카드 목록이 렌더링되어야 한다', () => {
    renderHomeApp();

    // 히어로 텍스트
    expect(screen.getByText('일상과 금융을 위한')).toBeInTheDocument();
    expect(screen.getByText('스마트 계산기')).toBeInTheDocument();

    // 5대 활성 계산기 카드 노출 확인
    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
    expect(screen.getByText('대출이자 & 상환방식 비교')).toBeInTheDocument();
    expect(screen.getByText('연봉 실수령액 계산기')).toBeInTheDocument();
    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.getByText('환율 계산기')).toBeInTheDocument();

    // 준비 중인 계산기 노출 확인
    expect(screen.getByText('배당금 & 월 배당 달력')).toBeInTheDocument();
    expect(screen.getByText('목표 자산 역산 계산기')).toBeInTheDocument();
  });

  it('키워드 검색창에 "대출" 입력 시 대출 계산기만 필터링되어야 한다', () => {
    renderHomeApp();

    const searchInput = screen.getByPlaceholderText(/계산기 이름이나 키워드 검색/i);
    fireEvent.change(searchInput, { target: { value: '대출' } });

    expect(screen.getByText('대출이자 & 상환방식 비교')).toBeInTheDocument();
    expect(screen.queryByText('연복리 & 자산성장 계산기')).not.toBeInTheDocument();
    expect(screen.queryByText('단위 변환기')).not.toBeInTheDocument();
  });

  it('키워드 검색창에 "평수" 입력 시 단위 변환기가 키워드로 필터링되어야 한다', () => {
    renderHomeApp();

    const searchInput = screen.getByPlaceholderText(/계산기 이름이나 키워드 검색/i);
    fireEvent.change(searchInput, { target: { value: '평수' } });

    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.queryByText('연복리 & 자산성장 계산기')).not.toBeInTheDocument();
  });

  it('카테고리 칩 "생활 & 측정" 클릭 시 단위 변환기만 노출되어야 한다', () => {
    renderHomeApp();

    const lifestyleChip = screen.getByRole('button', { name: '생활 & 측정' });
    fireEvent.click(lifestyleChip);

    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.queryByText('연복리 & 자산성장 계산기')).not.toBeInTheDocument();
    expect(screen.queryByText('대출이자 & 상환방식 비교')).not.toBeInTheDocument();
  });

  it('검색 결과가 없을 때 빈 상태 안내가 표시되고 전체 목록 보기 버튼으로 복구되어야 한다', () => {
    renderHomeApp();

    const searchInput = screen.getByPlaceholderText(/계산기 이름이나 키워드 검색/i);
    fireEvent.change(searchInput, { target: { value: '존재하지않는계산기xyz' } });

    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: '전체 목록 보기' });
    fireEvent.click(resetBtn);

    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
  });
});
