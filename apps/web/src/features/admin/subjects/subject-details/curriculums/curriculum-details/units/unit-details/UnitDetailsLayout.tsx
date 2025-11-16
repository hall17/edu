import { Outlet, useNavigate } from '@tanstack/react-router';
import { House, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUpdateMainContext } from '@/context/MainContext';
import { useSubjectDetailsContext } from '@/features/admin/subjects/subject-details/SubjectDetailsContext';

export function UnitDetailsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subject, curriculum, unit } = useSubjectDetailsContext();

  const sidebarNavItems = [
    {
      title: t('subjects.units.details.tabs.general') as string,
      icon: <House size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId',
    },
    {
      title: t('subjects.units.details.tabs.lessons') as string,
      icon: <BookOpen size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons',
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
      href: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}`,
    },
    {
      label: t('subjects.curriculums.details.tabs.units'),
      href: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units`,
    },
    {
      label: unit?.name || t('common.loading'),
    },
  ];

  // Update Main context with unit details
  useUpdateMainContext(
    {
      title: unit?.name || t('subjects.units.title'),
      description: unit?.description,
      breadcrumbItems,
      tabItems: sidebarNavItems,
      backButton: true,
      backButtonTo: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units`,
      onClickBackButton: () => {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl) {
          navigate({ to: previousUrl });
        } else {
          navigate({
            to: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units`,
          });
        }
      },
    },
    [unit, curriculum, t]
  );

  return <Outlet />;
}
