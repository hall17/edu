import { Outlet } from '@tanstack/react-router';
import Cookies from 'js-cookie';

import { NotificationBell } from '../notifications/NotificationBell';
import { NotificationsProvider } from '../notifications/NotificationsContext';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Search } from '@/components/Searchx';
import { SkipToMain } from '@/components/SkipToMain';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainProvider } from '@/context/MainContext';
import { SearchProvider } from '@/context/SearchContext';
import { cn } from '@/lib/utils';

interface Props {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';

  return (
    <SearchProvider>
      <NotificationsProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <MainProvider>
            <SkipToMain />
            <AppSidebar />
            <div
              id="content"
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'sm:transition-[width] sm:duration-200 sm:ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
              )}
            >
              <Header fixed>
                <Search />
                <div className="ml-auto flex items-center space-x-4">
                  <ThemeSwitch />
                  <NotificationBell />
                  <ProfileDropdown />
                </div>
              </Header>
              {children ? children : <Outlet />}
            </div>
          </MainProvider>
        </SidebarProvider>
      </NotificationsProvider>
    </SearchProvider>
  );
}
