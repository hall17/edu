import { Outlet } from '@tanstack/react-router';
import { Monitor, Laptop, Bell, Palette, Wrench, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SidebarNav } from './components/SidebarNav';

import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Search } from '@/components/Searchx';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const { t } = useTranslation();

  const sidebarNavItems = [
    {
      title: t('settings.profile.title'),
      icon: <User size={18} />,
      href: '/settings',
    },
    {
      title: t('settings.inventory.title'),
      icon: <Laptop size={18} />,
      href: '/settings/inventory',
    },
    {
      title: t('settings.security.title'),
      icon: <Wrench size={18} />,
      href: '/settings/security',
    },
    {
      title: t('settings.preferences.title'),
      icon: <Palette size={18} />,
      href: '/settings/preferences',
    },

    // {
    //   title: t('settings.notifications.title'),
    //   icon: <IconNotification size={18} />,
    //   href: '/settings/notifications',
    // },
    // {
    //   title: t('settings.display.title'),
    //   icon: <IconBrowserCheck size={18} />,
    //   href: '/settings/display',
    // },
  ];

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-auto md:space-y-2">
          <aside className="top-0">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-auto p-1">
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  );
}
