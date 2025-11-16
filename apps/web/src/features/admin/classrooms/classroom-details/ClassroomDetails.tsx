import { Outlet, useNavigate } from '@tanstack/react-router';
import { Calendar, Users, BarChart3 } from 'lucide-react';
import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  ClassroomDetailsProvider,
  useClassroomDetailsContext,
} from './ClassroomDetailsContext';

import { Main } from '@/components/layout/Main';

function ClassroomDetailsContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classroom } = useClassroomDetailsContext();

  const sidebarNavItems = [
    {
      title: t('classrooms.details.tabs.general'),
      icon: <House size={18} />,
      href: '/classrooms/$classroomId',
    },
    {
      title: t('classrooms.details.tabs.students'),
      icon: <Users size={18} />,
      href: '/classrooms/$classroomId/students',
    },
    {
      title: t('classrooms.details.tabs.calendar'),
      icon: <Calendar size={18} />,
      href: '/classrooms/$classroomId/calendar',
    },
    {
      title: t('classrooms.details.tabs.attendance'),
      icon: <BarChart3 size={18} />,
      href: '/classrooms/$classroomId/attendance',
    },
  ];

  const breadcrumbItems = [
    {
      label: t('classrooms.title'),
      href: '/classrooms',
    },
    {
      label: classroom?.name || t('common.loading'),
    },
  ];

  return (
    <Main
      title={t('classrooms.details.title')}
      description={t('classrooms.details.description')}
      breadcrumbItems={breadcrumbItems}
      backButton
      backButtonTo="/classrooms"
      onClickBackButton={() => {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl) {
          navigate({ to: previousUrl });
        } else {
          navigate({ to: '/classrooms' });
        }
      }}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}

export function ClassroomDetails() {
  return (
    <ClassroomDetailsProvider>
      <ClassroomDetailsContent />
    </ClassroomDetailsProvider>
  );
}
