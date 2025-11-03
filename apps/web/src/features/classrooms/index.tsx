import { Outlet, useLocation } from '@tanstack/react-router';
import { GraduationCap, LayoutTemplate } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function ClassroomsRoot() {
  const { t } = useTranslation();
  const location = useLocation();

  const isClassroomsPage = location.pathname === '/classrooms';

  console.log('location', location);
  const sidebarNavItems = [
    {
      title: t('classrooms.tabs.classrooms'),
      icon: <GraduationCap size={18} />,
      href: '/classrooms',
    },
    {
      title: t('classrooms.tabs.templates'),
      icon: <LayoutTemplate size={18} />,
      href: '/classrooms/templates',
    },
  ];

  return (
    <Main
      title={
        isClassroomsPage
          ? t('classrooms.title')
          : t('classrooms.templates.title')
      }
      description={
        isClassroomsPage
          ? t('classrooms.description')
          : t('classrooms.templates.description')
      }
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
