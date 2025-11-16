import { columns } from './components/columns';
import { DataTable } from './components/DataTable';
import { TasksDialogs } from './components/TasksDialogs';
import { TasksProvider } from './context/TasksContext';
import { tasks } from './data/tasks';
import { Main } from '@/components/layout/Main';
import { useTranslation } from 'react-i18next';

export function Tasks() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    {
      label: 'Tasks',
      href: '/tasks',
    },
  ];

  return (
    <TasksProvider>
      <Main breadcrumbItems={breadcrumbItems}>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={tasks} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  );
}
