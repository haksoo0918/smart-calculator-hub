import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PWAInstallButton } from './PWAInstallButton';
import { TooltipProvider } from '../ui/tooltip';

describe('PWAInstallButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders install button in header by default and opens guide modal when no prompt', async () => {
    render(
      <TooltipProvider>
        <PWAInstallButton variant="header" />
      </TooltipProvider>
    );

    // 시맨틱 접근성 이름으로 명시적 조회 (헤더는 데스크톱/모바일 듀얼 버튼 지원)
    const installButtons = screen.getAllByRole('button', { name: /앱 설치/i });
    expect(installButtons.length).toBeGreaterThan(0);

    // 네이티브 프롬프트 미지원 환경에서 클릭 시 가이드 모달 오픈
    await act(async () => {
      fireEvent.click(installButtons[0]);
    });

    expect(await screen.findByText('스마트 계산기 앱 설치하기')).toBeInTheDocument();
  });

  it('triggers native prompt when beforeinstallprompt was dispatched and does not open modal', async () => {
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'accepted' as const });

    render(
      <TooltipProvider>
        <PWAInstallButton variant="header" />
      </TooltipProvider>
    );

    // Dispatch beforeinstallprompt
    const event = new Event('beforeinstallprompt') as any;
    event.prompt = promptMock;
    event.userChoice = userChoiceMock;
    act(() => {
      window.dispatchEvent(event);
    });

    const installButtons = screen.getAllByRole('button', { name: /앱 설치/i });
    await act(async () => {
      fireEvent.click(installButtons[0]);
    });

    expect(promptMock).toHaveBeenCalled();
    // 네이티브 프롬프트가 떴으므로 가이드 모달은 뜨지 않아야 함
    expect(screen.queryByText('스마트 계산기 앱 설치하기')).toBeNull();
  });

  it('renders sidebar variant correctly and opens guide modal on click', async () => {
    render(
      <TooltipProvider>
        <PWAInstallButton variant="sidebar" />
      </TooltipProvider>
    );

    const button = screen.getByRole('button', { name: /스마트 계산기 앱 설치/i });
    expect(button).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(await screen.findByText('스마트 계산기 앱 설치하기')).toBeInTheDocument();
  });
});
