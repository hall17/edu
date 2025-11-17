import {
  LinkProps,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { House, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSubjectDetailsContext } from '../../SubjectDetailsContext';

import { TabItem, useUpdateMainContext } from '@/context/MainContext';

export function CurriculumDetailsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subject, curriculum } = useSubjectDetailsContext();
  const location = useLocation();

  const sidebarNavItems = {
    general: {
      title: t('subjects.curriculums.details.tabs.general') as string,
      icon: <House size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId' as LinkProps['to'],
    },
    units: {
      title: t('subjects.curriculums.details.tabs.units') as string,
      icon: <BookOpen size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units' as LinkProps['to'],
    },
  };

  console.log('curriculum details layout');

  const isUnitsTab = location.pathname.endsWith('units');

  const breadcrumbItems = [
    {
      label: t('subjects.title'),
      href: '/subjects',
    },
    {
      label: subject?.name || t('common.loading'),
      href: `/subjects/${curriculum?.subjectId}`,
    },
    {
      label: t('subjects.details.tabs.curriculums'),
      href: `/subjects/${curriculum?.subjectId}/curriculums`,
    },
    {
      label: curriculum?.name || t('common.loading'),
    },
  ];

  if (isUnitsTab) {
    breadcrumbItems.push({
      label: t('subjects.curriculums.details.tabs.units'),
      href: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units`,
    });
  }

  useUpdateMainContext(
    {
      title: curriculum?.name || t('subjects.curriculums.title'),
      description: curriculum?.description,
      breadcrumbItems,
      tabItems: Object.values(sidebarNavItems) as TabItem[],
      backButton: true,
      backButtonTo: `/subjects/${curriculum?.subjectId}/curriculums`,
      onClickBackButton: () => {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl) {
          navigate({ to: previousUrl });
        } else {
          navigate({ to: `/subjects/${curriculum?.subjectId}/curriculums` });
        }
      },
    },
    [curriculum, t]
  );

  return <Outlet />;
}
