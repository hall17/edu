import {
  IconCalendarCheck,
  IconDeviceLaptop,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconPackages,
  IconPalette,
  IconSettings,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react';
import {
  FilesIcon,
  GitBranch,
  SchoolIcon,
  ShieldUser,
  Building2,
  FileQuestionIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { type SidebarData } from '../types';

import { useAuth } from '@/stores/authStore';

export function useSidebarData() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const sidebarData = useMemo(() => {
    return {
      user: {
        name: user?.fullName ?? '',
        email: user?.email ?? '',
        avatar: '/avatars/shadcn.jpg',
      },

      navGroups: [
        {
          title: t('sidebar.navGroups.academySection'),
          items: [
            {
              title: t('sidebar.navigation.dashboard'),
              url: '/',
              icon: IconLayoutDashboard,
            },
            // {
            //   title: t('sidebar.navigation.tasks'),
            //   url: '/tasks',
            //   icon: IconChecklist,
            // },
            // {
            //   title: t('sidebar.navigation.apps'),
            //   url: '/apps',
            //   icon: IconPackages,
            // },
            // {
            //   title: t('sidebar.navigation.chats'),
            //   url: '/chats',
            //   badge: '3',
            //   icon: IconMessages,
            // },

            {
              title: t('sidebar.navigation.students'),
              url: '/students',
              icon: IconUsers,
            },
            {
              title: t('sidebar.navigation.teachers'),
              url: '/teachers',
              icon: IconUserCog,
            },
            {
              title: t('sidebar.navigation.parents'),
              url: '/parents',
              icon: IconUsers,
            },
            {
              title: t('sidebar.navigation.classrooms'),
              url: '/classrooms',
              icon: SchoolIcon,
            },
            {
              title: t('sidebar.navigation.attendance'),
              url: '/attendance',
              icon: IconCalendarCheck,
            },
            {
              title: t('sidebar.navigation.subjectsCurriculums'),
              url: '/subjects',
              icon: FilesIcon,
            },
            {
              title: t('sidebar.navigation.questionBank'),
              url: '/question-bank',
              icon: FileQuestionIcon,
            },
            {
              title: t('sidebar.navigation.assessments'),
              url: '/assessments',
              icon: IconCalendarCheck,
            },
            // {
            //   title: t('sidebar.navigation.materials'),
            //   url: '/materials',
            //   icon: FilesIcon,
            // },
            // {
            //   title: t('sidebar.navigation.securedByClerk'),
            //   icon: ClerkLogo,
            //   items: [
            //     {
            //       title: t('sidebar.navigation.login'),
            //       url: '/401',
            //     },
            //     // {
            //     //   title: 'Sign Up',
            //     //   url: '/clerk/sign-up',
            //     // },
            //     // {
            //     //   title: 'User Management',
            //     //   url: '/clerk/user-management',
            //     // },
            //   ],
            // },
          ],
        },
        {
          title: t('sidebar.navGroups.managementSection'),
          items: [
            {
              title: t('sidebar.navigation.usersAndRoles'),
              url: '/users',
              icon: ShieldUser,
            },
            {
              title: t('sidebar.navigation.modules'),
              url: '/modules',
              icon: IconPackages,
            },
            {
              title: t('sidebar.navigation.branchSettings'),
              url: '/branch-settings',
              icon: GitBranch,
            },
          ],
        },
        {
          title: t('sidebar.navGroups.superManagementSection'),
          items: [
            {
              title: t('sidebar.navigation.companiesAndBranches'),
              url: '/companies',
              icon: Building2,
            } as const,
            // {
            //   title: t('sidebar.navigation.auth'),
            //   icon: IconLockAccess,
            //   items: [
            //     {
            //       title: t('sidebar.navigation.login'),
            //       url: '/login',
            //     },
            //     {
            //       title: t('sidebar.navigation.loginTwoCol'),
            //       url: '/login-2',
            //     },
            //     {
            //       title: t('sidebar.navigation.signUp'),
            //       url: '/sign-up',
            //     },
            //     {
            //       title: t('sidebar.navigation.forgotPassword'),
            //       url: '/forgot-password',
            //     },
            //     {
            //       title: t('sidebar.navigation.otp'),
            //       url: '/otp',
            //     },
            //   ],
            // },
            // {
            //   title: t('sidebar.navigation.errors'),
            //   icon: IconBug,
            //   items: [
            //     {
            //       title: t('sidebar.navigation.unauthorized'),
            //       url: '/401',
            //       icon: IconLock,
            //     },
            //     {
            //       title: t('sidebar.navigation.forbidden'),
            //       url: '/403',
            //       icon: IconUserOff,
            //     },
            //     {
            //       title: t('sidebar.navigation.notFound'),
            //       url: '/404',
            //       icon: IconError404,
            //     },
            //     {
            //       title: t('sidebar.navigation.internalServerError'),
            //       url: '/500',
            //       icon: IconServerOff,
            //     },
            //     {
            //       title: t('sidebar.navigation.maintenanceError'),
            //       url: '/503',
            //       icon: IconBarrierBlock,
            //     },
            //   ],
            // },
          ],
        },
        {
          title: t('sidebar.navGroups.supportSection'),
          items: [
            {
              title: t('sidebar.navigation.settings'),
              icon: IconSettings,
              items: [
                {
                  title: t('sidebar.navigation.profile'),
                  url: '/settings',
                  icon: IconUserCog,
                },
                {
                  title: t('sidebar.navigation.inventory'),
                  url: '/settings/inventory',
                  icon: IconDeviceLaptop,
                },
                {
                  title: t('sidebar.navigation.security'),
                  url: '/settings/security',
                  icon: IconLock,
                },
                {
                  title: t('sidebar.navigation.preferences'),
                  url: '/settings/preferences',
                  icon: IconPalette,
                },
                // {
                //   title: 'Notifications',
                //   url: '/settings/notifications',
                //   icon: IconNotification,
                // },
                // {
                //   title: 'Display',
                //   url: '/settings/display',
                //   icon: IconBrowserCheck,
                // },
              ],
            },
            {
              title: t('sidebar.navigation.helpCenter'),
              url: '/help-center',
              icon: IconHelp,
            },
          ],
        },
      ],
    };
  }, [i18n.language]) as SidebarData;

  return {
    sidebarData,
  };
}
