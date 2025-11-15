import { Outlet, useNavigate } from '@tanstack/react-router';
import { House, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUpdateMainContext } from '@/context/MainContext';
import { useSubjectDetailsContext } from '../../SubjectDetailsContext';

export function CurriculumDetailsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subject, curriculum } = useSubjectDetailsContext();

  const sidebarNavItems = [
    {
      title: t('subjects.curriculums.details.tabs.general') as string,
      icon: <House size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId',
    },
    {
      title: t('subjects.curriculums.details.tabs.units') as string,
      icon: <BookOpen size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units',
    },
  ];

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

  // Update Main context with curriculum details
  useUpdateMainContext(
    {
      title: curriculum?.name || t('subjects.curriculums.title'),
      description: curriculum?.description,
      breadcrumbItems,
      tabItems: sidebarNavItems,
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
