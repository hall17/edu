import { Theme } from '@edusama/server';
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/authStore';

export function ThemeSwitch() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { setUserPreferences } = useAuth();
  const updateUserPreferencesMutation = useMutation(
    trpc.auth.updateUserPreferences.mutationOptions()
  );

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'DARK' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  function handleThemeChange(theme: Theme) {
    setTheme(theme);
    setUserPreferences({ theme });
    updateUserPreferencesMutation.mutate({ theme });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconSun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <IconMoon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange(Theme.LIGHT)}>
          {t(`themes.${Theme.LIGHT}`)}
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'LIGHT' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange(Theme.DARK)}>
          {t(`themes.${Theme.DARK}`)}
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'DARK' && 'hidden')}
          />
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setTheme('SYSTEM')}>
          System
          <IconCheck
            size={14}
            className={cn('ml-auto', theme !== 'SYSTEM' && 'hidden')}
          />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
