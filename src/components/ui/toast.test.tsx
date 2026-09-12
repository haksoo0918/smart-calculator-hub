import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from './toast';

describe('Toast Component (shadcn/ui)', () => {
  it('renders title and description properly', () => {
    render(
      <ToastProvider>
        <Toast open={true}>
          <ToastTitle>업데이트 알림</ToastTitle>
          <ToastDescription>새로운 버전이 준비되었습니다.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('업데이트 알림')).toBeInTheDocument();
    expect(screen.getByText('새로운 버전이 준비되었습니다.')).toBeInTheDocument();
  });
});
