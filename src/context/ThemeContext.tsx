import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-preference';

const getResolvedTheme = (t: Theme): ResolvedTheme => {
  if (t === 'light') return 'light';
  if (t === 'dark') return 'dark';
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyDomTheme = (resolved: ResolvedTheme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    return getResolvedTheme(theme);
  });

  useEffect(() => {
    // 최초 마운트 시 동기화
    applyDomTheme(resolvedTheme);

    const mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
      const handleMediaChange = () => {
        if (theme === 'system') {
          const nextResolved = mediaQuery.matches ? 'dark' : 'light';
          setResolvedTheme(nextResolved);
          applyDomTheme(nextResolved);
        }
      };

      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }
  }, [theme, resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    const nextResolved = getResolvedTheme(newTheme);

    const updateStateAndStorage = () => {
      setThemeState(newTheme);
      setResolvedTheme(nextResolved);
      applyDomTheme(nextResolved);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // localStorage 접근 불가 환경 예외 무시
      }
    };

    // 모던 브라우저 View Transitions API 지원 (GPU 가속 크로스페이드)
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as unknown as { startViewTransition: unknown }).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        flushSync(() => {
          updateStateAndStorage();
        });
      });
    } else {
      updateStateAndStorage();
    }
  };

  const toggleTheme = () => {
    // 현재 적용된 resolvedTheme 기준 반대로 전환
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
