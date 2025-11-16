import { Outlet } from '@tanstack/react-router';

import { NotificationBell } from '../notifications/NotificationBell';
import { NotificationsProvider } from '../notifications/NotificationsContext';

import { ThemeSwitch } from '@/components/ThemeSwitch';
import { cn } from '@/lib/utils';

interface Props {
  children?: React.ReactNode;
}

export function StudentLayout({ children }: Props) {
  return (
    <NotificationsProvider>
      <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
        {/* Student Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-gray-800">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Edusama Student
              </h1>
            </div>

            <nav className="hidden items-center space-x-6 md:flex">
              <a
                href="/student"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Dashboard
              </a>
              <a
                href="/student/classrooms"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                My Classrooms
              </a>
              <a
                href="/student/assessments"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Assessments
              </a>
              <a
                href="/student/grades"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Grades
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <NotificationBell />
              {/* Student Profile Dropdown will go here */}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </NotificationsProvider>
  );
}
