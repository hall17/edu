import { Theme } from '@prisma/client';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/stores/authStore';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'LIGHT',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'LIGHT',
  storageKey = 'edusama-theme',
  ...props
}: ThemeProviderProps) {
  const { user, setUserPreferences } = useAuth();
  const [theme, _setTheme] = useState<Theme>(
    () =>
      user?.preferences?.theme ||
      (localStorage.getItem(storageKey) as Theme) ||
      defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark'); // Remove existing theme classes
      // const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      // const effectiveTheme = theme === 'system' ? systemTheme : theme;
      root.classList.add(theme.toLowerCase()); // Add the new theme class
    };

    const handleChange = () => {
      applyTheme(theme);
    };

    applyTheme(theme);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setUserPreferences({ theme });
    _setTheme(theme);
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
