import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PWAInstallButton } from './PWAInstallButton';
import { PWAInstallModal } from './PWAInstallModal';
import { usePWAInstall, __resetPWAInstallForTesting } from '../../hooks/usePWAInstall';
import { TooltipProvider } from '../ui/tooltip';

const TestPWAApp = ({
  variant = 'header',
  onActionComplete,
}: {
  variant?: 'header' | 'sidebar';
  onActionComplete?: () => void;
}) => {
  const { isModalOpen, closeModal, install, isInstallable } = usePWAInstall();
  return (
    <TooltipProvider>
      <PWAInstallButton variant={variant} onActionComplete={onActionComplete} />
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onInstall={install}
        isInstallable={isInstallable}
      />
    </TooltipProvider>
  );
};

describe('PWAInstallButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetPWAInstallForTesting();
  });

  it('renders install button in header by default and opens guide modal when no prompt', async () => {
    render(<TestPWAApp variant="header" />);

    // 시맨틱 접근성 이름으로 명시적 조회 (헤더는 데스크톱/모바일 듀얼 버튼 지원)
    const installButtons = screen.getAllByRole('button', { name: /앱 설치/i });
    expect(installButtons.length).toBeGreaterThan(0);

    // 네이티브 프롬프트 미지원 환경에서 클릭 시 가이드 모달 오픈
    await act(async () => {
      fireEvent.click(installButtons[0]);
    });

    expect(await screen.findByText('스마트 계산기 앱 설치 안내')).toBeInTheDocument();
  });

  it('triggers native prompt when beforeinstallprompt was dispatched and does not open modal in header', async () => {
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'accepted' as const });

    render(<TestPWAApp variant="header" />);

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
    expect(screen.queryByText('스마트 계산기 앱 설치 안내')).toBeNull();
  });

  it('renders sidebar variant with "앱 설치 가이드" and triggers onActionComplete and opens modal', async () => {
    const onActionCompleteMock = vi.fn();

    render(<TestPWAApp variant="sidebar" onActionComplete={onActionCompleteMock} />);

    const button = screen.getByRole('button', { name: /앱 설치 가이드/i });
    expect(button).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(onActionCompleteMock).toHaveBeenCalled();
    expect(await screen.findByText('스마트 계산기 앱 설치 안내')).toBeInTheDocument();
  });

  it('provides direct install button inside modal when installable', async () => {
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'dismissed' as const });

    render(<TestPWAApp variant="sidebar" />);

    // Dispatch beforeinstallprompt
    const event = new Event('beforeinstallprompt') as any;
    event.prompt = promptMock;
    event.userChoice = userChoiceMock;
    act(() => {
      window.dispatchEvent(event);
    });

    // 사이드바 버튼 클릭 -> 모달 오픈
    const button = screen.getByRole('button', { name: /앱 설치 가이드/i });
    await act(async () => {
      fireEvent.click(button);
    });

    // 모달 내부 [스마트 계산기 앱 지금 설치하기] 버튼 확인 및 클릭
    const directInstallBtn = await screen.findByRole('button', { name: /지금 설치하기/i });
    expect(directInstallBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(directInstallBtn);
    });

    expect(promptMock).toHaveBeenCalled();
  });
});


