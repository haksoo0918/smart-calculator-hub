import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// JSDOM Recharts ResponsiveContainer Mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { style: { width: 800, height: 400 } }, children),
  };
});

// MatchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Virtual PWA Register Mock
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    offlineReady: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

