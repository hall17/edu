import { Outlet, useLocation } from '@tanstack/react-router';
import { ClipboardList, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function AssessmentsRoot() {
  const { t } = useTranslation();
  const location = useLocation();

  const isAssessmentsPage =
    location.pathname === '/assessments' ||
    location.pathname === '/assessments/';

  const sidebarNavItems = [
    {
      title: t('assessments.tabs.templates'),
      icon: <ClipboardList size={18} />,
      href: '/assessments',
    },
    {
      title: t('assessments.tabs.assigned'),
      icon: <Users size={18} />,
      href: '/assessments/assigned',
    },
  ];

  return (
    <Main
      title={
        isAssessmentsPage
          ? t('assessments.title')
          : t('assessments.assigned.title')
      }
      description={
        isAssessmentsPage
          ? t('assessments.description')
          : t('assessments.assigned.description')
      }
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
