import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../../src/hooks/useDarkMode';

const STORAGE_KEY = 'dark-mode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  it('should start with light mode by default', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
  });

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle back to light mode', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should persist dark mode to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('should persist light mode to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
      result.current.toggle();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('should load dark mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);
  });

  it('should load light mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'light');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
  });

  it('should allow setting dark mode directly', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setIsDark(true);
    });

    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.setIsDark(false);
    });

    expect(result.current.isDark).toBe(false);
  });
});
