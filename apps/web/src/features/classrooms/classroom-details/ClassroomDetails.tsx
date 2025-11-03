import { Outlet, useNavigate } from '@tanstack/react-router';
import { Calendar, Users } from 'lucide-react';
import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ClassroomDetailsProvider } from './ClassroomDetailsContext';

import { Main } from '@/components/layout/Main';

export function ClassroomDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      title: t('classrooms.details.tabs.sessions'),
      icon: <Calendar size={18} />,
      href: '/classrooms/$classroomId/sessions',
    },
  ];

  return (
    <ClassroomDetailsProvider>
      <Main
        title={t('classrooms.details.title')}
        description={t('classrooms.details.description')}
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
    </ClassroomDetailsProvider>
  );
}
