import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('Seam 2-1: React Router Navigation and Routing', () => {
  it('/compound 경로에서는 연복리 계산기 화면이 렌더링되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/compound']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
    expect(screen.getByText('투자 조건 설정')).toBeInTheDocument();
  });

  it('/unit 경로에서는 단위 변환기 화면이 렌더링되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/unit']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('단위 변환기').length).toBeGreaterThanOrEqual(1);
  });

  it('/ 경로로 접속 시 /compound(연복리 계산기)로 자동 리다이렉트되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
  });
});
