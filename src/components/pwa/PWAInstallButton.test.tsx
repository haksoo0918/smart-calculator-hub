import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PWAInstallButton } from './PWAInstallButton';
import { TooltipProvider } from '../ui/tooltip';

describe('PWAInstallButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when not installable', () => {
    const { container } = render(
      <TooltipProvider>
        <PWAInstallButton variant="header" />
      </TooltipProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders and triggers install prompt when beforeinstallprompt is dispatched', async () => {
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'accepted' as const });

    render(
      <TooltipProvider>
        <PWAInstallButton variant="header" />
      </TooltipProvider>
    );

    // Dispatch beforeinstallprompt event
    const event = new Event('beforeinstallprompt') as any;
    event.prompt = promptMock;
    event.userChoice = userChoiceMock;
    act(() => {
      window.dispatchEvent(event);
    });

    // Button should now be visible
    const buttons = await screen.findAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Click install button
    await act(async () => {
      fireEvent.click(buttons[0]);
    });
    expect(promptMock).toHaveBeenCalled();
  });

  it('renders sidebar variant correctly when installable', async () => {
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'dismissed' as const });

    render(
      <TooltipProvider>
        <PWAInstallButton variant="sidebar" />
      </TooltipProvider>
    );

    const event = new Event('beforeinstallprompt') as any;
    event.prompt = promptMock;
    event.userChoice = userChoiceMock;
    act(() => {
      window.dispatchEvent(event);
    });

    const button = await screen.findByRole('button', { name: /스마트 계산기 앱 설치/i });
    expect(button).toBeInTheDocument();
  });
});
