import { IconSchool, IconTemplate } from '@tabler/icons-react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ClassroomDetailsMain } from './classroom-details/ClassroomDetails';

import { Main } from '@/components/layout/Main';

export function ClassroomsRoot() {
  const location = useLocation();
  const params = useParams({} as any);

  if ('classroomId' in params) {
    return <Outlet />;
  }

  return <ClassroomMain />;
}

function ClassroomMain() {
  const { t } = useTranslation();
  const sidebarNavItems = [
    {
      title: t('classrooms.tabs.classrooms'),
      icon: <IconSchool size={18} />,
      href: '/classrooms',
    },
    {
      title: t('classrooms.tabs.templates'),
      icon: <IconTemplate size={18} />,
      href: '/classrooms/templates',
    },
  ];

  return (
    <Main
      title={t('classrooms.title')}
      description={t('classrooms.description')}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
