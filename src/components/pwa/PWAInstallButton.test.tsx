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

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Click button without native prompt -> opens guide modal
    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    expect(await screen.findByText('스마트 계산기 앱 설치하기')).toBeInTheDocument();
  });

  it('triggers native prompt when beforeinstallprompt was dispatched', async () => {
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

    const buttons = screen.getAllByRole('button');
    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    expect(promptMock).toHaveBeenCalled();
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
