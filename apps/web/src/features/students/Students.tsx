import { useTranslation } from 'react-i18next';

import {
  StudentsDialogs,
  StudentsPrimaryButtons,
  StudentsTable,
} from './components';
import { StudentsProvider } from './StudentsContext';

import { Main } from '@/components/layout/Main';

export function Students() {
  const { t } = useTranslation();

  return (
    <StudentsProvider>
      <Main
        title={t('students.title')}
        description={t('students.description')}
        extra={<StudentsPrimaryButtons />}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <StudentsTable />
        </div>
      </Main>

      <StudentsDialogs />
    </StudentsProvider>
  );
}
