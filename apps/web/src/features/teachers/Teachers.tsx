import { useTranslation } from 'react-i18next';

import { TeachersDialogs } from './components/dialogs/TeachersDialogs';
import { TeachersPrimaryButtons } from './components/TeachersPrimaryButtons';
import { TeachersTable } from './components/TeachersTable';
import { TeachersProvider } from './TeachersContext';

import { Main } from '@/components/layout/Main';

export function Teachers() {
  const { t } = useTranslation();

  return (
    <TeachersProvider>
      <Main
        title={t('teachers.title')}
        description={t('teachers.description')}
        extra={<TeachersPrimaryButtons />}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <TeachersTable />
        </div>
      </Main>
      <TeachersDialogs />
    </TeachersProvider>
  );
}
