import { Outlet, useNavigate } from '@tanstack/react-router';
import { House, BookOpen, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  SubjectDetailsProvider,
  useSubjectDetailsContext,
} from './SubjectDetailsContext';

import { Main } from '@/components/layout/Main';

function SubjectDetailsLayoutContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subject } = useSubjectDetailsContext();

  const sidebarNavItems = [
    {
      title: t('subjects.details.tabs.general'),
      icon: <House size={18} />,
      href: '/subjects/$subjectId',
    },
    {
      title: t('subjects.details.tabs.curriculums'),
      icon: <BookOpen size={18} />,
      href: '/subjects/$subjectId/curriculums',
    },
    {
      title: t('subjects.details.tabs.teachers'),
      icon: <Users size={18} />,
      href: '/subjects/$subjectId/teachers',
    },
  ];

  const breadcrumbItems = [
    {
      label: t('subjects.title'),
      href: '/subjects',
    },
    {
      label: subject?.name || t('common.loading'),
    },
  ];

  return (
    <Main
      title={t('subjects.details.title')}
      description={t('subjects.details.description')}
      breadcrumbItems={breadcrumbItems}
      backButton
      backButtonTo="/subjects"
      onClickBackButton={() => {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl) {
          navigate({ to: previousUrl });
        } else {
          navigate({ to: '/subjects' });
        }
      }}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}

export function SubjectDetailsLayout() {
  return (
    <SubjectDetailsProvider>
      <SubjectDetailsLayoutContent />
    </SubjectDetailsProvider>
  );
}
