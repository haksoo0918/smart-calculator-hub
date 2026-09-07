import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('Seam 2-1: React Router Navigation and Routing', () => {
  it('/compound 경로에서는 연복리 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/compound']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
    expect(await screen.findByText('투자 조건 설정', {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('/unit 경로에서는 단위 변환기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/unit']}>
        <App />
      </MemoryRouter>
    );

    expect((await screen.findAllByText('단위 변환기')).length).toBeGreaterThanOrEqual(1);
  });

  it('/exchange 경로에서는 환율 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/exchange']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('환율 계산기').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('전체 주요 통화 실시간 일괄 환산', {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('/ 경로로 접속 시 /compound(연복리 계산기)로 자동 리다이렉트되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('연복리 & 자산성장 계산기', {}, { timeout: 4000 })).toBeInTheDocument();
  });
});
