import { useTranslation } from 'react-i18next';

import { AttendanceProvider } from './AttendanceContext';
import { AttendanceTable } from './components';

import { Main } from '@/components/layout/Main';

export function Attendance() {
  const { t } = useTranslation();

  return (
    <AttendanceProvider>
      <Main
        title={t('attendance.title')}
        description={t('attendance.description')}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <AttendanceTable />
        </div>
      </Main>
    </AttendanceProvider>
  );
}
