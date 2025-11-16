import { Outlet, useNavigate } from '@tanstack/react-router';
import { House, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUpdateMainContext } from '@/context/MainContext';
import { useSubjectDetailsContext } from '@/features/subjects/subject-details/SubjectDetailsContext';

export function LessonDetailsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subject, curriculum, unit, lesson } = useSubjectDetailsContext();
  console.log('lesson details layout');
  const sidebarNavItems = [
    {
      title: t('subjects.lessons.details.tabs.general') as string,
      icon: <House size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId',
    },
    {
      title: t('subjects.lessons.details.tabs.materials') as string,
      icon: <FileText size={18} />,
      href: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId/materials',
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
      href: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units/${unit?.id}`,
    },
    {
      label: t('subjects.units.details.tabs.lessons'),
      href: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units/${unit?.id}/lessons`,
    },
    {
      label: lesson?.name || t('common.loading'),
    },
  ];

  // Update Main context with lesson details
  useUpdateMainContext(
    {
      title: lesson?.name || t('subjects.lessons.title'),
      description: lesson?.description,
      breadcrumbItems,
      tabItems: sidebarNavItems,
      backButton: true,
      backButtonTo: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units/${unit?.id}/lessons`,
      onClickBackButton: () => {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl) {
          navigate({ to: previousUrl });
        } else {
          navigate({
            to: `/subjects/${curriculum?.subjectId}/curriculums/${curriculum?.id}/units/${unit?.id}/lessons`,
          });
        }
      },
    },
    [lesson, unit, curriculum, t]
  );

  return <Outlet />;
}
