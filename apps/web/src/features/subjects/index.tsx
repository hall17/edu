import { IconBook, IconSchool } from '@tabler/icons-react';
import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function Subjects() {
  const { t } = useTranslation();

  const sidebarNavItems = [
    {
      title: t('materials.subjectsCurriculums.tabs.subjects'),
      icon: <IconBook size={18} />,
      href: '/subjects',
    },
    {
      title: t('materials.subjectsCurriculums.tabs.curriculums'),
      icon: <IconSchool size={18} />,
      href: '/subjects/curriculums',
    },
  ];

  return (
    <Main
      title={t('materials.subjectsCurriculums.title')}
      description={t('materials.subjectsCurriculums.description')}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
