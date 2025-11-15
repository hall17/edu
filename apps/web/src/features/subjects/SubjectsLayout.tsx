import { Outlet } from '@tanstack/react-router';
import { Book, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function SubjectsLayout() {
  console.log('SubjectsLayout');
  const { t } = useTranslation();

  const sidebarNavItems = [
    {
      title: t('materials.subjectsCurriculums.tabs.subjects'),
      icon: <Book size={18} />,
      href: '/subjects',
    },
    {
      title: t('materials.subjectsCurriculums.tabs.curriculums'),
      icon: <GraduationCap size={18} />,
      href: '/subjects/curriculums',
    },
  ];

  const breadcrumbItems = [
    {
      label: t('materials.subjectsCurriculums.title'),
      href: '/subjects',
    },
  ];

  return (
    <Main
      title={t('materials.subjectsCurriculums.title')}
      description={t('materials.subjectsCurriculums.description')}
      breadcrumbItems={breadcrumbItems}
      // tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
