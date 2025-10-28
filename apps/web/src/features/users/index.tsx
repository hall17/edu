import { Outlet } from '@tanstack/react-router';
import { Shield, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function Users() {
  const { t } = useTranslation();

  const sidebarNavItems = [
    {
      title: t('users.tabs.users'),
      icon: <User size={18} />,
      href: '/users',
    },
    {
      title: t('users.tabs.roles'),
      icon: <Shield size={18} />,
      href: '/users/roles',
    },
  ];

  return (
    <Main
      title={t('users.title')}
      description={t('users.description')}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
