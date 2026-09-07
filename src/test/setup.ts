import '@testing-library/jest-dom';

// JSDOM Recharts ResponsiveContainer Mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
