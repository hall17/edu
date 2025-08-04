import { useTranslation } from 'react-i18next';

import { ClassroomsProvider } from './ClassroomsContext';
import {
  ClassroomsDialogs,
  ClassroomsPrimaryButtons,
  ClassroomsTable,
} from './components';

export function Classrooms() {
  const { t } = useTranslation();

  return (
    <ClassroomsProvider>
      <div className="mb-3">
        <ClassroomsPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <ClassroomsTable />
      </div>

      <ClassroomsDialogs />
    </ClassroomsProvider>
  );
}
