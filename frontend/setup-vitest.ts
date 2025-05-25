import '@testing-library/jest-dom';
import './src/mocks/server';
import { vi } from 'vitest';
global.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};
