import { IconCalendar, IconUsers } from '@tabler/icons-react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ClassroomDetailsProvider } from './ClassroomDetailsContext';

import { Main } from '@/components/layout/Main';

export function ClassroomDetailsMain() {
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
      icon: <IconUsers size={18} />,
      href: '/classrooms/$classroomId/students',
    },
    {
      title: t('classrooms.details.tabs.sessions'),
      icon: <IconCalendar size={18} />,
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
