import {
  Outlet,
  useNavigate,
  LinkProps,
  useLocation,
} from '@tanstack/react-router';
import { House, BookOpen, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  SubjectDetailsProvider,
  useSubjectDetailsContext,
} from './SubjectDetailsContext';

import { Main } from '@/components/layout/Main';
import { TabItem } from '@/context/MainContext';

function SubjectDetailsLayoutContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { subject } = useSubjectDetailsContext();

  const sidebarNavItems = {
    root: {
      title: t('subjects.details.tabs.general'),
      icon: <House size={18} />,
      href: '/subjects/$subjectId' as LinkProps['to'],
    },
    curriculums: {
      title: t('subjects.details.tabs.curriculums'),
      icon: <BookOpen size={18} />,
      href: '/subjects/$subjectId/curriculums' as LinkProps['to'],
    },
    teachers: {
      title: t('subjects.details.tabs.teachers'),
      icon: <Users size={18} />,
      href: '/subjects/$subjectId/teachers' as LinkProps['to'],
    },
  };

  const isSubjectDetailsPage = location.pathname === sidebarNavItems.root.href;
  const isSubjectCurriculumsPage = location.pathname.endsWith('curriculums');
  const isSubjectTeachersPage = location.pathname.endsWith('teachers');

  const breadcrumbItems: { label: string; href?: string }[] = [
    {
      label: t('subjects.title'),
      href: '/subjects',
    },
  ];

  if (isSubjectDetailsPage) {
    breadcrumbItems.push({
      label: subject?.name ?? '',
      href: `/subjects/${subject?.id}`,
    });
  } else if (isSubjectCurriculumsPage) {
    breadcrumbItems.push({
      label: t('subjects.details.tabs.curriculums'),
      href: `/subjects/${subject?.id}/curriculums`,
    });
  } else if (isSubjectTeachersPage) {
    breadcrumbItems.push({
      label: t('subjects.details.tabs.teachers'),
      href: `/subjects/${subject?.id}/teachers`,
    });
  }

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
      tabItems={Object.values(sidebarNavItems) as TabItem[]}
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
